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
  // Visual tests exercise their own flows, not onboarding. Seed the persisted
  // visit flag before the first application load so a delayed Instructions
  // dialog cannot obscure a test's first interaction under parallel load.
  // The sentinel preserves storage mutations that a test deliberately carries
  // across a later reload.
  await page.addInitScript(() => {
    if (sessionStorage.getItem("visual-test-initialized")) return;
    sessionStorage.setItem("visual-test-initialized", "true");
    localStorage.setItem(
      "army-storage",
      JSON.stringify({ state: { isFirstVisit: false }, version: 30 }),
    );
  });
  await page.goto("/");
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
    .getByTitle(/Manage attachments|Attach to unit/)
    .first();
  await leaderButton.click();
  await shoot(page, project, "03-modal-leader-attachment");
  await closeOpenDialog(page);

  // The note trigger is the leader button's sibling in the action cluster.
  await page
    .locator(
      'button[title="Manage attachments"] + button, button[title="Attach to unit"] + button',
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

test("renders a chapter roster with a shared detachment id", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await dismissFirstVisitModal(page);
  await importFixture(page, "salamanders-librarius.json");
  await expect(page.getByText("Librarius Conclave").first()).toBeVisible();
  expect(
    pageErrors.filter((message) =>
      message.includes("Ambiguous detachment lookup"),
    ),
  ).toEqual([]);
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

  // Bug 3: the imported leader and its bodyguard both render in the same
  // bodyguard-rooted attachment group.
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
test("Sororitas multi-attachment manager", async ({ page }, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);
  await importFixture(page, "sororitas_attachment.txt");
  await page.locator("#edit-force-button").click();

  await page
    .getByRole("button", {
      name: "Manage attachments for Celestian Sacresants",
    })
    .click();
  const dialog = page.getByRole("dialog");
  const attachedCharacters = dialog.getByRole("list", {
    name: "Attached characters",
  });

  await dialog.getByRole("button", { name: "Attach Palatine" }).click();
  await expect(attachedCharacters).toContainText("Palatine");
  await expect(attachedCharacters).toContainText("Leader");

  await dialog.getByRole("button", { name: "Attach Imagifier" }).click();
  await expect(attachedCharacters).toContainText("Imagifier");
  await expect(attachedCharacters).toContainText("Support");

  await dialog.getByText("Close", { exact: true }).click();
  await setPhase(page, isPhone, "Fight");
  await expect(
    page.getByText("Fury of the Righteous", { exact: true }),
  ).toBeVisible();
  await shoot(page, testInfo.project.name, "11-sororitas-multi-attachment");
});

test("Sororitas multi-attachment character handoff", async ({ page }) => {
  await dismissFirstVisitModal(page);
  await importFixture(page, "sororitas_attachment.txt");
  await page.locator("#edit-force-button").click();

  await page
    .getByRole("button", { name: "Manage attachments for Palatine" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Attach to Celestian Sacresants" })
    .click();
  await expect(
    dialog.getByRole("heading", {
      name: "Attachments: Celestian Sacresants",
    }),
  ).toBeVisible();
});

test("Tyranids display preserves rules, attachments, and abilities", async ({
  page,
}, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);
  await importFixture(page, "tyranids-display.txt");
  await setPhase(page, isPhone, "Command");

  await page.locator("#army-rule-button").click();
  await expect(
    page.getByText("Shadow in the Warp - Army Rule", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Synapse - Army Rule", { exact: true }),
  ).toBeVisible();
  const warriorName = "Tyranid Warriors with Melee Bio-weapons";
  const primeName = "Tyranid Prime with Lash Whip";
  const topLevelCards = page.locator("ul.group");
  const warriorCards = topLevelCards.filter({
    has: page.getByText(warriorName, { exact: true }),
  });
  await expect(warriorCards).toHaveCount(3);

  const attachedGroups = warriorCards.filter({
    hasText: "Attached Characters:",
  });
  await expect(attachedGroups).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(
      attachedGroups
        .nth(index)
        .locator("ul")
        .filter({ hasText: primeName }),
    ).toHaveCount(1);
  }

  const unattachedWarriors = warriorCards.filter({
    hasNotText: "Attached Characters:",
  });
  await expect(unattachedWarriors).toHaveCount(1);
  await expect(
    unattachedWarriors.getByText("[2x]", { exact: true }),
  ).toBeVisible();

  const zoanthropes = topLevelCards.filter({
    has: page.getByText("Zoanthropes", { exact: true }),
  });
  for (const abilityName of [
    "Spirit Leech (Aura, Psychic)",
    "Warp Field (Aura, Psychic)",
  ]) {
    await expect(
      zoanthropes.getByText(abilityName, { exact: true }),
    ).toBeVisible();
  }
  await setPhase(page, isPhone, "Fight");
  await expect(
    page.getByText("Shadow in the Warp - Army Rule", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Synapse - Army Rule", { exact: true }),
  ).toBeVisible();
  for (const abilityName of [
    "Spirit Leech (Aura, Psychic)",
    "Warp Field (Aura, Psychic)",
  ]) {
    await expect(
      zoanthropes.getByText(abilityName, { exact: true }),
    ).toBeVisible();
  }
  await shoot(page, testInfo.project.name, "12-tyranids-display-fight");
});


test("Champions enhancements render vendored raw text", async ({
  page,
}, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  await dismissFirstVisitModal(page);
  await importFixture(page, "sororitas_champions.txt");

  for (const [name, sourcePhrase] of [
    ["Sanctified Amulet", "cannot be set up within 12"],
    ["Triptych of Judgement", "ignore any or all modifiers"],
  ]) {
    const heading = page
      .locator("div.text-md")
      .filter({ hasText: name })
      .first();
    await expect(heading).toBeVisible();
    await expect(heading.locator("xpath=following-sibling::div[1]")).toContainText(
      sourcePhrase,
    );
  }

  await setPhase(page, isPhone, "Movement");
  await page.locator("#open-stratagems-button").click();
  const stratagem = page
    .locator("#stratagem-panel li")
    .filter({ hasText: "Indefatigable Dedication" });
  await expect(stratagem).toBeVisible();
});

test("plural attachments keep leader and supports on one bodyguard", async ({
  page,
}) => {
  await dismissFirstVisitModal(page);
  await importFixture(page, "sororitas_champions.txt");

  const battleSisters = page
    .getByText("Battle Sisters Squad", { exact: true })
    .locator("xpath=ancestor::ul[1]");
  await expect(battleSisters).toContainText("Attached Characters:");
  for (const [name, role] of [
    ["Palatine", "Leader"],
    ["Dialogus", "Support"],
    ["Imagifier", "Support"],
  ] as const) {
    const attachedCard = battleSisters
      .locator("ul")
      .filter({ hasText: name })
      .first();
    await expect(attachedCard).toContainText(role);
  }

  const dialogusCard = battleSisters
    .locator("ul")
    .filter({ hasText: "Dialogus" })
    .first();
  await dialogusCard
    .getByRole("button", { name: "detach", exact: true })
    .click();
  await expect(battleSisters).not.toContainText("Dialogus");
  await expect(battleSisters).toContainText("Palatine");
  await expect(battleSisters).toContainText("Imagifier");

  await page.locator("#edit-force-button").click();
  const firstVahlCard = page
    .locator("ul ul")
    .filter({ hasText: "Morvenn Vahl" })
    .first();
  await firstVahlCard
    .getByRole("button", { name: "detach", exact: true })
    .click();

  const detachedVahlCard = page
    .getByText("Morvenn Vahl", { exact: true })
    .locator("xpath=ancestor::ul[1]");
  await detachedVahlCard
    .getByRole("button", { name: "Manage attachments for Morvenn Vahl" })
    .click();
  const paragonChoices = page.getByRole("button", {
    name: "Attach to Paragon Warsuits",
  });
  await expect(paragonChoices).toHaveCount(2);
  await paragonChoices.nth(1).click();

  const paragonCards = page
    .getByText("Paragon Warsuits", { exact: true })
    .locator("xpath=ancestor::ul[1]");
  await expect(paragonCards).toHaveCount(2);
  await expect(paragonCards.nth(0)).not.toContainText("Morvenn Vahl");
  await expect(paragonCards.nth(1)).toContainText("Morvenn Vahl");
  await page
    .getByRole("dialog")
    .getByText("Close", { exact: true })
    .click();


  await page.locator("#print-button").first().click();
  const printGroups = page
    .locator("#print-root .leader-unit-group")
    .filter({ hasText: "Battle Sisters Squad" });
  expect(await printGroups.count()).toBeGreaterThan(0);
  await expect(printGroups.first()).toContainText("Palatine");
  await expect(printGroups.first()).toContainText("Imagifier");
  await expect(printGroups.first()).not.toContainText("Dialogus");
});

test("persisted attachment migration preserves overrides", async ({ page }) => {
  await dismissFirstVisitModal(page);
  await importFixture(page, "sororitas_champions.txt");

  const expected = await page.evaluate(() => {
    const raw = localStorage.getItem("army-storage");
    if (!raw) throw new Error("expected persisted army-storage");
    const parsed = JSON.parse(raw);
    const state = parsed.state;
    const stored = state.storedRosters[state.activeList];
    const units = stored.roster.units;
    const byName = (name: string, occurrence = 0) => {
      const matches = units
        .map((unit: { ref: { raw_name: string } }, index: number) => ({
          name: unit.ref.raw_name,
          index,
        }))
        .filter((unit: { name: string }) => unit.name === name);
      if (!matches[occurrence]) throw new Error(`missing ${name}`);
      return matches[occurrence].index;
    };
    const palatine = byName("Palatine");
    const battleSisters = byName("Battle Sisters Squad");
    const vahl = byName("Morvenn Vahl");
    const firstParagons = byName("Paragon Warsuits");
    const secondParagons = byName("Paragon Warsuits", 1);

    stored.unitState[battleSisters] = {
      ...stored.unitState[battleSisters],
      toggled: true,
      notes: [
        {
          title: "Keep",
          content: "Unrelated state",
          phases: ["Command"],
        },
      ],
      modelCounts: { "Battle Sister": 7 },
      attachedToLeaderIndex: palatine,
    };
    stored.unitState[firstParagons] = {
      ...stored.unitState[firstParagons],
      attachedToLeaderIndex: null,
    };
    stored.unitState[secondParagons] = {
      ...stored.unitState[secondParagons],
      attachedToLeaderIndex: "malformed",
    };
    parsed.version = 29;
    localStorage.setItem("army-storage", JSON.stringify(parsed));

    return {
      palatine,
      battleSisters,
      vahl,
      firstParagons,
      secondParagons,
      settings: JSON.stringify(state.settings),
      bodyguardOverlay: JSON.stringify({
        toggled: true,
        notes: [
          {
            title: "Keep",
            content: "Unrelated state",
            phases: ["Command"],
          },
        ],
        modelCounts: { "Battle Sister": 7 },
      }),
      storedMetadata: JSON.stringify({
        uuid: stored.uuid,
        name: stored.name,
        phase: stored.phase,
        created: stored.created,
        updated: stored.updated,
      }),
    };
  });

  await page.goto("/");
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();

  const migrated = await page.evaluate(() => {
    const parsed = JSON.parse(localStorage.getItem("army-storage") ?? "{}");
    const state = parsed.state;
    const stored = state.storedRosters[state.activeList];
    return {
      version: parsed.version,
      settings: JSON.stringify(state.settings),
      unitState: stored.unitState,
      storedMetadata: JSON.stringify({
        uuid: stored.uuid,
        name: stored.name,
        phase: stored.phase,
        created: stored.created,
        updated: stored.updated,
      }),
    };
  });

  expect(migrated.version).toBe(30);
  expect(migrated.settings).toBe(expected.settings);
  expect(migrated.storedMetadata).toBe(expected.storedMetadata);
  expect(migrated.unitState[expected.palatine].attachedBodyguardIndex).toBe(
    expected.battleSisters,
  );
  expect(migrated.unitState[expected.vahl].attachedBodyguardIndex).toBeNull();
  expect(
    Object.hasOwn(
      migrated.unitState[expected.secondParagons],
      "attachedBodyguardIndex",
    ),
  ).toBe(false);
  expect(
    JSON.stringify(migrated.unitState[expected.battleSisters]),
  ).toBe(expected.bodyguardOverlay);
  expect(JSON.stringify(migrated.unitState)).not.toContain(
    "attachedToLeaderIndex",
  );

  await page.evaluate((palatineIndex) => {
    const parsed = JSON.parse(localStorage.getItem("army-storage") ?? "{}");
    const state = parsed.state;
    const stored = state.storedRosters[state.activeList];
    stored.unitState[palatineIndex].attachedBodyguardIndex = 999;
    localStorage.setItem("army-storage", JSON.stringify(parsed));
  }, expected.palatine);
  await page.goto("/");
  await expect(
    page
      .getByText("Palatine", { exact: true })
      .locator("xpath=ancestor::ul[1]"),
  ).toBeVisible();
});

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
    .getByTitle(/Manage attachments|Attach to unit/)
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
    page.getByTitle(/Manage attachments|Attach to unit/),
  ).toHaveCount(0);

  await page.goto("/");
  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /tap to enable editing/i }),
  ).toHaveCount(0);
});

