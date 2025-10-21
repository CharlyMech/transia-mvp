import { Card } from "@/components/Card";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme"; // Ajusta la ruta según tu estructura
import { router } from "expo-router";
import { ChevronRight, LogOut } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const [theme, setTheme] = useState<string>('light');
	const [language, setLanguage] = useState<string>('es');

	const themeItems = [
		{ label: "Claro", value: "light", disabled: false },
		{ label: "Oscuro", value: "dark", disabled: false },
		{ label: "Sistema", value: "system", disabled: true },
	];

	const languageItems = [
		{ label: "Español", value: "es", disabled: false },
		{ label: "English", value: "en", disabled: true },
		{ label: "Francés", value: "fr", disabled: true },
		{ label: "Portugués", value: "pt", disabled: true },
		{ label: "Italiano", value: "it", disabled: true },
		{ label: "Alemán", value: "de", disabled: true },
	];

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text style={styles.title}>Ajustes</Text>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Mi cuenta</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{/* TODO -> go to driver/[id] where id is the logged driver id */}
							<Pressable
								// onPress={() => router.push("/settings/profile")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Ver mi perfil</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
							<View style={styles.separator} />
							<Pressable
								// onPress={() => router.push("/settings/change-password")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Cambiar contraseña</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
							<View style={styles.separator} />
							<Pressable
								// onPress={() => router.push("/settings/about")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Solicitar ausencia o vacaciones</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
						</View>
					</Card>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Sistema</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							<Pressable
								onPress={() => router.push("/settings/notifications")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Notificaciones</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
							<View style={styles.separator} />
							<View style={styles.row}>
								<Text style={styles.rowText}>Tema</Text>
								<Dropdown
									data={themeItems}
									labelField="label"
									valueField="value"
									placeholder="Selecciona un tema"
									value={theme}
									selectedTextStyle={styles.selectedTextStyle}
									containerStyle={styles.containerStyle}
									itemContainerStyle={styles.itemContainerStyle}
									activeColor={lightTheme.colors.primaryContainer}
									onChange={item => {
										if (!item.disabled) {
											setTheme(item.value);
										}
									}}
									style={styles.dropdown}
									renderItem={(item) => {
										// TODO -> handle language status change //! This is currently not working!
										if (item.disabled) {
											return (
												<View style={[styles.dropdownItem, styles.dropdownItemDisabled]}>
													<Text style={[styles.itemTextStyle, styles.itemTextDisabled]}>
														{item.label}
													</Text>
												</View>
											);
										}
										return (
											<TouchableOpacity
												style={styles.dropdownItem}
												onPress={() => setTheme(item.value)}
											>
												<Text style={styles.itemTextStyle}>
													{item.label}
												</Text>
											</TouchableOpacity>
										);
									}}
								/>
							</View>
							<View style={styles.separator} />
							<View style={styles.row}>
								<Text style={styles.rowText}>Idioma</Text>
								<Dropdown
									data={languageItems}
									labelField="label"
									valueField="value"
									placeholder="Selecciona un idioma"
									placeholderStyle={styles.placeholderStyle}
									value={language}
									selectedTextStyle={styles.selectedTextStyle}
									containerStyle={styles.containerStyle}
									itemContainerStyle={styles.itemContainerStyle}
									activeColor={lightTheme.colors.primaryContainer}
									onChange={item => {
										if (!item.disabled) {
											setLanguage(item.value);
										}
									}}
									style={styles.dropdown}
									renderItem={(item) => {
										// TODO -> handle language status change //! This is currently not working!
										if (item.disabled) {
											return (
												<View style={[styles.dropdownItem, styles.dropdownItemDisabled]}>
													<Text style={[styles.itemTextStyle, styles.itemTextDisabled]}>
														{item.label}
													</Text>
												</View>
											);
										}
										return (
											<TouchableOpacity
												style={styles.dropdownItem}
												onPress={() => setLanguage(item.value)}
											>
												<Text style={styles.itemTextStyle}>
													{item.label}
												</Text>
											</TouchableOpacity>
										);
									}}
								/>
							</View>
						</View>
					</Card>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Información</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>

							<Pressable
								onPress={() => router.push("/settings/privacy")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Política de privacidad</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
							<View style={styles.separator} />
							<Pressable
								onPress={() => router.push("/settings/terms")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Términos y condiciones</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
							<View style={styles.separator} />
							<Pressable
								onPress={() => router.push("/settings/about")}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Acerca de Transia</Text>
										<ChevronRight size={20} style={styles.rowIcon} />
									</View>
								)}
							</Pressable>
						</View>
					</Card>
				</View>
				{/* HARDCODED -> pending auth store for logged user */}
				<View style={styles.footerContainer}>
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={() => { }}
						disabled={false}
						activeOpacity={0.8}
					>
						<Text style={styles.logoutButtonText}>
							Cerrar sesión
						</Text>
						<LogOut size={18} color={lightTheme.colors.onPrimary} />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	scrollContainer: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.md,
	},
	title: {
		fontSize: typography.headlineLarge,
		fontWeight: "600",
		marginBottom: spacing.md,
		color: lightTheme.colors.onBackground,
	},
	section: {
		marginBottom: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.titleMedium,
		fontWeight: "500",
		marginBottom: spacing.sm,
		color: lightTheme.colors.onSurfaceVariant,
	},
	tile: {
		backgroundColor: lightTheme.colors.surface,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: roundness.sm,
		marginBottom: spacing.md,
	},
	tileText: {
		color: lightTheme.colors.onSurface,
		fontSize: typography.bodyMedium,
	},
	cardTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: lightTheme.colors.outline,
		opacity: 0.5
	},
	rowContainer: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.xs,
	},
	rowPressed: {
		backgroundColor: lightTheme.colors.background,
	},
	row: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: spacing.xs,
	},
	rowText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
	},
	rowIcon: {
		color: lightTheme.colors.onSurface,
		opacity: 0.9,
	},
	label: {
		color: lightTheme.colors.onSurface,
	},
	labelPressed: {
		color: lightTheme.colors.onBackground,
	},
	value: {
		color: lightTheme.colors.onSurfaceVariant,
	},
	valuePressed: {
		color: lightTheme.colors.onBackground,
	},
	// Estilos para el Dropdown
	dropdown: {
		minWidth: 120,
		height: 25,
		paddingHorizontal: spacing.sm,
		borderRadius: roundness.xs,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		backgroundColor: lightTheme.colors.surface,
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurface,
	},
	placeholderStyle: {
		color: lightTheme.colors.primary,
		fontSize: typography.bodySmall,
	},
	selectedTextStyle: {
		color: lightTheme.colors.onSurface,
		fontSize: typography.bodyMedium,
	},
	containerStyle: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.xs,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	itemContainerStyle: {
		backgroundColor: lightTheme.colors.surface,
	},
	itemTextStyle: {
		color: lightTheme.colors.onSurface,
		fontSize: typography.bodyMedium,
	},
	dropdownItem: {
		padding: spacing.sm,
	},
	dropdownItemDisabled: {
		opacity: 0.4,
		backgroundColor: lightTheme.colors.surfaceVariant,
	},
	itemTextDisabled: {
		color: lightTheme.colors.onSurfaceVariant,
		opacity: 0.5,
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
		minHeight: 50,
	},
	logoutButton: {
		flex: 1,
		height: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
		backgroundColor: lightTheme.colors.primary,
		borderRadius: roundness.xs,
		gap: spacing.sm,
	},
	logoutButtonText: {
		color: lightTheme.colors.onPrimary,
		fontSize: typography.labelLarge,
		fontWeight: "600",
		textAlign: "center",
	},
});