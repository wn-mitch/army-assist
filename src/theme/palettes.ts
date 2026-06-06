/**
 * Faction-themed palette system.
 *
 * Each faction provides a full set of CSS custom property overrides for dark
 * and light modes. The default theme (Space Wolves / Frostbite) is applied
 * in app.css. At runtime, a faction switcher can override these properties
 * on a wrapper element to re-theme the entire UI.
 */

export interface PaletteTokens {
	'bg': string;
	'bg-dark': string;
	'surface': string;
	'border': string;
	'text': string;
	'text-muted': string;
	'text-dim': string;
	'accent': string;
	'accent-foreground': string;
	'accent-hover': string;
	'panel': string;
	'panel-surface': string;
	'panel-border': string;
	'panel-hover': string;
}

export interface Palette {
	dark: PaletteTokens;
	light: PaletteTokens;
}

export interface FactionTheme {
	id: string;
	name: string;
	tagline: string;
	palette: Palette;
}

// ---------------------------------------------------------------------------
// Default: Space Wolves (Frostbite)
// ---------------------------------------------------------------------------

export const spaceWolves: FactionTheme = {
	id: 'space-wolves',
	name: 'Space Wolves',
	tagline: 'For Russ and the Allfather!',
	palette: {
		dark: {
			'bg': '#0e0e10',
			'bg-dark': '#090a0c',
			'surface': '#19191e',
			'border': '#2c2c33',
			'text': '#eeeef2',
			'text-muted': '#888894',
			'text-dim': '#5a5a64',
			'accent': '#22d3ee',
			'accent-foreground': '#ffffff',
			'accent-hover': '#06b6d4',
			'panel': '#0b0b0d',
			'panel-surface': '#141416',
			'panel-border': '#242428',
			'panel-hover': '#1c1c20',
		},
		light: {
			'bg': '#f0f1f4',
			'bg-dark': '#e0e2e8',
			'surface': '#f8f9fb',
			'border': '#c2c4cc',
			'text': '#101014',
			'text-muted': '#44464f',
			'text-dim': '#686874',
			'accent': '#0891b2',
			'accent-foreground': '#ffffff',
			'accent-hover': '#0e7490',
			'panel': '#e6e8ed',
			'panel-surface': '#f0f1f4',
			'panel-border': '#cacdd5',
			'panel-hover': '#dadde4',
		},
	},
};

// ---------------------------------------------------------------------------
// Blood Angels — warm crimson, warm-neutral grays
// ---------------------------------------------------------------------------

export const bloodAngels: FactionTheme = {
	id: 'blood-angels',
	name: 'Blood Angels',
	tagline: 'By the blood of Sanguinius!',
	palette: {
		dark: {
			'bg': '#110e0e',
			'bg-dark': '#0c0909',
			'surface': '#1e1919',
			'border': '#332c2c',
			'text': '#f2eded',
			'text-muted': '#948888',
			'text-dim': '#645a5a',
			'accent': '#dc2626',
			'accent-foreground': '#ffffff',
			'accent-hover': '#b91c1c',
			'panel': '#0d0a0a',
			'panel-surface': '#161212',
			'panel-border': '#2a2424',
			'panel-hover': '#201a1a',
		},
		light: {
			'bg': '#f4f0f0',
			'bg-dark': '#e8e0e0',
			'surface': '#fbf8f8',
			'border': '#ccc4c4',
			'text': '#141010',
			'text-muted': '#504444',
			'text-dim': '#746868',
			'accent': '#dc2626',
			'accent-foreground': '#ffffff',
			'accent-hover': '#b91c1c',
			'panel': '#ece6e6',
			'panel-surface': '#f4f0f0',
			'panel-border': '#d4cccc',
			'panel-hover': '#ddd6d6',
		},
	},
};

// ---------------------------------------------------------------------------
// Dark Angels — deep forest green, cool-dark grays
// ---------------------------------------------------------------------------

