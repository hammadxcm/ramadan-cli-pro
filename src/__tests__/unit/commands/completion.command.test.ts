import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateCompletion } from "../../../commands/completion.command.js";

describe("generateCompletion", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("bash", () => {
		it("should output a bash completion script", () => {
			generateCompletion("bash");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("_ramadan_cli_pro()");
		});

		it("should contain completion function registration", () => {
			generateCompletion("bash");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("complete -F _ramadan_cli_pro");
		});

		it("should contain city aliases in the script", () => {
			generateCompletion("bash");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("cities=");
		});

		it("should contain COMPREPLY assignments", () => {
			generateCompletion("bash");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("COMPREPLY=");
		});

		it("should handle case-insensitive shell name", () => {
			generateCompletion("BASH");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("_ramadan_cli_pro()");
		});

		it("should contain subcommand completions for track", () => {
			generateCompletion("bash");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("track)");
			expect(output).toContain("fajr dhuhr asr maghrib isha");
		});

		it("should contain subcommand completions for profile", () => {
			generateCompletion("bash");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("profile)");
			expect(output).toContain("add use list delete");
		});
	});

	describe("zsh", () => {
		it("should output a zsh completion script", () => {
			generateCompletion("zsh");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("#compdef");
		});

		it("should contain compdef directive", () => {
			generateCompletion("zsh");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("#compdef ramadan-cli-pro");
		});

		it("should contain _ramadan_cli_pro function", () => {
			generateCompletion("zsh");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("_ramadan_cli_pro()");
		});

		it("should contain _arguments and _describe calls", () => {
			generateCompletion("zsh");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("_arguments");
			expect(output).toContain("_describe");
		});

		it("should contain command descriptions", () => {
			generateCompletion("zsh");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("'dua:dua command'");
			expect(output).toContain("'track:track command'");
		});

		it("should handle case-insensitive shell name", () => {
			generateCompletion("Zsh");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("#compdef");
		});
	});

	describe("fish", () => {
		it("should output a fish completion script", () => {
			generateCompletion("fish");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("complete -c");
		});

		it("should contain complete -c for all command aliases", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("complete -c ramadan-cli-pro");
			expect(output).toContain("complete -c ramadan-pro");
			expect(output).toContain("complete -c ramadan");
			expect(output).toContain("complete -c ramzan");
			expect(output).toContain("complete -c roza");
		});

		it("should contain fish subcommand completions", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("__fish_use_subcommand");
		});

		it("should contain track prayer completions", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("__fish_seen_subcommand_from track");
			expect(output).toContain("fajr dhuhr asr maghrib isha");
		});

		it("should contain profile action completions", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("__fish_seen_subcommand_from profile");
			expect(output).toContain("add use list delete");
		});

		it("should contain flag definitions", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("-l all");
			expect(output).toContain("-l plain");
			expect(output).toContain("-l json");
			expect(output).toContain("-l version");
		});

		it("should disable file completions", () => {
			generateCompletion("fish");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("complete -c ramadan-cli-pro -f");
		});

		it("should handle case-insensitive shell name", () => {
			generateCompletion("Fish");

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("complete -c");
		});
	});

	describe("unsupported shell", () => {
		it("should throw CommandError for unsupported shell", () => {
			expect(() => generateCompletion("powershell")).toThrow("Unsupported shell: powershell");
		});

		it("should throw CommandError for empty string", () => {
			expect(() => generateCompletion("")).toThrow("Unsupported shell");
		});

		it("should throw CommandError for unknown shell", () => {
			expect(() => generateCompletion("csh")).toThrow("Unsupported shell: csh");
		});

		it("should not call console.log for unsupported shell", () => {
			expect(() => generateCompletion("powershell")).toThrow("Unsupported shell");

			expect(logSpy).not.toHaveBeenCalled();
		});
	});
});
