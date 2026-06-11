import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * Visual sweep: drives the app through its main read-path surfaces and saves
 * full-page screenshots to e2e/screenshots/<project>/. The test passes as long
 * as every surface is reachable; the screenshots are the review artifact for
 * design changes (compare a baseline run against a post-change run).
 *
 * Flow notes (ported from the puppeteer-core verification scripts):
 * - The first visit auto-opens the Instructions modal; dismiss via #close-button.
 * - The sample list "(Sample) T'au Empire List" is preloaded in the store.
 * - Phase switching: phone uses the HeadlessUI Listbox in #collapsed-phases;
 *   desktop uses the #<Phase>-button radio ids (they only exist >768px).
 */

const SAMPLE_LIST = "(Sample) World Eaters List";

function shotDir(projectName: string): string {
  const dir = path.join(HERE, "screenshots", projectName);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function shoot(page: Page, projectName: string, name: string) {
  // Settle fonts and theme transitions before capturing.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(shotDir(projectName), `${name}.png`),
    fullPage: true,
  });
}

async function dismissFirstVisitModal(page: Page) {
  await page.goto("/");
  // The Instructions modal's bottom close button. Scope to the open dialog:
  // several modals reuse id="close-button".
  await page.locator("[role=dialog] #close-button").click();
  await expect(page.locator("[role=dialog]")).toHaveCount(0);
}

async function openSampleList(page: Page) {
  await page.getByText(SAMPLE_LIST).first().click();
  // Army view is up once the phase filter renders.
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
}

async function setPhase(page: Page, isPhone: boolean, phase: string) {
  if (isPhone) {
    await page.locator("#collapsed-phases button").click();
    await page.getByRole("option", { name: phase }).click();
  } else {
    await page.locator(`#${phase}-button`).click();
  }
}

async function openSettings(page: Page) {
  await page.locator("#settings-button").click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function closeOpenDialog(page: Page) {
  await page.keyboard.press("Escape");
  await expect(page.locator("[role=dialog]")).toHaveCount(0);
}

test("list index and import surfaces", async ({ page }, testInfo) => {
  await dismissFirstVisitModal(page);
  await shoot(page, testInfo.project.name, "01-list-index");
});

test("unit cards across phases", async ({ page }, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);
  await openSampleList(page);

  for (const phase of ["Pregame", "Shooting", "Saves"]) {
    await setPhase(page, isPhone, phase);
    await shoot(
      page,
      testInfo.project.name,
      `02-army-${phase.toLowerCase()}`,
    );
  }
});

test("modals", async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  await dismissFirstVisitModal(page);

  // Index-level modals.
  await page.locator("#instructions-button").click();
  await shoot(page, project, "03-modal-instructions");
  await page.locator("[role=dialog] #close-button").click();

  await page.locator("#changelog-button").click();
  await shoot(page, project, "03-modal-changelog");
  await closeOpenDialog(page);

  await openSettings(page);
  await shoot(page, project, "03-modal-settings");
  await closeOpenDialog(page);

  // List-row modals (edit / share). Buttons carry aria-labels, but at <=840px
  // the row actions collapse into a kebab Menu that must be opened first.
  const isPhone = testInfo.project.name === "phone";
  const openRowAction = async (label: string) => {
    if (isPhone) {
      // force: the lists table overflows the phone viewport horizontally,
      // which keeps failing Playwright's stability check on the kebab button.
      await page
        .locator("tr", { hasText: SAMPLE_LIST })
        .getByRole("button")
        .first()
        .click({ force: true });
    }
    // Same stability problem inside the kebab menu; see above.
    await page.getByLabel(label).first().click({ force: isPhone });
  };

  await openRowAction("Open Edit List Panel");
  await shoot(page, project, "03-modal-edit-list");
  await closeOpenDialog(page);

  await openRowAction("Open Share Panel");
  await shoot(page, project, "03-modal-share-list");
  await closeOpenDialog(page);

  // Army-view modals.
  await openSampleList(page);

  await page.locator("#print-button").first().click();
  await shoot(page, project, "03-modal-print");
  await closeOpenDialog(page);

  // Edit-force mode exposes the per-unit leader and note buttons.
  await page.locator("#edit-force-button").click();
  await shoot(page, project, "04-edit-force-mode");

  const leaderButton = page
    .getByTitle(/Manage attached units|Attach to leader/)
    .first();
  await leaderButton.click();
  await shoot(page, project, "03-modal-leader-attachment");
  await closeOpenDialog(page);

  // The note trigger is the leader button's sibling in the action cluster.
  await page
    .locator(
      'button[title="Manage attached units"] + button, button[title="Attach to leader"] + button',
    )
    .first()
    .click();
  await shoot(page, project, "03-modal-notes");
  await closeOpenDialog(page);
});

