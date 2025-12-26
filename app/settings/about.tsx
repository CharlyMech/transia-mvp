import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { Image } from "expo-image";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
	const handleEmailPress = () => Linking.openURL('mailto:dev@charlymech.com');
	const handleGitHubPress = () => Linking.openURL('https://github.com/CharlyMech');
	const handleWebPress = () => Linking.openURL('https://charlymech.com');

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
					<Text style={styles.sectionTitle}>Solución Integral para Gestión de Flotas</Text>
					<Text style={styles.paragraph}>
						Transia es una aplicación diseñada para empresas de transporte y logística
						que necesitan gestionar eficientemente su flota de vehículos y el control horario de su
						personal. Combina múltiples herramientas de gestión en una única plataforma móvil disponible
						24/7 desde cualquier dispositivo iOS o Android.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Funcionalidades Principales</Text>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Control Horario:</Text>
						<Text style={styles.listItemContent}>
							Sistema completo de registro de jornadas laborales con inicio, pausa, reanudación y
							finalización. Incluye cálculo automático de horas trabajadas, comparación con objetivo
							diario, histórico mensual organizado por días, cierre automático de jornadas a las
							23:59:59, y capacidad de adjuntar notas explicativas a cada registro.
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Gestión de Conductores:</Text>
						<Text style={styles.listItemContent}>
							Perfiles completos con datos personales, documentación (DNI/NIE validado), licencia de
							conducir, información de contacto, gestión de estados operativos (Activo, Inactivo, Baja,
							Vacaciones), búsqueda avanzada por múltiples criterios, y controles de privacidad
							diferenciados según el rol del usuario.
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Control de Flota de Vehículos:</Text>
						<Text style={styles.listItemContent}>
							Inventario completo de vehículos con soporte para diferentes tipos de vehículos. Incluye gestión de estados en tiempo real,
							historial de mantenimientos e ITV, asignaciones a conductores con kilometraje, y filtrado avanzado por tipo, marca, modelo y estado.
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Reportes e Incidencias:</Text>
						<Text style={styles.listItemContent}>
							Creación rápida de reportes categorizados por tipo, geolocalización GPS opcional
							con mapa interactivo, vinculación automática a conductores y vehículos, seguimiento de
							estado (Pendiente/Resuelta) y notas descriptivas obligatorias.
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Control de Acceso por Roles:</Text>
						<Text style={styles.listItemContent}>
							Diferentes niveles de acceso según las responsabilidades de cada usuario, asegurando
							que cada persona tenga acceso únicamente a las funcionalidades necesarias para su trabajo.
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Historial de Mantenimientos:</Text>
						<Text style={styles.listItemContent}>
							Registro detallado de todos los servicios realizados a cada vehículo, incluyendo ITVs,
							mantenimientos programados y otros servicios. Almacena información del taller, costes,
							kilometraje, documentos adjuntos y fecha del próximo mantenimiento recomendado.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Seguridad y Cumplimiento</Text>
					<Text style={styles.listItem}>• Cifrado TLS/SSL en todas las comunicaciones</Text>
					<Text style={styles.listItem}>• Datos almacenados en infraestructura europea de Supabase</Text>
					<Text style={styles.listItem}>• Autenticación con tokens JWT con expiración automática</Text>
					<Text style={styles.listItem}>• Control de acceso basado en roles (RBAC)</Text>
					<Text style={styles.listItem}>• Row Level Security (RLS) en base de datos PostgreSQL</Text>
					<Text style={styles.listItem}>• Cumplimiento con RGPD (GDPR) europeo</Text>
					<Text style={styles.listItem}>• Cumplimiento con normativa laboral española vigente</Text>
					<Text style={styles.listItem}>• Alineación con estándares ISO/IEC 27001 (Seguridad de la Información)</Text>
					<Text style={styles.listItem}>• Alineación con ISO/IEC 27018 (Protección de datos personales en la nube)</Text>
					<Text style={styles.listItem}>• Retención mínima de datos de 4 años (obligación legal en España)</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Privacidad y Geolocalización</Text>
					<Text style={styles.paragraph}>
						La aplicación respeta estrictamente tu privacidad. La geolocalización GPS solo se utiliza de
						forma puntual cuando el usuario crea un reporte de incidencia y lo autoriza explícitamente.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Importante:</Text> Transia NO realiza seguimiento continuo de ubicación,
						NO rastrea tus movimientos en segundo plano, y NO almacena historial de ubicaciones. La
						geolocalización es completamente opcional y solo se captura en el momento exacto de crear un
						reporte si el usuario lo permite.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Desarrollador</Text>
					<Text style={styles.paragraph}>
						Desarrollado por <Text style={styles.bold}>Carlos Sánchez Recio (CharlyMech)</Text>,
						ingeniero de software especializado en desarrollo móvil multiplataforma y soluciones
						empresariales con React Native, TypeScript y arquitecturas escalables.
					</Text>

					<TouchableOpacity onPress={handleEmailPress} style={styles.linkContainer}>
						<Text style={styles.contactLink}>Email: dev@charlymech.com</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleGitHubPress} style={styles.linkContainer}>
						<Text style={styles.contactLink}>GitHub: github.com/CharlyMech</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleWebPress} style={styles.linkContainer}>
						<Text style={styles.contactLink}>Web: charlymech.com</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Soporte Técnico</Text>
					<Text style={styles.paragraph}>
						Para reportar problemas técnicos, solicitar nuevas funcionalidades o recibir ayuda con la
						aplicación:
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactInfo}>Soporte: dev@charlymech.com</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleGitHubPress}>
						<Text style={styles.contactInfo}>Issues: github.com/CharlyMech/transia-mvp</Text>
					</TouchableOpacity>
					<Text style={styles.paragraph}>
						Tiempo de respuesta habitual: 24-48 horas laborables. Para incidencias críticas que afecten
						a la operativa, incluir "[URGENTE]" en el asunto del email.
					</Text>
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>© 2024-2025 Transia MVP</Text>
					<Text style={styles.footerText}>Carlos Sánchez Recio (CharlyMech)</Text>
					<Text style={styles.footerText}>Licencia GPL v3 - Uso No Comercial</Text>
					<Text style={styles.footerText}>Desarrollado para empresas de transporte y logística</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background
	},
	scrollContainer: {
		padding: spacing.lg,
		paddingTop: spacing.xxl + spacing.lg,
		paddingBottom: spacing.xl * 3
	},
	pageTitle: {
		fontSize: typography.headlineMedium,
		color: lightTheme.colors.onBackground,
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
		color: lightTheme.colors.onSurfaceVariant,
		fontWeight: "600"
	},
	buildInfo: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		marginTop: 2
	},
	section: {
		marginBottom: spacing.md
	},
	sectionTitle: {
		fontSize: typography.titleMedium,
		color: lightTheme.colors.onBackground,
		fontWeight: "600",
		marginBottom: spacing.sm
	},
	paragraph: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginBottom: spacing.sm
	},
	bold: {
		fontWeight: "600",
		color: lightTheme.colors.onBackground
	},
	listItem: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginBottom: spacing.sm
	},
	listItemContainer: {
		marginBottom: spacing.md
	},
	listItemTitle: {
		fontSize: typography.titleSmall,
		color: lightTheme.colors.onBackground,
		fontWeight: "600",
		marginBottom: spacing.xs / 2
	},
	listItemContent: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
		lineHeight: 22,
		marginLeft: spacing.md
	},
	linkContainer: {
		marginBottom: spacing.xs / 2
	},
	contactLink: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.primary,
		fontWeight: "500"
	},
	contactInfo: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.primary,
		fontWeight: "500",
		marginBottom: spacing.xs / 2
	},
	footer: {
		alignItems: "center",
		paddingTop: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: lightTheme.colors.outlineVariant,
		marginTop: spacing.lg
	},
	footerText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: "center",
		marginBottom: 2
	},
});
