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
  // Wait for the first-visit modal to actually render before clicking — under
  // full-parallel load on the phone viewport the goto can settle before the
  // dialog mounts, and clicking a not-yet-present close button flakes.
  const dialog = page.locator("[role=dialog]");
  await expect(dialog).toBeVisible();
  // The Instructions modal's bottom close button. Scope to the open dialog:
  // several modals reuse id="close-button".
  await page.locator("[role=dialog] #close-button").click();
  await expect(dialog).toHaveCount(0);
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

test("recovers pre-detachments[] saved lists without a black screen", async ({
  page,
}, testInfo) => {
  // Regression: a roster persisted before the 40kdc `Roster` gained the plural
  // `detachments[]` / `units[]` arrays rehydrates without those fields, and the
  // selectors' unguarded `.map` blanked the whole app on load (the reported
  // "black screen"). The store migration must backfill (reparse) such rosters,
  // and the selector guards must never throw on the missing fields.
  const pageErrors: string[] = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await dismissFirstVisitModal(page);

  // Seed a real, current-shape roster into the persisted store.
  const listText = fs.readFileSync(
    path.join(HERE, "fixtures", "necron_attach.txt"),
    "utf8",
  );
  await page.locator("#add-list-button").click();
  await page.locator("#comment").fill(listText);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();

  // Corrupt each shape-drifting field in turn, roll the persisted version back
  // to the pre-migration 28, and confirm the app recovers on reload instead of
  // crashing. "detachments" is the field from the real crash reports; "units"
  // shares the same guard and backfill path.
  for (const field of ["detachments", "units"] as const) {
    await page.evaluate((dropField) => {
      const raw = localStorage.getItem("army-storage");
      if (!raw) throw new Error("expected persisted army-storage");
      const parsed = JSON.parse(raw);
      for (const sr of parsed.state?.storedRosters ?? []) {
        if (sr.roster) delete sr.roster[dropField];
      }
      parsed.version = 28;
      localStorage.setItem("army-storage", JSON.stringify(parsed));
    }, field);

    await page.goto("/");

    // The app reopens the active list's army view. It rendering at all (the
    // phase filter is visible) proves the migration backfilled the crashing
    // roster rather than the selectors throwing and blanking the tree.
    await expect(
      page.locator("#collapsed-phases, #Pregame-button").first(),
    ).toBeVisible();
    expect(
      pageErrors.filter((m) =>
        m.includes("Cannot read properties of undefined"),
      ),
      `dropping roster.${field} must not crash the app`,
    ).toEqual([]);

    // The backfill reparsed the field back onto the persisted roster.
    const restored = await page.evaluate((dropField) => {
      const raw = localStorage.getItem("army-storage");
      const parsed = JSON.parse(raw ?? "{}");
      return (parsed.state?.storedRosters ?? []).every(
        (sr: { roster: Record<string, unknown> | null }) =>
          !sr.roster || Array.isArray(sr.roster[dropField]),
      );
    }, field);
    expect(restored, `roster.${field} should be restored after reload`).toBe(
      true,
    );
  }

  await shoot(page, testInfo.project.name, "09-migration-recovery");
});

test("imports a real ListForge multi-detachment list with attached leaders", async ({
  page,
}, testInfo) => {
  // End-to-end for the 1.0.21 ListForge importer fixes: a real Leagues of
  // Votann export whose header carries two detachments plus a Force Disposition,
  // and whose `Attached Units:` section attaches `leader`-role epic heroes
  // (which the support-only inference never attaches). Pre-1.0.21 this imported
  // with no detachment rules and with the leaders dropped as separate units.
  const isPhone = testInfo.project.name === "phone";
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  await dismissFirstVisitModal(page);
  const listText = fs.readFileSync(
    path.join(HERE, "fixtures", "votann_attach.txt"),
    "utf8",
  );
  await page.locator("#add-list-button").click();
  await page.locator("#comment").fill(listText);
  await page.getByRole("button", { name: "Submit" }).click();

  // Army view renders (no black screen from an import-shape the app can't map).
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
  expect(
    pageErrors.filter((m) => m.includes("Cannot read properties of undefined")),
  ).toEqual([]);

  // Bug 2: both detachments resolved (the header parser no longer mistakes the
  // disposition for the faction), so the detachment name shows both.
  await expect(page.getByText("Hearthfyre Arsenal").first()).toBeVisible();
  await expect(page.getByText("Hearthguard Covenant").first()).toBeVisible();

  // Bug 2 (rules): the detachment rule surfaces in a game phase.
  await setPhase(page, isPhone, "Shooting");
  await page.locator("#army-rule-button").click();

  // Bug 3: the attached leader Kâhl imported (not dropped) and its bodyguard
  // Einhyr Hearthguard is rendered nested under it, so both names are present.
  await expect(page.getByText("Kâhl").first()).toBeVisible();

  await shoot(page, testInfo.project.name, "10-votann-attach");
});

async function importFixture(page: Page, fixture: string) {
  const listText = fs.readFileSync(
    path.join(HERE, "fixtures", fixture),
    "utf8",
  );
  await page.locator("#add-list-button").click();
  await page.locator("#comment").fill(listText);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
}

test("attach hint enables edit force mode and reveals the attach control", async ({
  page,
}) => {
  // The leader-attachment UI lives behind Edit Force Mode (off by default), so a
  // user never sees it unless they toggle the header pencil. The per-card hint
  // is the discoverable nudge: it appears on attachment-eligible cards while
  // edit mode is off, and one tap turns edit mode on and reveals the real
  // UserGroup attach button. necron_attach leaves Imotekh (a leader) solo, so at
  // least one top-level card is attachment-eligible and shows the hint.
  await dismissFirstVisitModal(page);
  await importFixture(page, "necron_attach.txt");

  const hint = page.getByRole("button", { name: /tap to enable editing/i });
  const attachButton = page
    .getByTitle(/Manage attached units|Attach to leader/)
    .first();

  // Edit mode off: the hint is visible, the real attach control is not.
  await expect(hint.first()).toBeVisible();
  await expect(attachButton).toHaveCount(0);

  // One tap turns on edit mode, hides the hint, and surfaces the attach button.
  await hint.first().click();
  await expect(page.getByRole("button", { name: /tap to enable editing/i })).toHaveCount(
    0,
  );
  await expect(attachButton).toBeVisible();
});

test("attach hint dismissal persists across reload", async ({ page }) => {
  // The dismiss "x" flips a persisted flag so the nudge shows once and stays
  // gone — without enabling edit mode (that's the tap-the-bar path).
  await dismissFirstVisitModal(page);
  await importFixture(page, "necron_attach.txt");

  await expect(
    page.getByRole("button", { name: /tap to enable editing/i }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Dismiss attach hint" }).first().click();
  await expect(
    page.getByRole("button", { name: /tap to enable editing/i }),
  ).toHaveCount(0);
  // Dismissing must NOT enable edit mode (only the bar tap does that).
  await expect(
    page.getByTitle(/Manage attached units|Attach to leader/),
  ).toHaveCount(0);

  await page.goto("/");
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /tap to enable editing/i }),
  ).toHaveCount(0);
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