test("renders the faction-scoped Firestorm detachment without crashing", async ({
  page,
}, testInfo) => {
  const isPhone = testInfo.project.name === "phone";
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await dismissFirstVisitModal(page);
  await importFixture(page, "ultramarines-firestorm-gw.txt");

  await expect(
    page.locator("#collapsed-phases, #Pregame-button").first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Firestorm Assault Force/ }),
  ).toBeVisible();

  await setPhase(page, isPhone, "Shooting");
  await page.locator("#army-rule-button").click();
  await page.locator("#print-button").first().click();
  await expect(page.locator("#print-root")).toBeAttached();
  await page.getByRole("dialog").locator("#close-button").click();

  await page.locator("#reset-button").click();
  await expect(page.locator("#add-list-button")).toBeVisible();
  await expect(
    page.getByText("Firestorm Assault Force", { exact: false }).first(),
  ).toBeVisible();
  expect(
    pageErrors.some((message) =>
      message.includes("Ambiguous detachment lookup"),
    ),
  ).toBe(false);
});

test("recovers a persisted roster render failure without losing source text", async ({
  page,
}) => {
  await dismissFirstVisitModal(page);
  await importFixture(page, "necron_attach.txt");

  const saved = await page.evaluate(() => {
    const raw = localStorage.getItem("army-storage");
    if (!raw) throw new Error("expected persisted army-storage");
    const parsed = JSON.parse(raw);
    const stored = parsed.state.storedRosters[parsed.state.activeList];
    return { uuid: stored.uuid, rawText: stored.rawText };
  });

  await page.evaluate(() => {
    const raw = localStorage.getItem("army-storage");
    if (!raw) throw new Error("expected persisted army-storage");
    const parsed = JSON.parse(raw);
    const stored = parsed.state.storedRosters[parsed.state.activeList];
    delete stored.roster.units[0].ref;
    localStorage.setItem("army-storage", JSON.stringify(parsed));
  });
  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText(
    "We couldn't display this list. Its source text is still saved.",
  );
  await expect(page.locator("#render-error-return-button")).toBeVisible();
  await page.locator("#render-error-return-button").click();

  await expect(page.locator("#add-list-button")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((uuid) => {
        const raw = localStorage.getItem("army-storage");
        const parsed = JSON.parse(raw ?? "{}");
        return parsed.state?.storedRosters?.find(
          (stored: { uuid: string }) => stored.uuid === uuid,
        )?.rawText;
      }, saved.uuid),
    )
    .toBe(saved.rawText);
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
