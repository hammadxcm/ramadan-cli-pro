/**
 * @module tui/screens/settings-screen
 * @description Interactive settings editor with keyboard navigation.
 * Supports text input, selection dropdowns, and toggle controls.
 */

import { Box, Text, useApp, useInput } from "ink";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { METHOD_OPTIONS, findMethodLabel } from "../../data/calculation-methods.js";
import { useContainer } from "../context/container-context.js";
import { useThemeColors, useThemeRefresh } from "../context/theme-context.js";

interface SettingsScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

type EditMode = "none" | "select" | "text";

interface SelectOption {
	readonly label: string;
	readonly value: string | number;
}

const SCHOOL_OPTIONS: ReadonlyArray<SelectOption> = [
	{ value: 0, label: "Shafi" },
	{ value: 1, label: "Hanafi" },
];

const LOCALE_OPTIONS: ReadonlyArray<SelectOption> = [
	{ value: "en", label: "English" },
	{ value: "ar", label: "Arabic" },
	{ value: "ur", label: "Urdu" },
	{ value: "tr", label: "Turkish" },
	{ value: "ms", label: "Malay" },
	{ value: "bn", label: "Bengali" },
	{ value: "fr", label: "French" },
	{ value: "id", label: "Indonesian" },
	{ value: "es", label: "Spanish" },
	{ value: "de", label: "German" },
	{ value: "hi", label: "Hindi" },
	{ value: "fa", label: "Persian" },
];

type SettingType = "text" | "selection" | "toggle";

interface SettingRow {
	readonly label: string;
	readonly type: SettingType;
	readonly key: string;
}

const SETTINGS: ReadonlyArray<SettingRow> = [
	{ label: "City", type: "text", key: "city" },
	{ label: "Country", type: "text", key: "country" },
	{ label: "Calculation Method", type: "selection", key: "method" },
	{ label: "School", type: "selection", key: "school" },
	{ label: "Theme", type: "selection", key: "theme" },
	{ label: "Locale", type: "selection", key: "locale" },
	{ label: "Notifications", type: "toggle", key: "notifications" },
	{ label: "Sehar Reminder", type: "toggle", key: "seharReminder" },
	{ label: "Iftar Reminder", type: "toggle", key: "iftarReminder" },
];

interface ConfigValues {
	city: string;
	country: string;
	method: number;
	school: number;
	theme: string;
	locale: string;
	notifications: boolean;
	seharReminder: boolean;
	iftarReminder: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const refreshTheme = useThemeRefresh();
	const container = useContainer();
	const { exit } = useApp();
	const configRepo = container.configRepository;

	const loadConfig = useCallback((): ConfigValues => {
		const location = configRepo.getStoredLocation();
		const prayerSettings = configRepo.getStoredPrayerSettings();
		const notifPrefs = configRepo.getNotificationPreferences();
		return {
			city: location.city ?? "",
			country: location.country ?? "",
			method: prayerSettings.method,
			school: prayerSettings.school,
			theme: configRepo.getStoredTheme() ?? "classic-gold",
			locale: configRepo.getStoredLocale() ?? "en",
			notifications: notifPrefs.enabled,
			seharReminder: notifPrefs.seharReminder,
			iftarReminder: notifPrefs.iftarReminder,
		};
	}, [configRepo]);

	const [configValues, setConfigValues] = useState<ConfigValues>(loadConfig);
	const [selectedRow, setSelectedRow] = useState(0);
	const [editMode, setEditMode] = useState<EditMode>("none");
	const [editOptionIndex, setEditOptionIndex] = useState(0);
	const [textBuffer, setTextBuffer] = useState("");
	const [restartNote, setRestartNote] = useState("");

	const themeOptions: ReadonlyArray<SelectOption> = useMemo(
		() => container.themeRegistry.list().map((t) => ({ value: t.id, label: t.name })),
		[container.themeRegistry],
	);

