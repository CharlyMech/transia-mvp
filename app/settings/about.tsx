import GitHubProfileCard from "@/components/GitHubProfileCard";
import { roundness, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/useAuthStore";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
	const { theme } = useAppTheme();
	const user = useAuthStore((state) => state.user);
	const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

	const styles = useMemo(() => getStyles(theme), [theme]);

	const contactEmail = process.env.EXPO_PUBLIC_CONTACT_EMAIL || 'dev@charlymech.com';
	const handleEmailPress = async () => {
		const url = `mailto:${contactEmail}`;
		const canOpen = await Linking.canOpenURL(url);
		if (canOpen) {
			await Linking.openURL(url);
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				<Text style={styles.pageTitle}>Acerca de Transia</Text>

				<View style={styles.logoContainer}>
					<Image source={require("@/assets/images/icon.png")} style={styles.logo} />
					{/* TODO: Add version and build auto-info */}
					<Text style={styles.version}>Versión 1.0.0</Text>
					<Text style={styles.buildInfo}>Build 2024.12</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>¿Qué es Transia?</Text>
					<Text style={styles.paragraph}>
						Transia es una aplicación móvil de gestión integral para empresas de transporte y logística.
						Combina control horario de personal y gestión de flotas de vehículos en una única plataforma
						disponible 24/7 desde iOS y Android.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Funcionalidades Principales</Text>

					<Text style={styles.listItemTitle}>Control Horario</Text>
					<Text style={styles.listItem}>• Registro de jornadas con inicio, pausa y finalización.</Text>
					<Text style={styles.listItem}>• Cálculo automático de horas trabajadas.</Text>
					<Text style={styles.listItem}>• Histórico mensual completo.</Text>
					<Text style={styles.listItem}>• Notas explicativas opcionales.</Text>

					<Text style={styles.listItemTitle}>Gestión de Conductores</Text>
					<Text style={styles.listItem}>• Perfiles completos con documentación validada.</Text>
					<Text style={styles.listItem}>• Gestión de estados operativos.</Text>
					<Text style={styles.listItem}>• Búsqueda y filtrado avanzado.</Text>

					<Text style={styles.listItemTitle}>Control de Flota</Text>
					<Text style={styles.listItem}>• Inventario de vehículos (camiones y furgonetas).</Text>
					<Text style={styles.listItem}>• Historial de mantenimientos e ITVs.</Text>
					<Text style={styles.listItem}>• Asignaciones con control de kilometraje.</Text>

					<Text style={styles.listItemTitle}>Reportes e Incidencias</Text>
					<Text style={styles.listItem}>• Creación rápida de reportes categorizados.</Text>
					<Text style={styles.listItem}>• Adjuntar múltiples fotografías.</Text>
					<Text style={styles.listItem}>• Geolocalización GPS opcional.</Text>
					<Text style={styles.listItem}>• Seguimiento de estado (Pendiente/Resuelta).</Text>

					<Text style={styles.listItemTitle}>Control de Acceso por Roles</Text>
					<Text style={styles.listItem}>• Conductor: Acceso a funciones básicas.</Text>
					<Text style={styles.listItem}>• Gestor: Supervisión de equipos.</Text>
					<Text style={styles.listItem}>• Administrador: Acceso completo al sistema.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Desarrollador</Text>
					<GitHubProfileCard />
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Soporte Técnico</Text>
					{isAdminOrManager ? (
						<>
							<Text style={styles.paragraph}>
								Para reportar problemas, solicitar funcionalidades o recibir ayuda:
							</Text>
							<TouchableOpacity onPress={handleEmailPress}>
								<Text style={styles.contactInfo}>{contactEmail}</Text>
							</TouchableOpacity>
						</>
					) : (
						<>
							<Text style={styles.paragraph}>
								Si experimentas problemas técnicos con la aplicación, contacta con tu Gestor o Administrador.
							</Text>
							<Text style={styles.paragraph}>
								Solo los administradores y gestores pueden reportar incidencias técnicas directamente al desarrollador.
							</Text>
						</>
					)}
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>© 2024-2025 Transia MVP</Text>
					<Text style={styles.footerText}>Carlos Sánchez Recio (CharlyMech)</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background
	},
	scrollContainer: {
		padding: spacing.lg,
		paddingTop: spacing.xxl + spacing.lg,
		paddingBottom: spacing.xl * 3
	},
	pageTitle: {
		fontSize: typography.headlineMedium,
		color: theme.colors.onBackground,
		fontWeight: "700",
		marginBottom: spacing.sm,
		textAlign: "center"
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: spacing.xl,
		paddingTop: spacing.md
	},
	logo: {
		width: 120,
		height: 120,
		borderRadius: roundness.lg,
		marginBottom: spacing.md
	},
	version: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		fontWeight: "600"
	},
	buildInfo: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		marginTop: 2
	},
	section: {
		marginBottom: spacing.md
	},
	sectionTitle: {
		fontSize: typography.titleMedium,
		color: theme.colors.onBackground,
		fontWeight: "600",
		marginBottom: spacing.sm
	},
	paragraph: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginBottom: spacing.sm
	},
	bold: {
		fontWeight: "600",
		color: theme.colors.onBackground
	},
	listItem: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginBottom: spacing.sm
	},
	listItemContainer: {
		marginBottom: spacing.md
	},
	listItemTitle: {
		fontSize: typography.titleSmall,
		color: theme.colors.onBackground,
		fontWeight: "600",
		marginBottom: spacing.xs / 2
	},
	listItemContent: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginLeft: spacing.md
	},
	linkContainer: {
		marginBottom: spacing.xs / 2
	},
	contactLink: {
		fontSize: typography.bodyMedium,
		color: theme.colors.primary,
		fontWeight: "500"
	},
	contactInfo: {
		textAlign: "center",
		fontSize: typography.bodyMedium,
		color: theme.colors.primary,
		fontWeight: "500",
		marginBottom: spacing.xs / 2
	},
	footer: {
		alignItems: "center",
		paddingTop: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: theme.colors.outlineVariant,
		marginTop: spacing.lg
	},
	footerText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		textAlign: "center",
		marginBottom: 2
	},
});