export const darkAngels: FactionTheme = {
	id: 'dark-angels',
	name: 'Dark Angels',
	tagline: 'Repent! For tomorrow you die!',
	palette: {
		dark: {
			'bg': '#0d0f0e',
			'bg-dark': '#090b0a',
			'surface': '#171b19',
			'border': '#282e2b',
			'text': '#ecf0ee',
			'text-muted': '#849089',
			'text-dim': '#576058',
			'accent': '#15803d',
			'accent-foreground': '#ffffff',
			'accent-hover': '#166534',
			'panel': '#0a0c0b',
			'panel-surface': '#121614',
			'panel-border': '#202624',
			'panel-hover': '#1a1f1c',
		},
		light: {
			'bg': '#eef2f0',
			'bg-dark': '#dfe6e2',
			'surface': '#f7faf8',
			'border': '#bfc8c2',
			'text': '#101412',
			'text-muted': '#3f4840',
			'text-dim': '#647069',
			'accent': '#15803d',
			'accent-foreground': '#ffffff',
			'accent-hover': '#166534',
			'panel': '#e6ece8',
			'panel-surface': '#eef2f0',
			'panel-border': '#c8d0cc',
			'panel-hover': '#d8e0dc',
		},
	},
};

// ---------------------------------------------------------------------------
// Ultramarines — cobalt blue, neutral grays
// ---------------------------------------------------------------------------

export const ultramarines: FactionTheme = {
	id: 'ultramarines',
	name: 'Ultramarines',
	tagline: 'Courage and honour!',
	palette: {
		dark: {
			'bg': '#0e0e11',
			'bg-dark': '#090a0d',
			'surface': '#18191e',
			'border': '#2b2c34',
			'text': '#ededf2',
			'text-muted': '#888894',
			'text-dim': '#5a5a66',
			'accent': '#3b82f6',
			'accent-foreground': '#ffffff',
			'accent-hover': '#2563eb',
			'panel': '#0b0b0e',
			'panel-surface': '#131416',
			'panel-border': '#232428',
			'panel-hover': '#1b1c22',
		},
		light: {
			'bg': '#eff0f5',
			'bg-dark': '#e0e2ea',
			'surface': '#f8f8fc',
			'border': '#c0c2cc',
			'text': '#101014',
			'text-muted': '#42444f',
			'text-dim': '#686874',
			'accent': '#2563eb',
			'accent-foreground': '#ffffff',
			'accent-hover': '#1d4ed8',
			'panel': '#e6e8f0',
			'panel-surface': '#eff0f5',
			'panel-border': '#c8cad6',
			'panel-hover': '#d8dae6',
		},
	},
};

// ---------------------------------------------------------------------------
// Necrons — eerie green glow, cold metallic grays
// ---------------------------------------------------------------------------

export const necrons: FactionTheme = {
	id: 'necrons',
	name: 'Necrons',
	tagline: 'We are the supreme rulers of the galaxy.',
	palette: {
		dark: {
			'bg': '#0c0d0c',
			'bg-dark': '#080908',
			'surface': '#161816',
			'border': '#292c29',
			'text': '#e8ece8',
			'text-muted': '#828a82',
			'text-dim': '#565c56',
			'accent': '#4ade80',
			'accent-foreground': '#052e16',
			'accent-hover': '#22c55e',
			'panel': '#0a0b0a',
			'panel-surface': '#121412',
			'panel-border': '#222422',
			'panel-hover': '#1a1c1a',
		},
		light: {
			'bg': '#eef0ee',
			'bg-dark': '#dfe2df',
			'surface': '#f6f8f6',
			'border': '#c0c6c0',
			'text': '#0e100e',
			'text-muted': '#3e443e',
			'text-dim': '#626a62',
			'accent': '#16a34a',
			'accent-foreground': '#ffffff',
			'accent-hover': '#15803d',
			'panel': '#e6eae6',
			'panel-surface': '#eef0ee',
			'panel-border': '#c8cec8',
			'panel-hover': '#d8dcd8',
		},
	},
};

// ---------------------------------------------------------------------------
// T'au Empire — ochre/orange accent, clean neutral grays
// ---------------------------------------------------------------------------

