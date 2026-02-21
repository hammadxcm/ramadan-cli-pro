/**
 * @module commands/completion
 * @description Generates shell completion scripts for bash, zsh, and fish.
 */

import { CITY_ALIAS_MAP } from "../data/city-aliases.js";

const SUBCOMMANDS = [
	"reset",
	"config",
	"dashboard",
	"notify",
	"qibla",
	"dua",
	"track",
	"completion",
	"profile",
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
	"--first-roza-date",
	"--clear-first-roza-date",
	"--version",
	"--help",
];

const cityAliases = Object.keys(CITY_ALIAS_MAP).join(" ");
const subcommands = SUBCOMMANDS.join(" ");
const flags = GLOBAL_FLAGS.join(" ");

const generateBash = (): string => `# bash completion for ramadan-cli-pro
_ramadan_cli_pro() {
    local cur prev commands cities flags
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    commands="${subcommands}"
    cities="${cityAliases}"
    flags="${flags}"

    case "\${prev}" in
        --locale|-l)
            COMPREPLY=( $(compgen -W "en ar ur tr ms bn fr id" -- "\${cur}") )
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
        completion)
            COMPREPLY=( $(compgen -W "bash zsh fish" -- "\${cur}") )
            return 0
            ;;
        track)
            COMPREPLY=( $(compgen -W "fajr dhuhr asr maghrib isha --show --date" -- "\${cur}") )
            return 0
            ;;
        profile)
            COMPREPLY=( $(compgen -W "add use list delete" -- "\${cur}") )
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

const generateZsh = (): string => `#compdef ramadan-cli-pro ramadan-pro ramadan ramzan roza

_ramadan_cli_pro() {
    local -a commands cities locales prayers
    commands=(
        'reset:Clear saved configuration'
        'config:Configure saved settings'
        'dashboard:Launch TUI dashboard'
        'notify:Manage notification preferences'
        'qibla:Show Qibla direction'
        'dua:Show dua of the day'
        'track:Track daily prayer completion'
        'completion:Output shell completion script'
        'profile:Manage location profiles'
    )
    cities=(${cityAliases})
    locales=(en ar ur tr ms bn fr id)
    prayers=(fajr dhuhr asr maghrib isha)

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

const generateFish = (): string => {
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
		for (const sub of SUBCOMMANDS) {
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
		lines.push(`complete -c ${cmd} -s l -l locale -d 'Language' -x -a 'en ar ur tr ms bn fr id'`);
		lines.push(`complete -c ${cmd} -s c -l city -d 'City' -x`);
		lines.push(`complete -c ${cmd} -s v -l version -d 'Show version'`);
		lines.push(`complete -c ${cmd} -s h -l help -d 'Show help'`);

		lines.push("");
		lines.push("# completion subcommand");
		lines.push(`complete -c ${cmd} -n '__fish_seen_subcommand_from completion' -a 'bash zsh fish'`);

		lines.push("");
		lines.push("# track subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from track' -a 'fajr dhuhr asr maghrib isha'`,
		);

		lines.push("");
		lines.push("# profile subcommand");
		lines.push(
			`complete -c ${cmd} -n '__fish_seen_subcommand_from profile' -a 'add use list delete'`,
		);
		lines.push("");
	}

	return lines.join("\n");
};

/**
 * Outputs the shell completion script for the given shell type.
 */
export const generateCompletion = (shell: string): void => {
	switch (shell.toLowerCase()) {
		case "bash":
			console.log(generateBash());
			break;
		case "zsh":
			console.log(generateZsh());
			break;
		case "fish":
			console.log(generateFish());
			break;
		default:
			console.error(`Unsupported shell: ${shell}. Use bash, zsh, or fish.`);
			process.exit(1);
	}
};
