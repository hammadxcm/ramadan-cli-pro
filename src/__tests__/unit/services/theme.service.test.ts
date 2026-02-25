import { describe, expect, it, vi } from "vitest";
import { ThemeService } from "../../../services/theme.service.js";
import { ThemeRegistry } from "../../../themes/theme.registry.js";

describe("ThemeRegistry", () => {
	const registry = new ThemeRegistry();

	it("get: returns registered theme by id", () => {
		const theme = registry.get("ramadan-green");
		expect(theme).toBeDefined();
		expect(theme?.id).toBe("ramadan-green");
	});

	it("get: returns undefined for unknown id", () => {
		const theme = registry.get("nonexistent-theme");
		expect(theme).toBeUndefined();
	});

	it("getDefault: returns classic-gold", () => {
		const theme = registry.getDefault();
		expect(theme.id).toBe("classic-gold");
	});

	it("list: returns all themes", () => {
		const themes = registry.list();
		expect(themes.length).toBeGreaterThanOrEqual(6);
		const ids = themes.map((t) => t.id);
		expect(ids).toContain("ramadan-green");
		expect(ids).toContain("classic-gold");
		expect(ids).toContain("ocean-blue");
		expect(ids).toContain("royal-purple");
		expect(ids).toContain("minimal-mono");
		expect(ids).toContain("high-contrast");
	});

	it("listIds: returns id strings", () => {
		const ids = registry.listIds();
		expect(ids.length).toBeGreaterThanOrEqual(6);
		expect(ids).toContain("ramadan-green");
		expect(ids).toContain("classic-gold");
	});
});

describe("ThemeService", () => {
	const registry = new ThemeRegistry();
	const mockConfigRepository = {
		getStoredTheme: vi.fn(),
		setStoredTheme: vi.fn(),
	};

	it("getActiveTheme: returns override theme when provided", () => {
		const service = new ThemeService(registry, mockConfigRepository as never);
		const theme = service.getActiveTheme("ocean-blue");
		expect(theme.id).toBe("ocean-blue");
	});

	it("getActiveTheme: returns stored theme when no override", () => {
		mockConfigRepository.getStoredTheme.mockReturnValue("classic-gold");
		const service = new ThemeService(registry, mockConfigRepository as never);
		const theme = service.getActiveTheme();
		expect(theme.id).toBe("classic-gold");
	});

	it("getActiveTheme: returns default when nothing set", () => {
		mockConfigRepository.getStoredTheme.mockReturnValue(undefined);
		const service = new ThemeService(registry, mockConfigRepository as never);
		const theme = service.getActiveTheme();
		expect(theme.id).toBe("classic-gold");
	});

	it("setTheme: persists valid theme, returns true", () => {
		mockConfigRepository.setStoredTheme.mockClear();
		const service = new ThemeService(registry, mockConfigRepository as never);
		const result = service.setTheme("ocean-blue");
		expect(result).toBe(true);
		expect(mockConfigRepository.setStoredTheme).toHaveBeenCalledWith("ocean-blue");
	});

	it("setTheme: returns false for unknown theme", () => {
		const service = new ThemeService(registry, mockConfigRepository as never);
		const result = service.setTheme("nonexistent-theme");
		expect(result).toBe(false);
	});

	it("listThemes: returns all theme ids", () => {
		const service = new ThemeService(registry, mockConfigRepository as never);
		const ids = service.listThemes();
		expect(ids.length).toBeGreaterThanOrEqual(6);
		expect(ids).toContain("ramadan-green");
		expect(ids).toContain("ocean-blue");
	});

	it("getRegistry: returns the registry instance", () => {
		const service = new ThemeService(registry, mockConfigRepository as never);
		const reg = service.getRegistry();
		expect(reg).toBe(registry);
	});
});