export const tauEmpire: FactionTheme = {
	id: 'tau-empire',
	name: "T'au Empire",
	tagline: 'For the Greater Good!',
	palette: {
		dark: {
			'bg': '#101010',
			'bg-dark': '#0b0b0b',
			'surface': '#1c1b1a',
			'border': '#302e2c',
			'text': '#efeeec',
			'text-muted': '#8c8a86',
			'text-dim': '#5e5c58',
			'accent': '#f59e0b',
			'accent-foreground': '#451a03',
			'accent-hover': '#d97706',
			'panel': '#0c0c0c',
			'panel-surface': '#161514',
			'panel-border': '#272624',
			'panel-hover': '#1e1d1c',
		},
		light: {
			'bg': '#f2f1ef',
			'bg-dark': '#e4e2de',
			'surface': '#faf9f7',
			'border': '#c8c6c0',
			'text': '#131210',
			'text-muted': '#484640',
			'text-dim': '#6c6a66',
			'accent': '#d97706',
			'accent-foreground': '#ffffff',
			'accent-hover': '#b45309',
			'panel': '#eae8e4',
			'panel-surface': '#f2f1ef',
			'panel-border': '#d0cec8',
			'panel-hover': '#dcdad6',
		},
	},
};

// ---------------------------------------------------------------------------
// Default — faction-neutral teal, the baseline for new users
// ---------------------------------------------------------------------------

export const neutral: FactionTheme = {
	id: 'neutral',
	name: 'Neutral',
	tagline: 'Default theme — no allegiance',
	palette: {
		dark: {
			'bg': '#0f0f11',
			'bg-dark': '#0a0a0c',
			'surface': '#1b1b1f',
			'border': '#2e2e34',
			'text': '#ededf0',
			'text-muted': '#a8a8b2',
			'text-dim': '#8a8a94',
			'accent': '#14b8a6',
			'accent-foreground': '#0a1f1c',
			'accent-hover': '#0d9488',
			'panel': '#0c0c0e',
			'panel-surface': '#151517',
			'panel-border': '#262629',
			'panel-hover': '#1e1e22',
		},
		light: {
			'bg': '#f0f0f3',
			'bg-dark': '#e2e2e7',
			'surface': '#f8f8fa',
			'border': '#c4c4cc',
			'text': '#111114',
			'text-muted': '#46464f',
			'text-dim': '#6b6b76',
			'accent': '#0d9488',
			'accent-foreground': '#ffffff',
			'accent-hover': '#0a7c72',
			'panel': '#e8e8ec',
			'panel-surface': '#f0f0f3',
			'panel-border': '#ccccd4',
			'panel-hover': '#dcdce2',
		},
	},
};

// ---------------------------------------------------------------------------
// Imperial Fists — warm yellow, ochre-tinted grays
// ---------------------------------------------------------------------------

export const imperialFists: FactionTheme = {
	id: 'imperial-fists',
	name: 'Imperial Fists',
	tagline: 'Primarch-Progenitor, to your glory!',
	palette: {
		dark: {
			'bg': '#0f0e0a',
			'bg-dark': '#0a0907',
			'surface': '#1b1a14',
			'border': '#302e24',
			'text': '#f0efea',
			'text-muted': '#a8a69c',
			'text-dim': '#8a8880',
			'accent': '#facc15',
			'accent-foreground': '#422006',
			'accent-hover': '#eab308',
			'panel': '#0b0a07',
			'panel-surface': '#141109',
			'panel-border': '#272420',
			'panel-hover': '#1e1c14',
		},
		light: {
			'bg': '#f2f1ec',
			'bg-dark': '#e4e2da',
			'surface': '#faf9f5',
			'border': '#c8c6bc',
			'text': '#131210',
			'text-muted': '#484640',
			'text-dim': '#6c6a62',
			'accent': '#ca9a04',
			'accent-foreground': '#ffffff',
			'accent-hover': '#a17d03',
			'panel': '#eae8e0',
			'panel-surface': '#f2f1ec',
			'panel-border': '#d0cec4',
			'panel-hover': '#dcdad2',
		},
	},
};

// ---------------------------------------------------------------------------
// White Scars — silver/white accent, cool neutral grays
// ---------------------------------------------------------------------------