	const getOptionsForRow = useCallback(
		(key: string): ReadonlyArray<SelectOption> => {
			switch (key) {
				case "method":
					return METHOD_OPTIONS.map((m) => ({ value: m.value, label: m.label }));
				case "school":
					return SCHOOL_OPTIONS;
				case "theme":
					return themeOptions;
				case "locale":
					return LOCALE_OPTIONS;
				default:
					return [];
			}
		},
		[themeOptions],
	);

	const getDisplayValue = useCallback(
		(key: string): string => {
			switch (key) {
				case "city":
					return configValues.city || "Not set";
				case "country":
					return configValues.country || "Not set";
				case "method":
					return findMethodLabel(configValues.method);
				case "school":
					return configValues.school === 0 ? "Shafi" : "Hanafi";
				case "theme": {
					const theme = container.themeRegistry.get(configValues.theme);
					return theme?.name ?? configValues.theme;
				}
				case "locale": {
					const loc = LOCALE_OPTIONS.find((l) => l.value === configValues.locale);
					return loc ? loc.label : configValues.locale;
				}
				case "notifications":
					return configValues.notifications ? "ON" : "OFF";
				case "seharReminder":
					return configValues.seharReminder ? "ON" : "OFF";
				case "iftarReminder":
					return configValues.iftarReminder ? "ON" : "OFF";
				default:
					return "";
			}
		},
		[configValues, container.themeRegistry],
	);

	const saveValue = useCallback(
		(key: string, value: string | number | boolean) => {
			const loc = configRepo.getStoredLocation();
			switch (key) {
				case "city":
					configRepo.setStoredLocation({ ...loc, city: value as string });
					setConfigValues((prev) => ({ ...prev, city: value as string }));
					break;
				case "country":
					configRepo.setStoredLocation({ ...loc, country: value as string });
					setConfigValues((prev) => ({ ...prev, country: value as string }));
					break;
				case "method":
					configRepo.setStoredMethod(value as number);
					setConfigValues((prev) => ({ ...prev, method: value as number }));
					break;
				case "school":
					configRepo.setStoredSchool(value as number);
					setConfigValues((prev) => ({ ...prev, school: value as number }));
					break;
				case "theme":
					configRepo.setStoredTheme(value as string);
					setConfigValues((prev) => ({ ...prev, theme: value as string }));
					refreshTheme();
					break;
				case "locale":
					configRepo.setStoredLocale(value as string);
					setConfigValues((prev) => ({ ...prev, locale: value as string }));
					setRestartNote("Restart to apply");
					break;
				case "notifications":
					configRepo.setNotificationPreferences({ enabled: value as boolean });
					setConfigValues((prev) => ({ ...prev, notifications: value as boolean }));
					break;
				case "seharReminder":
					configRepo.setNotificationPreferences({ seharReminder: value as boolean });
					setConfigValues((prev) => ({ ...prev, seharReminder: value as boolean }));
					break;
				case "iftarReminder":
					configRepo.setNotificationPreferences({ iftarReminder: value as boolean });
					setConfigValues((prev) => ({ ...prev, iftarReminder: value as boolean }));
					break;
			}
		},
		[configRepo, refreshTheme],
	);

	const enterEdit = useCallback(() => {
		const setting = SETTINGS[selectedRow];
		if (!setting) return;
		if (setting.type === "toggle") {
			const key = setting.key as keyof ConfigValues;
			const current = configValues[key] as boolean;
			saveValue(setting.key, !current);
		} else if (setting.type === "selection") {
			const options = getOptionsForRow(setting.key);
			const currentValue = configValues[setting.key as keyof ConfigValues];
			const currentIndex = options.findIndex((o) => o.value === currentValue);
			setEditOptionIndex(currentIndex >= 0 ? currentIndex : 0);
			setEditMode("select");
		} else if (setting.type === "text") {
			const currentValue = configValues[setting.key as keyof ConfigValues] as string;
			setTextBuffer(currentValue);
			setEditMode("text");
		}
	}, [selectedRow, configValues, getOptionsForRow, saveValue]);

