import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GoalService } from "../../../services/goal.service.js";

describe("GoalService", () => {
	let tmpDir: string;
	let service: GoalService;

	beforeEach(() => {
		tmpDir = mkdtempSync(join(tmpdir(), "goal-test-"));
		service = new GoalService(tmpDir);
	});

	afterEach(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	it("addGoal: adds a goal and returns it with id, title, target, current=0, unit", () => {
		const goal = service.addGoal("Read Quran", 30, "juz");
		expect(goal).toMatchObject({
			title: "Read Quran",
			target: 30,
			current: 0,
			unit: "juz",
		});
		expect(goal.id).toBeDefined();
		expect(typeof goal.id).toBe("string");
		expect(goal.createdAt).toBeDefined();
	});

	it("listGoals: returns empty array initially", () => {
		expect(service.listGoals()).toEqual([]);
	});

	it("listGoals: returns all added goals", () => {
		service.addGoal("Read Quran", 30, "juz");
		service.addGoal("Charity", 1000, "USD");
		const goals = service.listGoals();
		expect(goals).toHaveLength(2);
		expect(goals[0]?.title).toBe("Read Quran");
		expect(goals[1]?.title).toBe("Charity");
	});

	it("updateGoal: updates progress and returns updated goal", () => {
		const goal = service.addGoal("Read Quran", 30, "juz");
		const updated = service.updateGoal(goal.id, 15);
		expect(updated).not.toBeNull();
		expect(updated?.current).toBe(15);
		expect(updated?.title).toBe("Read Quran");
	});

	it("updateGoal: returns null for non-existent id", () => {
		const result = service.updateGoal("nonexistent", 10);
		expect(result).toBeNull();
	});

	it("deleteGoal: removes the goal, returns true", () => {
		const goal = service.addGoal("Read Quran", 30, "juz");
		expect(service.deleteGoal(goal.id)).toBe(true);
		expect(service.listGoals()).toEqual([]);
	});

	it("deleteGoal: returns false for non-existent id", () => {
		expect(service.deleteGoal("nonexistent")).toBe(false);
	});

	it("getGoal: returns specific goal by id", () => {
		const goal = service.addGoal("Read Quran", 30, "juz");
		service.addGoal("Charity", 1000, "USD");
		const found = service.getGoal(goal.id);
		expect(found).toBeDefined();
		expect(found?.title).toBe("Read Quran");
	});

	it("addGoal: throws error for empty title", () => {
		expect(() => service.addGoal("", 10, "pages")).toThrow("Goal title cannot be empty.");
		expect(() => service.addGoal("   ", 10, "pages")).toThrow("Goal title cannot be empty.");
	});

	it("addGoal: throws error for zero target", () => {
		expect(() => service.addGoal("Read Quran", 0, "juz")).toThrow(
			"Goal target must be greater than zero.",
		);
	});

	it("addGoal: throws error for negative target", () => {
		expect(() => service.addGoal("Read Quran", -5, "juz")).toThrow(
			"Goal target must be greater than zero.",
		);
	});

	it("updateGoal: throws error for negative progress", () => {
		const goal = service.addGoal("Read Quran", 30, "juz");
		expect(() => service.updateGoal(goal.id, -1)).toThrow("Progress cannot be negative.");
	});
});