export const whiteScars: FactionTheme = {
	id: 'white-scars',
	name: 'White Scars',
	tagline: 'For the Khan and the Emperor!',
	palette: {
		dark: {
			'bg': '#0e0e10',
			'bg-dark': '#09090c',
			'surface': '#1a1a1e',
			'border': '#2e2e34',
			'text': '#ededf0',
			'text-muted': '#a8a8b2',
			'text-dim': '#8a8a94',
			'accent': '#e5e7eb',
			'accent-foreground': '#0f172a',
			'accent-hover': '#cbd5e1',
			'panel': '#0a0a0c',
			'panel-surface': '#141418',
			'panel-border': '#262629',
			'panel-hover': '#1e1e22',
		},
		light: {
			'bg': '#f0f0f3',
			'bg-dark': '#e2e2e7',
			'surface': '#f8f8fa',
			'border': '#c4c4cc',
			'text': '#111114',
			'text-muted': '#46464f',
			'text-dim': '#6b6b76',
			'accent': '#374151',
			'accent-foreground': '#ffffff',
			'accent-hover': '#1f2937',
			'panel': '#e8e8ec',
			'panel-surface': '#f0f0f3',
			'panel-border': '#ccccd4',
			'panel-hover': '#dcdce2',
		},
	},
};

// ---------------------------------------------------------------------------
// Sisters of Battle — austere black accent, pure neutral grays
// ---------------------------------------------------------------------------

export const sistersOfBattle: FactionTheme = {
	id: 'sisters-of-battle',
	name: 'Sisters of Battle',
	tagline: 'The Emperor protects!',
	palette: {
		dark: {
			'bg': '#0a0a0a',
			'bg-dark': '#060606',
			'surface': '#151515',
			'border': '#2a2a2a',
			'text': '#ebebeb',
			'text-muted': '#a6a6a6',
			'text-dim': '#888888',
			'accent': '#171717',
			'accent-foreground': '#fafafa',
			'accent-hover': '#262626',
			'panel': '#050505',
			'panel-surface': '#0f0f0f',
			'panel-border': '#2a2a2a',
			'panel-hover': '#1a1a1a',
		},
		light: {
			'bg': '#eeeeee',
			'bg-dark': '#e0e0e0',
			'surface': '#f6f6f6',
			'border': '#c0c0c0',
			'text': '#111111',
			'text-muted': '#444444',
			'text-dim': '#686868',
			'accent': '#171717',
			'accent-foreground': '#fafafa',
			'accent-hover': '#262626',
			'panel': '#e4e4e4',
			'panel-surface': '#eeeeee',
			'panel-border': '#c8c8c8',
			'panel-hover': '#d8d8d8',
		},
	},
};

// ---------------------------------------------------------------------------
// Aeldari — magenta/pink accent, warm-purple grays
// ---------------------------------------------------------------------------

export const aeldari: FactionTheme = {
	id: 'aeldari',
	name: 'Aeldari',
	tagline: 'We bring only death.',
	palette: {
		dark: {
			'bg': '#0f0b0e',
			'bg-dark': '#0a070a',
			'surface': '#1b161a',
			'border': '#302a2e',
			'text': '#f0ebef',
			'text-muted': '#a8a0a6',
			'text-dim': '#8a828a',
			'accent': '#f472b6',
			'accent-foreground': '#500724',
			'accent-hover': '#ec4899',
			'panel': '#0b080a',
			'panel-surface': '#151013',
			'panel-border': '#282226',
			'panel-hover': '#201a1e',
		},
		light: {
			'bg': '#f2eff1',
			'bg-dark': '#e6e0e4',
			'surface': '#faf7f9',
			'border': '#ccc6ca',
			'text': '#131012',
			'text-muted': '#4e444a',
			'text-dim': '#726a70',
			'accent': '#db2777',
			'accent-foreground': '#ffffff',
			'accent-hover': '#be185d',
			'panel': '#ece6ea',
			'panel-surface': '#f2eff1',
			'panel-border': '#d4ccd2',
			'panel-hover': '#ddd6da',
		},
	},
};

// ---------------------------------------------------------------------------
// Drukhari — violet/purple accent, cool-purple grays
// ---------------------------------------------------------------------------

