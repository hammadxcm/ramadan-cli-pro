/**
 * @module commands/completion
 * @description Generates shell completion scripts for bash, zsh, and fish.
 * Dynamically reads command names from CommandFactory when available.
 */

import { CITY_ALIAS_MAP } from "../data/city-aliases.js";
import { CommandError } from "../errors/command.error.js";
import type { CommandFactory } from "./command.factory.js";

const FALLBACK_SUBCOMMANDS = [
	"reset",
	"config",
	"dashboard",
	"notify",
	"qibla",
	"dua",
	"track",
	"completion",
	"profile",
	"quran",
	"hadith",
	"goal",
	"stats",
	"zakat",
	"charity",
	"export",
	"compare",
	"widget",
	"adhkar",
	"cache",
];

const GLOBAL_FLAGS = [
	"--city",
	"--all",
	"--number",
	"--plain",
	"--json",
	"--status",
	"--tui",
	"--locale",
	"--theme",
	"--no-color",
	"--first-roza-date",
	"--clear-first-roza-date",
	"--version",
	"--help",
];

const SUPPORTED_LOCALES = "en ar ur tr ms bn fr id es de hi fa";

const getSubcommands = (commandFactory?: CommandFactory): ReadonlyArray<string> => {
	if (commandFactory) {
		const registered = commandFactory.list();
		// Add commands not in the registry that are still valid
		const extra = ["completion", "profile"];
		return [...new Set([...registered, ...extra])];
	}
	return FALLBACK_SUBCOMMANDS;
};

const cityAliases = Object.keys(CITY_ALIAS_MAP).join(" ");
const flags = GLOBAL_FLAGS.join(" ");

const generateBash = (subcommandList: string): string => `# bash completion for ramadan-cli-pro
_ramadan_cli_pro() {
    local cur prev commands cities flags
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    commands="${subcommandList}"
    cities="${cityAliases}"
    flags="${flags}"

    case "\${prev}" in
        --locale|-l)
            COMPREPLY=( $(compgen -W "${SUPPORTED_LOCALES}" -- "\${cur}") )
            return 0
            ;;
        --method)
            COMPREPLY=( $(compgen -W "0 1 2 3 4 5 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23" -- "\${cur}") )
            return 0
            ;;
        --school)
            COMPREPLY=( $(compgen -W "0 1" -- "\${cur}") )
            return 0
            ;;
        --theme)
            COMPREPLY=( $(compgen -W "ramadan-green classic-gold ocean-blue royal-purple minimal-mono high-contrast" -- "\${cur}") )
            return 0
            ;;
        completion)
            COMPREPLY=( $(compgen -W "bash zsh fish" -- "\${cur}") )
            return 0
            ;;
        track)
            COMPREPLY=( $(compgen -W "fajr dhuhr asr maghrib isha taraweeh --show --date --fasted --vacation" -- "\${cur}") )
            return 0
            ;;
        profile)
            COMPREPLY=( $(compgen -W "add use list delete" -- "\${cur}") )
            return 0
            ;;
        goal)
            COMPREPLY=( $(compgen -W "add update list delete" -- "\${cur}") )
            return 0
            ;;
        charity)
            COMPREPLY=( $(compgen -W "add list summary" -- "\${cur}") )
            return 0
            ;;
        adhkar)
            COMPREPLY=( $(compgen -W "morning evening post-prayer" -- "\${cur}") )
            return 0
            ;;
        export)
            COMPREPLY=( $(compgen -W "--format --output" -- "\${cur}") )
            return 0
            ;;
        --format)
            COMPREPLY=( $(compgen -W "ical csv json" -- "\${cur}") )
            return 0
            ;;
    esac

    if [[ "\${cur}" == -* ]]; then
        COMPREPLY=( $(compgen -W "\${flags}" -- "\${cur}") )
    elif [[ \${COMP_CWORD} -eq 1 ]]; then
        COMPREPLY=( $(compgen -W "\${commands} \${cities}" -- "\${cur}") )
    else
        COMPREPLY=( $(compgen -W "\${cities}" -- "\${cur}") )
    fi
}
complete -F _ramadan_cli_pro ramadan-cli-pro
complete -F _ramadan_cli_pro ramadan-pro
complete -F _ramadan_cli_pro ramadan
complete -F _ramadan_cli_pro ramzan
complete -F _ramadan_cli_pro roza
`;