test("provisional auto-attachment badge and detach", async ({
  page,
}, testInfo) => {
  await dismissFirstVisitModal(page);

  // Import a ListForge list whose support character (a Cryptek that can't
  // operate alone) is auto-attached by the importer to an eligible bodyguard,
  // while a `leader`-role epic hero (Imotekh) is left solo. ListForge marks
  // characters by section, so the inference actually fires (newrecruit-simple
  // doesn't encode is_character inline, so it wouldn't).
  const listText = fs.readFileSync(
    path.join(HERE, "fixtures", "necron_attach.txt"),
    "utf8",
  );

  // A fresh list opens straight into the Pastebox (no parsed roster yet).
  await page.locator("#add-list-button").click();
  await page.locator("#comment").fill(listText);
  await page.getByRole("button", { name: "Submit" }).click();

  // Army view is up once the phase filter renders.
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();

  // Exactly one auto-attached badge: the Technomancer under Immortals. Imotekh
  // (a leader) must NOT be auto-attached — a second badge would mean the
  // pre-1.0.6 over-eager inference regressed.
  await expect(page.getByText("auto-attached")).toHaveCount(1);
  await shoot(page, testInfo.project.name, "07-provisional-attachment");

  // Detaching the guessed link clears the badge (the unit becomes top-level).
  // Exact match: a substring match would also catch "Hide Detachment Rules".
  await page.getByRole("button", { name: "detach", exact: true }).click();
  await expect(page.getByText("auto-attached")).toHaveCount(0);
});

test("army rules show verbatim GW text", async ({ page }, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);

  // Import an Aeldari list. Its army rule (Strands of Fate) has authored GW raw
  // text in the vendored ability-text store, so the rules panel must render that
  // prose verbatim rather than the DSL describer's terser approximation.
  const listText = fs.readFileSync(
    path.join(HERE, "..", "src", "assets", "lists", "nr_aeldari.txt"),
    "utf8",
  );
  await page.locator("#add-list-button").click();
  await page.locator("#comment").fill(listText);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();

  // Army/detachment rules only surface in game phases; open the disclosure.
  await setPhase(page, isPhone, "Shooting");
  await page.locator("#army-rule-button").click();

  // A verbatim GW phrase the DSL describer never emits — proves the override,
  // not the fallback, is what renders.
  await expect(
    page.getByText("generate Fate dice by rolling a number of D6"),
  ).toBeVisible();
  await shoot(page, testInfo.project.name, "08-army-rule-gw-text");
});

test("light mode and faction theme", async ({ page }, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);

  // Light mode: toggle the dark-mode checkbox off in Settings. Target the
  // checkbox input inside the "Enable Dark Mode" section; the label text span
  // fails Playwright's hit-target check on the phone viewport.
  // The section div is the heading's parent; it contains exactly one checkbox.
  const darkModeCheckbox = page
    .getByRole("heading", { name: "Enable Dark Mode" })
    .locator("..")
    .locator("input[type=checkbox]");

  await openSettings(page);
  await darkModeCheckbox.click({ force: true });
  // Assert the toggle actually landed: App.tsx drops the `dark` class.
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await closeOpenDialog(page);
  await openSampleList(page);
  await setPhase(page, isPhone, "Shooting");
  await shoot(page, testInfo.project.name, "05-light-mode-shooting");

  // Faction theme override: T'au has a strong accent shift away from the
  // sample list's auto-resolved World Eaters palette.
  await openSettings(page);
  await page.getByRole("button", { name: "T'au Empire" }).click();
  await darkModeCheckbox.click({ force: true });
  await closeOpenDialog(page);
  await shoot(page, testInfo.project.name, "06-theme-override-dark");
});