export const drukhari: FactionTheme = {
	id: 'drukhari',
	name: 'Drukhari',
	tagline: 'Pain is our wine.',
	palette: {
		dark: {
			'bg': '#0c0a10',
			'bg-dark': '#08060d',
			'surface': '#18141e',
			'border': '#2c2636',
			'text': '#edeaf2',
			'text-muted': '#a6a0ae',
			'text-dim': '#887e94',
			'accent': '#8b5cf6',
			'accent-foreground': '#1e1036',
			'accent-hover': '#7c3aed',
			'panel': '#08060d',
			'panel-surface': '#120e1a',
			'panel-border': '#2a2236',
			'panel-hover': '#1c1626',
		},
		light: {
			'bg': '#f0eef5',
			'bg-dark': '#e2dee8',
			'surface': '#f8f6fc',
			'border': '#c4c0d0',
			'text': '#100e16',
			'text-muted': '#46424e',
			'text-dim': '#6a6476',
			'accent': '#7c3aed',
			'accent-foreground': '#ffffff',
			'accent-hover': '#6d28d9',
			'panel': '#e8e4f0',
			'panel-surface': '#f0eef5',
			'panel-border': '#ccc8d8',
			'panel-hover': '#dcdae8',
		},
	},
};

// ---------------------------------------------------------------------------
// World Eaters — deep crimson, warm-red grays
// ---------------------------------------------------------------------------

export const worldEaters: FactionTheme = {
	id: 'world-eaters',
	name: 'World Eaters',
	tagline: 'Blood for the Blood God!',
	palette: {
		dark: {
			'bg': '#110a0a',
			'bg-dark': '#0c0606',
			'surface': '#1e1414',
			'border': '#332828',
			'text': '#f2ebeb',
			'text-muted': '#a89898',
			'text-dim': '#8a7c7c',
			'accent': '#b91c1c',
			'accent-foreground': '#ffffff',
			'accent-hover': '#991b1b',
			'panel': '#0d0707',
			'panel-surface': '#180e0e',
			'panel-border': '#2e1f1f',
			'panel-hover': '#221616',
		},
		light: {
			'bg': '#f4eeee',
			'bg-dark': '#e8dede',
			'surface': '#fbf6f6',
			'border': '#ccc2c2',
			'text': '#141010',
			'text-muted': '#504242',
			'text-dim': '#746464',
			'accent': '#b91c1c',
			'accent-foreground': '#ffffff',
			'accent-hover': '#991b1b',
			'panel': '#ece4e4',
			'panel-surface': '#f4eeee',
			'panel-border': '#d4caca',
			'panel-hover': '#ddd4d4',
		},
	},
};

// ---------------------------------------------------------------------------
// Death Guard — putrid olive-green, warm-green grays
// ---------------------------------------------------------------------------

export const deathGuard: FactionTheme = {
	id: 'death-guard',
	name: 'Death Guard',
	tagline: 'Embrace despair.',
	palette: {
		dark: {
			'bg': '#0e0f0b',
			'bg-dark': '#090a07',
			'surface': '#1a1c16',
			'border': '#2c2e24',
			'text': '#eef0ea',
			'text-muted': '#a6aa9c',
			'text-dim': '#888c7e',
			'accent': '#84a86b',
			'accent-foreground': '#1a1f14',
			'accent-hover': '#6d8a58',
			'panel': '#0a0b08',
			'panel-surface': '#13150f',
			'panel-border': '#282a20',
			'panel-hover': '#1c1e16',
		},
		light: {
			'bg': '#f0f2ec',
			'bg-dark': '#e2e6dc',
			'surface': '#f7f9f4',
			'border': '#c2c6ba',
			'text': '#10120e',
			'text-muted': '#404640',
			'text-dim': '#646a60',
			'accent': '#4d7c0f',
			'accent-foreground': '#ffffff',
			'accent-hover': '#3f6212',
			'panel': '#e8ece4',
			'panel-surface': '#f0f2ec',
			'panel-border': '#c8cec4',
			'panel-hover': '#d8dcd4',
		},
	},
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const defaultTheme = neutral;

export const allFactions: FactionTheme[] = [
	neutral,
	spaceWolves,
	bloodAngels,
	darkAngels,
	ultramarines,
	necrons,
	tauEmpire,
	imperialFists,
	whiteScars,
	sistersOfBattle,
	aeldari,
	drukhari,
	worldEaters,
	deathGuard,
];

/** Convert a PaletteTokens object to a CSS custom property string for inline style overrides. */
export function paletteToCssVars(tokens: PaletteTokens): string {
	return Object.entries(tokens)
		.map(([key, value]) => `--color-${key}: ${value}`)
		.join('; ');
}
