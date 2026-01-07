import { spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function TermsScreen() {
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
				<Text style={styles.pageTitle}>Términos y Condiciones</Text>
				<View style={styles.updateInfo}>
					<Text style={styles.updateText}>Última actualización: Diciembre 2024</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>1. Aceptación</Text>
					<Text style={styles.paragraph}>
						Al usar Transia, aceptas estos Términos y Condiciones. Si no estás de acuerdo, no uses la aplicación.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
					<Text style={styles.paragraph}>
						Transia ofrece:
					</Text>
					<Text style={styles.listItem}>• Control horario de jornadas laborales.</Text>
					<Text style={styles.listItem}>• Gestión de conductores y vehículos.</Text>
					<Text style={styles.listItem}>• Reportes e incidencias con fotografías.</Text>
					<Text style={styles.listItem}>• Historial de mantenimientos e ITVs.</Text>
					<Text style={styles.listItem}>• Control de acceso por roles (Conductor/Gestor/Administrador).</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>3. Requisitos</Text>
					<Text style={styles.listItem}>• Ser mayor de 18 años.</Text>
					<Text style={styles.listItem}>• Contar con autorización de tu empresa.</Text>
					<Text style={styles.listItem}>• Proporcionar información veraz.</Text>
					<Text style={styles.listItem}>• Dispositivo compatible (iOS o Android).</Text>
					<Text style={styles.paragraph}>
						Eres responsable de mantener la confidencialidad de tus credenciales. NO compartas tu usuario y contraseña.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>4. Uso Aceptable</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Permitido:</Text>
					</Text>
					<Text style={styles.listItem}>• Uso profesional para fines laborales.</Text>
					<Text style={styles.listItem}>• Registrar información veraz.</Text>
					<Text style={styles.listItem}>• Crear reportes honestos.</Text>

					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Prohibido:</Text>
					</Text>
					<Text style={styles.listItem}>• Actividades ilegales.</Text>
					<Text style={styles.listItem}>• Registrar datos falsos o manipular control horario.</Text>
					<Text style={styles.listItem}>• Acceder a cuentas de otros usuarios.</Text>
					<Text style={styles.listItem}>• Ingeniería inversa o descompilación.</Text>
					<Text style={styles.listItem}>• Compartir credenciales.</Text>
					<Text style={styles.listItem}>• Interferir con el funcionamiento del sistema.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>5. Limitación de Responsabilidad</Text>
					<Text style={styles.paragraph}>
						La aplicación se proporciona "tal cual" sin garantías. No somos responsables de:
					</Text>
					<Text style={styles.listItem}>• Interrupciones del servicio.</Text>
					<Text style={styles.listItem}>• Pérdida de datos.</Text>
					<Text style={styles.listItem}>• Errores en la información.</Text>
					<Text style={styles.listItem}>• Daños indirectos o consecuentes.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>6. Propiedad Intelectual</Text>
					<Text style={styles.paragraph}>
						La aplicación y su contenido son propiedad de Transia. Te otorgamos una licencia limitada de uso para fines laborales.
					</Text>
					<Text style={styles.paragraph}>
						NO puedes: copiar, modificar, distribuir, vender o realizar ingeniería inversa de la aplicación.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>7. Modificaciones</Text>
					<Text style={styles.paragraph}>
						Podemos modificar estos términos en cualquier momento. Te notificaremos cambios significativos mediante la aplicación o email.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>8. Ley Aplicable</Text>
					<Text style={styles.paragraph}>
						Estos términos se rigen por las leyes de España. Jurisdicción exclusiva: tribunales de Madrid.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>9. Contacto</Text>
					{isAdminOrManager ? (
						<>
							<Text style={styles.paragraph}>
								Para consultas sobre estos términos:
							</Text>
							<TouchableOpacity onPress={handleEmailPress}>
								<Text style={styles.contactLink}>Email: {contactEmail}</Text>
							</TouchableOpacity>
							<Text style={styles.paragraph}>
								Respuesta en 72 horas laborables.
							</Text>
						</>
					) : (
						<>
							<Text style={styles.paragraph}>
								Para consultas sobre estos términos y condiciones, contacta con tu Gestor o Administrador.
							</Text>
							<Text style={styles.paragraph}>
								Solo administradores y gestores pueden contactar directamente con el desarrollador.
							</Text>
						</>
					)}
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>
						© 2024-2025 Transia MVP - Carlos Sánchez Recio (CharlyMech)
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
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
		marginBottom: spacing.lg,
		textAlign: "center"
	},
	updateInfo: {
		marginBottom: spacing.md,
		flexDirection: "row",
	},
	updateText: {
		fontSize: typography.bodySmall,
		fontStyle: "italic",
		color: theme.colors.onSurface,
		fontWeight: "400"
	},
	section: {
		marginBottom: spacing.xl
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
		marginBottom: spacing.xs / 2,
		marginLeft: spacing.xs
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
	contactLink: {
		fontSize: typography.bodyMedium,
		color: theme.colors.primary,
		fontWeight: "500",
		marginBottom: spacing.xs
	},
	footer: {
		paddingTop: spacing.lg,
		borderTopWidth: 1,
		borderTopColor: theme.colors.outlineVariant,
		marginTop: spacing.lg
	},
	footerText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		textAlign: "center",
		marginBottom: spacing.xs / 2
	},
});
