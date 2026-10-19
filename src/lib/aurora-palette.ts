export type RGB = [number, number, number];

// Role order the shader indexes: GREEN, LIME, YELLOW, TEAL, AQUA, CREAM, MINTG, CYAN, DEEP
export const ROLE_NAMES = ['green', 'lime', 'yellow', 'teal', 'aqua', 'cream', 'mintg', 'cyan', 'deep'] as const;

export const DEFAULT_PALETTE = [
	'#6FE07F',
	'#A6F78C',
	'#F2F7A0',
	'#12E6BE',
	'#B8F4E0',
	'#F8FDEE',
	'#86E3A0',
	'#3EE6D2',
	'#5CCF78',
];

// Lightness rank of each role (0 = darkest, 1 = lightest), used to resample custom palettes
const ROLE_LIGHTNESS = [0.2, 0.5, 0.78, 0.12, 0.86, 1.0, 0.35, 0.28, 0.0];

export function hexToRgb(hex: string): RGB | null {
	let h = hex.trim().replace(/^#/, '');
	if (h.length === 3) h = h.split('').map((c) => c + c).join('');
	if (!/^[0-9a-f]{6}$/i.test(h)) return null;
	const n = parseInt(h, 16);
	return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function lightness([r, g, b]: RGB) {
	return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}

// 9 colours are used in role order; any other count is sorted by lightness and resampled into the roles
export function resolvePalette(palette?: string[]): RGB[] {
	const parsed = (palette ?? []).map(hexToRgb).filter((c): c is RGB => c !== null);
	if (parsed.length === 9) return parsed;
	if (parsed.length === 0) return DEFAULT_PALETTE.map((hex) => hexToRgb(hex)!);

	const sorted = [...parsed].sort((a, b) => lightness(a) - lightness(b));
	return ROLE_LIGHTNESS.map((rank) => {
		const x = rank * (sorted.length - 1);
		const i = Math.floor(x);
		const j = Math.min(i + 1, sorted.length - 1);
		const f = x - i;
		return sorted[i].map((v, k) => v + (sorted[j][k] - v) * f) as RGB;
	});
}

export function rgbToCss([r, g, b]: RGB) {
	return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

export function paletteToCssVars(palette: RGB[]) {
	return ROLE_NAMES.map((name, i) => `--as-${name}:${rgbToCss(palette[i])};`).join('');
}