	useInput(
		(input, key) => {
			if (editMode === "none") {
				if (key.upArrow) {
					setSelectedRow((prev) => (prev > 0 ? prev - 1 : SETTINGS.length - 1));
					setRestartNote("");
				} else if (key.downArrow) {
					setSelectedRow((prev) => (prev < SETTINGS.length - 1 ? prev + 1 : 0));
					setRestartNote("");
				} else if (key.return) {
					enterEdit();
				} else if (key.escape) {
					onBack();
				} else if (input === "q" || input === "Q") {
					exit();
				}
			} else if (editMode === "select") {
				const setting = SETTINGS[selectedRow];
				if (!setting) return;
				const options = getOptionsForRow(setting.key);
				if (key.upArrow) {
					setEditOptionIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
				} else if (key.downArrow) {
					setEditOptionIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
				} else if (key.return) {
					const selected = options[editOptionIndex];
					if (selected) {
						saveValue(setting.key, selected.value);
					}
					setEditMode("none");
				} else if (key.escape) {
					setEditMode("none");
				}
			} else if (editMode === "text") {
				if (key.return) {
					const setting = SETTINGS[selectedRow];
					const trimmed = textBuffer.trim();
					if (trimmed && setting) {
						saveValue(setting.key, trimmed);
					}
					setEditMode("none");
				} else if (key.escape) {
					setEditMode("none");
				} else if (key.backspace || key.delete) {
					setTextBuffer((prev) => prev.slice(0, -1));
				} else if (input && !key.ctrl && !key.meta && !key.tab) {
					setTextBuffer((prev) => prev + input);
				}
			}
		},
		{ isActive },
	);

	const footerText =
		editMode === "none"
			? "Up/Down Navigate  Enter Edit  Esc Back  q Quit"
			: "Enter Confirm  Esc Cancel";

	return (
		<Box flexDirection="column">
			<Box flexDirection="column" borderStyle="round" borderColor={colors.primary} paddingX={1}>
				<Text color={colors.primary} bold>
					Settings
				</Text>
			</Box>

			<Box flexDirection="column" paddingX={1} paddingY={1}>
				{SETTINGS.map((setting, index) => {
					const isSelected = selectedRow === index;
					const isEditingThis = isSelected && editMode !== "none";

					return (
						<Box key={setting.key} flexDirection="column">
							<Box>
								<Box width={2}>
									<Text {...(isSelected ? { color: colors.primary } : {})}>
										{isSelected ? ">" : " "}
									</Text>
								</Box>
								<Box width={22}>
									<Text color={isSelected ? colors.primary : colors.white} bold={isSelected}>
										{setting.label}
									</Text>
								</Box>
								{isEditingThis && editMode === "text" ? (
									<Text color={colors.secondary}>[{textBuffer}_]</Text>
								) : setting.type === "toggle" ? (
									<Text
										color={
											(configValues[setting.key as keyof ConfigValues] as boolean)
												? colors.secondary
												: colors.error
										}
									>
										{getDisplayValue(setting.key)}
									</Text>
								) : (
									<Text color={colors.white}>{getDisplayValue(setting.key)}</Text>
								)}
							</Box>

							{isEditingThis && editMode === "select" && (
								<Box flexDirection="column" paddingLeft={4}>
									{getOptionsForRow(setting.key).map((option, optIndex) => {
										const isCurrent =
											option.value === configValues[setting.key as keyof ConfigValues];
										const isHighlighted = optIndex === editOptionIndex;
										return (
											<Box key={String(option.value)}>
												<Text
													color={isHighlighted ? colors.primary : colors.muted}
													bold={isHighlighted}
												>
													{isHighlighted ? "> " : "  "}
													{option.label}
													{isCurrent ? " *" : ""}
												</Text>
											</Box>
										);
									})}
								</Box>
							)}
						</Box>
					);
				})}
			</Box>

			{restartNote !== "" && editMode === "none" && (
				<Box paddingX={1}>
					<Text color={colors.secondary}>{restartNote}</Text>
				</Box>
			)}

			<Box paddingX={1}>
				<Text color={colors.muted}>{footerText}</Text>
			</Box>
		</Box>
	);
};