const generateZsh = (subcommandList: ReadonlyArray<string>): string => {
	const commandEntries = subcommandList.map((cmd) => `        '${cmd}:${cmd} command'`).join("\n");

	return `#compdef ramadan-cli-pro ramadan-pro ramadan ramzan roza

_ramadan_cli_pro() {
    local -a commands cities locales prayers
    commands=(
${commandEntries}
    )
    cities=(${cityAliases})
    locales=(${SUPPORTED_LOCALES})
    prayers=(fajr dhuhr asr maghrib isha taraweeh)

    _arguments -s \\
        '1:city or command:->first' \\
        '-c[City]:city:(\${cities})' \\
        '--city[City]:city:(\${cities})' \\
        '-a[Show complete Ramadan month]' \\
        '--all[Show complete Ramadan month]' \\
        '-n[Show a specific roza day]:number:(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30)' \\
        '--number[Show a specific roza day]:number:' \\
        '-p[Plain text output]' \\
        '--plain[Plain text output]' \\
        '-j[JSON output]' \\
        '--json[JSON output]' \\
        '-s[Status line output]' \\
        '--status[Status line output]' \\
        '-t[Launch TUI dashboard]' \\
        '--tui[Launch TUI dashboard]' \\
        '-l[Language]:locale:(\${locales})' \\
        '--locale[Language]:locale:(\${locales})' \\
        '--theme[Color theme]:theme:(ramadan-green classic-gold ocean-blue royal-purple minimal-mono high-contrast)' \\
        '--no-color[Disable colors]' \\
        '--first-roza-date[Set custom first roza date]:date:' \\
        '--clear-first-roza-date[Clear custom first roza date]' \\
        '-v[Show version]' \\
        '--version[Show version]' \\
        '-h[Show help]' \\
        '--help[Show help]'

    case "\$state" in
        first)
            _describe -t commands 'command' commands
            _describe -t cities 'city alias' cities
            ;;
    esac
}

_ramadan_cli_pro "\$@"
`;
};

const generateFish = (subcommandList: ReadonlyArray<string>): string => {
	const lines = [
		"# fish completion for ramadan-cli-pro",
		"",
		"# Disable file completions",
		"complete -c ramadan-cli-pro -f",
		"complete -c ramadan-pro -f",
		"complete -c ramadan -f",
		"complete -c ramzan -f",
		"complete -c roza -f",
		"",
		"# Subcommands",
	];

	for (const cmd of ["ramadan-cli-pro", "ramadan-pro", "ramadan", "ramzan", "roza"]) {
		for (const sub of subcommandList) {
			lines.push(`complete -c ${cmd} -n '__fish_use_subcommand' -a '${sub}'`);
		}

		lines.push("");
		lines.push("# City aliases");
		for (const [alias, city] of Object.entries(CITY_ALIAS_MAP)) {
			lines.push(`complete -c ${cmd} -n '__fish_use_subcommand' -a '${alias}' -d '${city}'`);
		}

		lines.push("");
		lines.push("# Flags");
		lines.push(`complete -c ${cmd} -s a -l all -d 'Show complete Ramadan month'`);
		lines.push(`complete -c ${cmd} -s n -l number -d 'Show a specific roza day' -x`);
		lines.push(`complete -c ${cmd} -s p -l plain -d 'Plain text output'`);
		lines.push(`complete -c ${cmd} -s j -l json -d 'JSON output'`);
		lines.push(`complete -c ${cmd} -s s -l status -d 'Status line output'`);
		lines.push(`complete -c ${cmd} -s t -l tui -d 'Launch TUI dashboard'`);
		lines.push(`complete -c ${cmd} -s l -l locale -d 'Language' -x -a '${SUPPORTED_LOCALES}'`);
		lines.push(`complete -c ${cmd} -s c -l city -d 'City' -x`);
		lines.push(
			`complete -c ${cmd} -l theme -d 'Color theme' -x -a 'ramadan-green classic-gold ocean-blue royal-purple minimal-mono high-contrast'`,
		);
		lines.push(`complete -c ${cmd} -l no-color -d 'Disable colors'`);
		lines.push(`complete -c ${cmd} -s v -l version -d 'Show version'`);
		lines.push(`complete -c ${cmd} -s h -l help -d 'Show help'`);

		lines.push("");
		lines.push("# completion subcommand");
		lines.push(`complete -c ${cmd} -n '__fish_seen_subcommand_from completion' -a 'bash zsh fish'`);

		lines.push("");
		lines.push("# track subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from track' -a 'fajr dhuhr asr maghrib isha taraweeh'`,
		);

		lines.push("");
		lines.push("# profile subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from profile' -a 'add use list delete'`,
		);

		lines.push("");
		lines.push("# goal subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from goal' -a 'add update list delete'`,
		);

		lines.push("");
		lines.push("# charity subcommand");
		lines.push(`complete -c ${cmd} -n '__fish_seen_subcommand_from charity' -a 'add list summary'`);

		lines.push("");
		lines.push("# adhkar subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from adhkar' -a 'morning evening post-prayer'`,
		);

		lines.push("");
		lines.push("# export format");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from export' -l format -d 'Export format' -x -a 'ical csv json'`,
		);
		lines.push("");
	}

	return lines.join("\n");
};

/**
 * Outputs the shell completion script for the given shell type.
 * Dynamically reads command names from CommandFactory when provided.
 */
export const generateCompletion = (shell: string, commandFactory?: CommandFactory): void => {
	const subcommands = getSubcommands(commandFactory);
	const subcommandStr = subcommands.join(" ");

	switch (shell.toLowerCase()) {
		case "bash":
			console.log(generateBash(subcommandStr));
			break;
		case "zsh":
			console.log(generateZsh(subcommands));
			break;
		case "fish":
			console.log(generateFish(subcommands));
			break;
		default:
			throw new CommandError(`Unsupported shell: ${shell}. Use bash, zsh, or fish.`);
	}
};
