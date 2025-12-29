import { Card } from "@/components/Card";
import { IconPlaceholder } from "@/components/IconPlaceholder";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme"; // Ajusta la ruta según tu estructura
import { useAuthStore } from "@/stores/useAuthStore";
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import { ChevronRight, LogOut, UserRound } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const [theme, setTheme] = useState<string>('light');
	const [language, setLanguage] = useState<string>('es');
	const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
	const { user, logout } = useAuthStore();

	useEffect(() => {
		checkNotificationPermissions();
	}, []);

	const checkNotificationPermissions = async () => {
		const { status } = await Notifications.getPermissionsAsync();
		setNotificationsEnabled(status === 'granted');
	};

	const handleNotificationToggle = async (value: boolean) => {
		if (value) {
			// Activate notifications
			const { status: existingStatus } = await Notifications.getPermissionsAsync();

			if (existingStatus === 'granted') {
				setNotificationsEnabled(true);
			} else if (existingStatus === 'undetermined') {
				// First time, request permissions
				const { status: newStatus } = await Notifications.requestPermissionsAsync();
				setNotificationsEnabled(newStatus === 'granted');

				if (newStatus !== 'granted') {
					Alert.alert(
						'Permisos denegados',
						'No se pudieron activar las notificaciones. Por favor, actívalas desde la configuración de tu dispositivo.',
						[
							{ text: 'Cancelar', style: 'cancel' },
							{ text: 'Abrir ajustes', onPress: () => openAppSettings() }
						]
					);
				}
			} else {
				// Previous permissions denied, redirect to settings
				Alert.alert(
					'Notificaciones desactivadas',
					'Para recibir notificaciones, debes activarlas desde la configuración de tu dispositivo.',
					[
						{ text: 'Cancelar', style: 'cancel' },
						{ text: 'Abrir ajustes', onPress: () => openAppSettings() }
					]
				);
			}
		} else {
			// User wants to disable notifications
			Alert.alert(
				'Desactivar notificaciones',
				'Para desactivar las notificaciones, debes hacerlo desde la configuración de tu dispositivo.',
				[
					{ text: 'Cancelar', style: 'cancel' },
					{ text: 'Abrir ajustes', onPress: () => openAppSettings() }
				]
			);
		}
	};

	const openAppSettings = () => {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:');
		} else {
			Linking.openSettings();
		}
	};

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

				{user && (
					<View style={styles.section}>
						<Card
							paddingX={spacing.sm}
							paddingY={spacing.sm}
							rounded={roundness.sm}
							shadow='none'
							backgroundColor={lightTheme.colors.surface}
							onPress={() => router.push(`/drivers/${user.id}`)}
						>
							<View style={styles.loggedUserContainer}>
								{user.imageUrl ? (
									<Image
										source={{ uri: user.imageUrl }}
										style={styles.userImage}
									/>
								) : (
									<Card
										paddingX={0}
										paddingY={0}
										rounded={roundness.xs}
										shadow='none'
										backgroundColor={`${lightTheme.colors.primary}CC`}
										style={styles.userImage}
									>
										<IconPlaceholder
											color={lightTheme.colors.onPrimary}
											icon={UserRound}
											size={80}
										/>
									</Card>
								)}
								<View style={styles.userInfo}>
									<Text style={styles.userName}>
										Hola, {user.name} {user.surnames}
									</Text>
									<Text style={styles.userEmail}>
										{user.email}
									</Text>
								</View>
								<View style={styles.arrowContainer}>
									<ChevronRight size={20} style={styles.rowIcon} />
								</View>
							</View>
						</Card>
					</View>
				)}


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
							<Pressable
								// TODO
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
								// TODO
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
							<View style={styles.separator} />
							<Pressable
								onPress={() => router.push(`/drivers/${user?.id}/time-history`)}
								style={({ pressed }) => [
									styles.rowContainer,
									pressed && styles.rowPressed,
								]}
							>
								{({ pressed }) => (
									<View style={styles.row}>
										<Text style={styles.rowText}>Acceder a mi historial horario</Text>
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
							<View style={[styles.row, { paddingVertical: 0 }]}>
								<Text style={styles.rowText}>Notificaciones</Text>
								<Switch
									value={notificationsEnabled}
									onValueChange={handleNotificationToggle}
									color={lightTheme.colors.primary}
									style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
								/>
							</View>
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
				<View style={styles.footerContainer}>
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={() => logout()}
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
	loggedUserContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	userImage: {
		width: 60,
		height: 60,
		borderRadius: roundness.xs,
	},
	userInfo: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: spacing.xs,
	},
	arrowContainer: {
		marginRight: spacing.sm,
		alignSelf: 'center',
	},
	userName: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	userStatus: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	userEmail: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
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
		marginTop: spacing.xxxl,
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