import { spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function PrivacyScreen() {
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
				<Text style={styles.pageTitle}>Política de Privacidad</Text>
				<View style={styles.updateInfo}>
					<Text style={styles.updateText}>Última actualización: Diciembre 2024</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>1. Introducción</Text>
					<Text style={styles.paragraph}>
						Esta Política de Privacidad describe cómo Transia recopila, usa, almacena y protege
						tus datos personales. Transia cumple con el RGPD de la Unión Europea, la LOPD de España
						y la normativa laboral vigente.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>2. Responsable del Tratamiento</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Responsable:</Text> Carlos Sánchez Recio (CharlyMech), desarrollador y mantenedor de la aplicación y la plataforma.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>3. Datos Recopilados</Text>

					<Text style={styles.subsectionTitle}>Datos Personales</Text>
					<Text style={styles.listItem}>• Nombre completo y DNI/NIE validado.</Text>
					<Text style={styles.listItem}>• Email y teléfono de contacto.</Text>
					<Text style={styles.listItem}>• Fecha de nacimiento (opcional).</Text>
					<Text style={styles.listItem}>• Fotografía de perfil (opcional).</Text>

					<Text style={styles.subsectionTitle}>Datos Profesionales</Text>
					<Text style={styles.listItem}>• Número de licencia de conducir (opcional).</Text>
					<Text style={styles.listItem}>• Vehículo asignado actualmente.</Text>
					<Text style={styles.listItem}>• Estado operativo laboral.</Text>
					<Text style={styles.listItem}>• Rol de usuario (Conductor/Gestor/Administrador).</Text>
					<Text style={styles.listItem}>• Historial de asignaciones de vehículos.</Text>

					<Text style={styles.subsectionTitle}>Datos de Control Horario</Text>
					<Text style={styles.listItem}>• Registros de entrada, pausas y salida.</Text>
					<Text style={styles.listItem}>• Horas totales trabajadas calculadas.</Text>
					<Text style={styles.listItem}>• Notas explicativas opcionales.</Text>
					<Text style={styles.listItem}>• Histórico mensual y anual completo.</Text>

					<Text style={styles.subsectionTitle}>Geolocalización GPS (Solo Puntual)</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Importante:</Text> La aplicación NO realiza seguimiento continuo y/o en tiempo real
						de ubicación. Se implementan funcionalidades de geolocalización en caso que el usuario así lo marque en la propia aplicación.
					</Text>
					<Text style={styles.listItem}>• Latitud y longitud geográfica.</Text>
					<Text style={styles.listItem}>• Dirección postal (geocoding reverso).</Text>
					<Text style={styles.listItem}>• Vinculado únicamente al reporte específico.</Text>
					<Text style={styles.paragraph}>
						NO se rastrea en segundo plano. NO se almacena historial de ubicaciones.
					</Text>

					<Text style={styles.subsectionTitle}>Reportes e Incidencias</Text>
					<Text style={styles.listItem}>• Tipo y descripción del reporte.</Text>
					<Text style={styles.listItem}>• Vehículo y conductor asociados.</Text>
					<Text style={styles.listItem}>• Fotografías adjuntas (opcional).</Text>
					<Text style={styles.listItem}>• Localización por GPS (opcional).</Text>
					<Text style={styles.listItem}>• Estado y fecha de creación/cierre.</Text>

					<Text style={styles.subsectionTitle}>Datos Técnicos</Text>
					<Text style={styles.listItem}>• Tipo de dispositivo y sistema operativo.</Text>
					<Text style={styles.listItem}>• Dirección IP de conexión.</Text>
					<Text style={styles.listItem}>• Tokens de autenticación (JWT).</Text>
					<Text style={styles.listItem}>• Datos de sesión en AsyncStorage local.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>4. Finalidad del Tratamiento</Text>
					<Text style={styles.paragraph}>
						Usamos tus datos para:
					</Text>
					<Text style={styles.listItem}>• Cumplir con el registro obligatorio de jornadas (Real Decreto-ley 8/2019).</Text>
					<Text style={styles.listItem}>• Gestionar la asignación de vehículos a conductores.</Text>
					<Text style={styles.listItem}>• Realizar seguimiento de mantenimientos e ITVs.</Text>
					<Text style={styles.listItem}>• Gestionar reportes e incidencias.</Text>
					<Text style={styles.listItem}>• Autenticar usuarios y controlar accesos por roles.</Text>
					<Text style={styles.listItem}>• Cumplir con obligaciones legales y fiscales.</Text>
					<Text style={styles.listItem}>• Mantener logs de auditoría y trazabilidad del sistema.</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>5. Base Legal del Tratamiento</Text>
					<Text style={styles.paragraph}>
						Tratamos tus datos basándonos en:
					</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Contrato laboral:</Text> Control horario y asignación de vehículos.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Obligación legal:</Text> Cumplimiento del RD-ley 8/2019 sobre registro de jornada.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Interés legítimo:</Text> Gestión eficiente de flota y seguridad de datos.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Consentimiento:</Text> Geolocalización GPS y fotografías (opcional y revocable).</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>6. Compartición de Datos</Text>
					<Text style={styles.paragraph}>
						Tus datos pueden ser compartidos con:
					</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Personal dentro empresa:</Text> Según roles (Conductor/Gestor/Administrador).</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Supabase:</Text> Hosting en AWS Europa, cumple con RGPD.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Autoridades:</Text> Cuando lo requiera la ley (Inspección de Trabajo, etc.).</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>NO se vende ni se ceden tus datos con fines comerciales.</Text>
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>7. Almacenamiento y Seguridad</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Ubicación:</Text> Servidores en la Unión Europea (Supabase/AWS Europa).
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Medidas de seguridad:</Text>
					</Text>
					<Text style={styles.listItem}>• Cifrado TLS/SSL en comunicaciones.</Text>
					<Text style={styles.listItem}>• Autenticación con tokens JWT.</Text>
					<Text style={styles.listItem}>• Control de acceso basado en roles.</Text>
					<Text style={styles.listItem}>• Validación de datos de entrada.</Text>
					<Text style={styles.listItem}>• Auditorías de acciones realizadas.</Text>
					<Text style={styles.listItem}>• Almacenamiento local cifrado (AsyncStorage).</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Retención:</Text> Mínimo 4 años para datos laborales según normativa española.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>8. Tus Derechos según el RGPD</Text>
					<Text style={styles.paragraph}>
						Tienes derecho a:
					</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Acceso:</Text> Confirmar qué datos tratamos y obtener copia.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Rectificación:</Text> Corregir datos inexactos.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Supresión:</Text> Solicitar eliminación (sujeto a obligaciones legales).</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Limitación:</Text> Restringir el tratamiento en ciertas circunstancias.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Portabilidad:</Text> Recibir tus datos en formato estructurado (JSON/CSV).</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Oposición:</Text> Oponerte al tratamiento basado en interés legítimo.</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Revocar consentimiento:</Text> Para geolocalización y fotografías.</Text>

					{isAdminOrManager ? (
						<>
							<Text style={styles.paragraph}>
								<Text style={styles.bold}>Ejercer tus derechos:</Text>
							</Text>
							<TouchableOpacity onPress={handleEmailPress}>
								<Text style={styles.contactLink}>Email: {contactEmail}</Text>
							</TouchableOpacity>
							<Text style={styles.paragraph}>
								Respuesta en máximo 1 mes. Incluye copia de DNI/NIE para verificación.
							</Text>
						</>
					) : (
						<Text style={styles.paragraph}>
							Para ejercer tus derechos RGPD, contacta con tu Gestor o Administrador de empresa. Ellos gestionarán tu solicitud ante el responsable del tratamiento.
						</Text>
					)}

					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Reclamaciones:</Text> Si no estás conforme con la gestión de tus datos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) - www.aepd.es
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>9. Contacto</Text>
					{isAdminOrManager ? (
						<>
							<Text style={styles.paragraph}>
								Para consultas sobre privacidad o ejercer tus derechos:
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
								Para ejercer tus derechos RGPD o consultas sobre privacidad, contacta con tu Superior o Administrador de empresa.
							</Text>
							<Text style={styles.paragraph}>
								Ellos gestionarán tu solicitud ante el responsable del tratamiento.
							</Text>
						</>
					)}
				</View>

				<View style={styles.lastMessage}>
					<Text style={styles.lastMessageText}>
						Esta política cumple con el RGPD y la LOPD española.
					</Text>
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
	subsectionTitle: {
		fontSize: typography.titleSmall,
		color: theme.colors.onBackground,
		fontWeight: "600",
		marginTop: spacing.sm,
		marginBottom: spacing.xs
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
	lastMessage: {
		paddingTop: spacing.lg,
	},
	lastMessageText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		textAlign: "center",
		fontStyle: "italic"
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
		fontStyle: "italic"
	},
});
