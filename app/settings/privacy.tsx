import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
	const handleEmailPress = () => Linking.openURL('mailto:dev@charlymech.com');

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
						Transia respeta tu privacidad y se compromete a proteger tus datos personales. Esta Política
						describe de forma transparente y detallada cómo recopilamos, usamos, almacenamos y protegemos
						tu información al usar la aplicación de gestión de flotas de transporte y control horario
						de personal.
					</Text>
					<Text style={styles.paragraph}>
						Cumplimos estrictamente con el Reglamento General de Protección de Datos (RGPD/GDPR) de la
						Unión Europea y la Ley Orgánica de Protección de Datos (LOPD) de España, además de la
						normativa laboral vigente en materia de registro de jornada.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>2. Responsable del Tratamiento</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Responsable:</Text> Carlos Sánchez Recio (CharlyMech) - Transia MVP
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>
							<Text style={styles.bold}>Contacto DPO:</Text> dev@charlymech.com
						</Text>
					</TouchableOpacity>
					<Text style={styles.paragraph}>
						Puedes contactarnos en cualquier momento para ejercer tus derechos o realizar consultas
						sobre el tratamiento de tus datos personales.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>3. Datos que Recopilamos</Text>

					<Text style={styles.subsectionTitle}>3.1. Datos de Identificación Personal</Text>
					<Text style={styles.paragraph}>
						• Nombre completo y apellidos (obligatorio){'\n'}
						• Número de documento de identidad: DNI o NIE validado con formato oficial (obligatorio){'\n'}
						• Fecha de nacimiento (obligatorio){'\n'}
						• Dirección postal completa (obligatorio){'\n'}
						• Fotografía de perfil (opcional){'\n'}
						• Correo electrónico con formato válido (opcional){'\n'}
						• Número de teléfono móvil español de 9 dígitos (opcional)
					</Text>

					<Text style={styles.subsectionTitle}>3.2. Datos Profesionales y Laborales</Text>
					<Text style={styles.paragraph}>
						• Número de licencia de conducir (opcional){'\n'}
						• Tipo y categorías de licencia de conducir autorizadas{'\n'}
						• Fecha de caducidad de la licencia{'\n'}
						• Vehículo asignado actualmente (matrícula, marca, modelo, tipo){'\n'}
						• Estado operativo laboral: Activo, Inactivo, Baja temporal o Vacaciones{'\n'}
						• Fecha de alta/registro en el sistema{'\n'}
						• Rol de usuario: Conductor, Gestor o Administrador{'\n'}
						• Historial de asignaciones de vehículos (fechas, kilometraje inicial y final)
					</Text>

					<Text style={styles.subsectionTitle}>3.3. Datos de Control Horario</Text>
					<Text style={styles.paragraph}>
						• Registros diarios de entrada al trabajo con timestamp exacto{'\n'}
						• Registros de pausas durante la jornada (hora de inicio y fin){'\n'}
						• Múltiples rangos horarios por día (para pausas de comida, descansos){'\n'}
						• Registros de reanudación del trabajo tras pausas{'\n'}
						• Registros de finalización de jornada laboral{'\n'}
						• Horas totales trabajadas calculadas automáticamente{'\n'}
						• Horas extras respecto al objetivo diario (480 minutos / 8 horas){'\n'}
						• Notas explicativas opcionales asociadas a cada jornada{'\n'}
						• Histórico completo mensual y anual de todas las jornadas{'\n'}
						• Registros de cierres automáticos a las 23:59:59 de jornadas no finalizadas
					</Text>

					<Text style={styles.subsectionTitle}>3.4. Geolocalización GPS (Solo Puntual)</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Importante:</Text> La aplicación NO realiza seguimiento continuo
						de tu ubicación ni rastrea tus movimientos.
					</Text>
					<Text style={styles.paragraph}>
						Únicamente se captura la ubicación GPS cuando:{'\n'}
						• Creas manualmente un reporte o incidencia{'\n'}
						• Activas explícitamente la opción de geolocalización (toggle on/off){'\n'}
						• Otorgas permiso en ese momento específico
					</Text>
					<Text style={styles.paragraph}>
						Datos GPS capturados en cada reporte (si lo autorizas):{'\n'}
						• Latitud geográfica (-90° a +90°){'\n'}
						• Longitud geográfica (-180° a +180°){'\n'}
						• Altitud sobre el nivel del mar (opcional){'\n'}
						• Precisión del GPS en metros (opcional){'\n'}
						• Dirección postal obtenida mediante geocoding reverso (opcional)
					</Text>
					<Text style={styles.paragraph}>
						NO almacenamos historial de ubicaciones. NO rastreamos en segundo plano. NO hay tracking
						en tiempo real. La geolocalización es completamente opcional y puntual.
					</Text>

					<Text style={styles.subsectionTitle}>3.5. Reportes e Incidencias</Text>
					<Text style={styles.paragraph}>
						• Tipo de reporte: Accidente, Mantenimiento, Revisión, ITV, u Otro{'\n'}
						• Descripción detallada del reporte (mínimo 10 caracteres, máximo 500){'\n'}
						• Vehículo asociado al reporte (matrícula, marca, modelo){'\n'}
						• Conductor que crea el reporte (auto-asignado){'\n'}
						• Fecha y hora de creación del reporte{'\n'}
						• Fecha y hora de cierre del reporte (si está resuelto){'\n'}
						• Estado: Pendiente o Resuelta{'\n'}
						• Marca de lectura: Leído o No leído{'\n'}
						• Fotografías múltiples adjuntas (opcionales, desde cámara o galería){'\n'}
						• Ubicación GPS del incidente (opcional, ver sección 3.4)
					</Text>

					<Text style={styles.subsectionTitle}>3.6. Datos de Vehículos de la Flota</Text>
					<Text style={styles.paragraph}>
						• Marca del vehículo{'\n'}
						• Modelo del vehículo{'\n'}
						• Matrícula validada con formato oficial español{'\n'}
						• Año de fabricación (entre 1900 y año actual){'\n'}
						• Tipo de vehículo: Camión tráiler, Camión rígido, Camión 3500kg, Furgoneta pequeña,
						mediana o grande{'\n'}
						• Fecha de registro en el sistema{'\n'}
						• Fecha de compra (opcional){'\n'}
						• Estado operativo: Activo, Inactivo, En mantenimiento, Averiado{'\n'}
						• Fotografía del vehículo (opcional){'\n'}
						• Historial completo de mantenimientos (fechas, talleres, costes, kilometraje){'\n'}
						• Historial de asignaciones a conductores{'\n'}
						• Documentación de ITV y revisiones
					</Text>

					<Text style={styles.subsectionTitle}>3.7. Datos Técnicos de Uso</Text>
					<Text style={styles.paragraph}>
						• Tipo de dispositivo móvil (modelo, fabricante){'\n'}
						• Sistema operativo (iOS o Android) y versión{'\n'}
						• Dirección IP de conexión{'\n'}
						• Logs de acceso y actividad en la aplicación{'\n'}
						• Logs de auditoría de cambios en datos sensibles{'\n'}
						• Tokens JWT de autenticación con fecha de expiración{'\n'}
						• Datos de sesión almacenados localmente en AsyncStorage del dispositivo
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>4. Finalidad del Tratamiento</Text>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>a) Control Horario Laboral:</Text>
						<Text style={styles.listItemContent}>
							Registro obligatorio de jornadas de trabajo según Real Decreto-ley 8/2019. Cálculo automático de horas trabajadas,
							horas extras, y cumplimiento de normativa laboral vigente.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>b) Gestión Operativa de Flota:</Text>
						<Text style={styles.listItemContent}>
							Asignación eficiente de vehículos a conductores, seguimiento del estado de la flota, planificación de mantenimientos,
							control de ITVs y documentación.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>c) Gestión de Incidencias:</Text>
						<Text style={styles.listItemContent}>
							Creación, seguimiento y resolución de reportes relacionados con vehículos, accidentes, mantenimientos y revisiones.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>d) Control de Acceso y Seguridad:</Text>
						<Text style={styles.listItemContent}>
							Autenticación de usuarios con credenciales seguras, gestión de permisos diferenciados por roles (Conductor,
							Gestor, Administrador), y protección de datos sensibles.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>e) Comunicaciones Laborales:</Text>
						<Text style={styles.listItemContent}>
							Notificaciones sobre incidencias, actualizaciones de la aplicación, cambios en asignaciones y comunicaciones
							necesarias para la operativa diaria.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>f) Cumplimiento Legal y Fiscal:</Text>
						<Text style={styles.listItemContent}>
							Obligaciones laborales (registro de jornada), obligaciones fiscales (facturación de servicios), obligaciones ante
							la Seguridad Social, y obligaciones de conservación de documentación.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>g) Auditoría y Trazabilidad:</Text>
						<Text style={styles.listItemContent}>
							Mantener logs de auditoría para detectar accesos no autorizados, cambios en datos críticos, y garantizar la integridad
							del sistema.
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>5. Base Legal del Tratamiento</Text>
					<Text style={styles.paragraph}>
						Tratamos tus datos personales basándonos en las siguientes bases legales según el RGPD:
					</Text>
					<Text style={styles.paragraph}>
						• <Text style={styles.bold}>Ejecución de contrato laboral (Art. 6.1.b RGPD):</Text> Gestión
						del control horario, asignación de vehículos, y cumplimiento de obligaciones contractuales{'\n'}
						• <Text style={styles.bold}>Obligación legal (Art. 6.1.c RGPD):</Text> Cumplimiento de
						normativa laboral (RD-ley 8/2019 sobre registro de jornada), normativa fiscal, y obligaciones
						ante la Seguridad Social{'\n'}
						• <Text style={styles.bold}>Interés legítimo (Art. 6.1.f RGPD):</Text> Gestión eficiente
						de la flota de transporte, seguridad de los datos, prevención de fraudes, y mejora de la
						operativa empresarial{'\n'}
						• <Text style={styles.bold}>Consentimiento explícito (Art. 6.1.a RGPD):</Text> Captura de
						geolocalización GPS en reportes, uso de fotografías personales de perfil, y tratamiento de
						imágenes en incidencias
					</Text>
					<Text style={styles.paragraph}>
						Puedes revocar tu consentimiento en cualquier momento desde la configuración de la aplicación
						o contactando con el DPO, sin que ello afecte a la licitud del tratamiento basado en el
						consentimiento previo a su retirada.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>6. Compartición de Datos</Text>
					<Text style={styles.paragraph}>
						Tus datos personales pueden ser compartidos con las siguientes categorías de destinatarios:
					</Text>
					<Text style={styles.paragraph}>
						• <Text style={styles.bold}>Personal autorizado de tu empresa:</Text> Gestores y
						Administradores tienen acceso a tus datos según su rol y necesidades operativas. Los
						Conductores solo acceden a sus propios datos. Los Gestores acceden a datos de conductores
						asignados. Los Administradores tienen acceso completo necesario para la gestión.{'\n'}
						• <Text style={styles.bold}>Proveedores de servicios tecnológicos:</Text> Supabase
						(PostgreSQL hosting en AWS Europa, almacenamiento de imágenes), servicios de infraestructura
						cloud con centros de datos en la Unión Europea y sujetos a acuerdos de procesamiento de
						datos conforme al RGPD.{'\n'}
						• <Text style={styles.bold}>Autoridades y organismos públicos:</Text> Cuando lo requiera
						la ley (Inspección de Trabajo, Agencia Tributaria, Seguridad Social, autoridades judiciales).
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>NO vendemos, alquilamos ni cedemos tus datos personales a
						terceros con fines comerciales o publicitarios.</Text>
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>7. Almacenamiento y Seguridad</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Ubicación física de los datos:</Text> Todos tus datos se
						almacenan en servidores ubicados en la Unión Europea (Supabase con infraestructura AWS
						Europa), garantizando pleno cumplimiento del RGPD.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Medidas de seguridad técnicas implementadas:</Text>
					</Text>
					<Text style={styles.listItem}>• Cifrado TLS/SSL 1.3 en todas las comunicaciones entre la app y el servidor</Text>
					<Text style={styles.listItem}>• Cifrado de datos en reposo en la base de datos PostgreSQL</Text>
					<Text style={styles.listItem}>• Autenticación segura mediante tokens JWT con fecha de expiración</Text>
					<Text style={styles.listItem}>• Control de acceso basado en roles (RBAC) a nivel de aplicación</Text>
					<Text style={styles.listItem}>• Row Level Security (RLS) a nivel de base de datos</Text>
					<Text style={styles.listItem}>• Validación y sanitización de todos los datos de entrada (Zod schemas)</Text>
					<Text style={styles.listItem}>• Logs de auditoría completos de accesos y modificaciones</Text>
					<Text style={styles.listItem}>• Backups automáticos diarios cifrados</Text>
					<Text style={styles.listItem}>• Monitorización continua de accesos sospechosos</Text>
					<Text style={styles.listItem}>• Almacenamiento local en dispositivo cifrado mediante AsyncStorage</Text>
					<Text style={styles.listItem}>• Protección contra inyección SQL mediante consultas parametrizadas</Text>
					<Text style={styles.listItem}>• Actualización regular de dependencias de seguridad</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Período de retención:</Text> Conservamos tus datos durante el
						tiempo estrictamente necesario para las finalidades descritas. Para datos de control horario,
						el mínimo legal es de 4 años desde la finalización de la relación laboral según la normativa
						española. Tras este período, los datos se anonimizarán o eliminarán salvo obligación legal
						de conservación adicional.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>8. Tus Derechos según el RGPD</Text>
					<Text style={styles.paragraph}>
						Como titular de datos personales, tienes los siguientes derechos que puedes ejercer en
						cualquier momento:
					</Text>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho de acceso (Art. 15 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Confirmar si tratamos tus datos y obtener una copia de los mismos, información sobre las finalidades, categorías
							de datos, destinatarios y período de conservación.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho de rectificación (Art. 16 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Corregir datos personales inexactos o incompletos que te conciernen.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho de supresión (Art. 17 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Solicitar la eliminación de tus datos cuando ya no sean necesarios para los fines para los que fueron
							recogidos, hayas retirado el consentimiento, o exista otra causa legal. Este derecho está
							sujeto a las obligaciones legales de conservación (mínimo 4 años para datos laborales).
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho a la limitación del tratamiento (Art. 18 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Solicitar que limitemos el tratamiento de tus datos en determinadas circunstancias (por
							ejemplo, mientras se verifica la exactitud de los datos o la legitimidad del tratamiento).
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho a la portabilidad (Art. 20 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Recibir tus datos personales en un formato estructurado, de uso común y lectura mecánica (JSON, CSV),
							y transmitirlos a otro responsable del tratamiento.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho de oposición (Art. 21 RGPD):</Text>
						<Text style={styles.listItemContent}>
							Oponerte en cualquier momento al tratamiento de tus datos basado en interés legítimo, salvo que
							existan motivos legítimos imperiosos para el tratamiento.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho a no ser objeto de decisiones automatizadas (Art. 22 RGPD):</Text>
						<Text style={styles.listItemContent}>
							La aplicación NO toma decisiones automatizadas que produzcan efectos jurídicos
							o te afecten significativamente.
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Derecho a revocar el consentimiento:</Text>
						<Text style={styles.listItemContent}>
							Puedes retirar en cualquier momento el consentimiento otorgado para geolocalización o fotografías, sin
							afectar a la licitud del tratamiento anterior.
						</Text>
					</View>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cómo ejercer tus derechos:</Text>
					</Text>
					<Text style={styles.paragraph}>
						Envía un email a nuestro DPO indicando claramente el derecho que deseas ejercer y aportando
						copia de tu DNI/NIE para verificar tu identidad:
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>Email: dev@charlymech.com</Text>
					</TouchableOpacity>
					<Text style={styles.paragraph}>
						Responderemos a tu solicitud en el plazo máximo de 1 mes desde la recepción. Este plazo
						podrá prorrogarse 2 meses más si es necesario, teniendo en cuenta la complejidad y el
						número de solicitudes.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Derecho de reclamación:</Text> También tienes derecho a presentar
						una reclamación ante la autoridad de control competente si consideras que el tratamiento
						de tus datos vulnera el RGPD:
					</Text>
					<Text style={styles.paragraph}>
						Agencia Española de Protección de Datos (AEPD){'\n'}
						Web: www.aepd.es{'\n'}
						Teléfono: 901 100 099 / 912 663 517
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>9. Almacenamiento Local en Dispositivo</Text>
					<Text style={styles.paragraph}>
						La aplicación utiliza el almacenamiento local de tu dispositivo móvil (AsyncStorage de
						React Native) para mejorar la experiencia de usuario y permitir el funcionamiento offline.
					</Text>
					<Text style={styles.paragraph}>
						Datos almacenados localmente:{'\n'}
						• Token de autenticación JWT para mantener la sesión activa{'\n'}
						• Información básica del usuario logueado (nombre, rol){'\n'}
						• Preferencias de la aplicación{'\n'}
						• Caché temporal de datos para mejorar el rendimiento{'\n'}
						• Estado del onboarding completado
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Seguridad local:</Text> El almacenamiento local está protegido
						por el sistema operativo del dispositivo. Incluimos validación automática de integridad
						de datos y limpieza automática de datos corruptos. Puedes borrar todos los datos locales
						desinstalando la aplicación o limpiando la caché desde los ajustes del sistema operativo.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>NO utilizamos cookies de terceros</Text> con fines publicitarios
						ni de seguimiento.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>10. Transferencias Internacionales</Text>
					<Text style={styles.paragraph}>
						Todos tus datos se almacenan exclusivamente en servidores ubicados en la Unión Europea
						(infraestructura AWS Europa de Supabase), por lo que NO se realizan transferencias
						internacionales de datos fuera del Espacio Económico Europeo (EEE).
					</Text>
					<Text style={styles.paragraph}>
						En caso de que en el futuro fuera necesario realizar transferencias internacionales, se
						implementarían las garantías adecuadas mediante Cláusulas Contractuales Tipo aprobadas
						por la Comisión Europea o mecanismos equivalentes conforme al Capítulo V del RGPD.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>11. Menores de Edad</Text>
					<Text style={styles.paragraph}>
						Transia es una aplicación de uso exclusivamente profesional y laboral destinada a personas
						mayores de 18 años que mantienen una relación contractual con la empresa.
					</Text>
					<Text style={styles.paragraph}>
						NO recopilamos intencionadamente datos de menores de edad. Si detectamos que se han
						recopilado datos de un menor sin el consentimiento parental adecuado, procederemos a su
						eliminación inmediata. Si tienes conocimiento de que un menor ha proporcionado datos
						personales, contacta inmediatamente con dev@charlymech.com
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>12. Cambios en la Política</Text>
					<Text style={styles.paragraph}>
						Nos reservamos el derecho de actualizar esta Política de Privacidad para reflejar cambios
						en nuestras prácticas de tratamiento de datos, requisitos legales o mejoras en la aplicación.
					</Text>
					<Text style={styles.paragraph}>
						Te notificaremos cualquier cambio significativo mediante:{'\n'}
						• Notificación in-app al iniciar sesión{'\n'}
						• Email a tu dirección de contacto registrada{'\n'}
						• Aviso destacado en la pantalla de login
					</Text>
					<Text style={styles.paragraph}>
						La fecha de "Última actualización" en la parte superior de este documento indica cuándo
						se modificó por última vez. Te recomendamos revisar periódicamente esta política.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>13. Contacto y Consultas</Text>
					<Text style={styles.paragraph}>
						Para cualquier consulta sobre esta Política de Privacidad, ejercicio de derechos, o
						cuestiones relacionadas con el tratamiento de tus datos personales, contacta con:
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>Email DPO: dev@charlymech.com</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => Linking.openURL('https://github.com/CharlyMech')}>
						<Text style={styles.contactLink}>GitHub: github.com/CharlyMech</Text>
					</TouchableOpacity>
					<Text style={styles.paragraph}>
						Nos comprometemos a responder a todas las consultas en un plazo máximo de 72 horas
						laborables.
					</Text>
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>
						Esta política se rige por la legislación española y europea en materia de protección
						de datos personales (RGPD y LOPD).
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: lightTheme.colors.background },
	scrollContainer: { padding: spacing.lg, paddingTop: spacing.xxl + spacing.lg, paddingBottom: spacing.xl * 3 },
	pageTitle: { fontSize: typography.headlineMedium, color: lightTheme.colors.onBackground, fontWeight: "700", marginBottom: spacing.lg, textAlign: "center" },
	updateInfo: { backgroundColor: lightTheme.colors.primaryContainer, padding: spacing.sm, borderRadius: roundness.sm, marginBottom: spacing.lg },
	updateText: { fontSize: typography.bodySmall, color: lightTheme.colors.onPrimaryContainer, textAlign: "center", fontWeight: "500" },
	section: { marginBottom: spacing.xl },
	sectionTitle: { fontSize: typography.titleMedium, color: lightTheme.colors.onBackground, fontWeight: "600", marginBottom: spacing.sm },
	subsectionTitle: { fontSize: typography.titleSmall, color: lightTheme.colors.onBackground, fontWeight: "600", marginTop: spacing.sm, marginBottom: spacing.xs },
	paragraph: { fontSize: typography.bodyMedium, color: lightTheme.colors.onSurfaceVariant, lineHeight: 22, marginBottom: spacing.sm },
	bold: { fontWeight: "600", color: lightTheme.colors.onBackground },
	listItem: { fontSize: typography.bodyMedium, color: lightTheme.colors.onSurfaceVariant, lineHeight: 22, marginBottom: spacing.xs / 2, marginLeft: spacing.xs },
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
	contactLink: { fontSize: typography.bodyMedium, color: lightTheme.colors.primary, fontWeight: "500", marginBottom: spacing.xs },
	footer: { paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: lightTheme.colors.outlineVariant, marginTop: spacing.lg },
	footerText: { fontSize: typography.bodySmall, color: lightTheme.colors.onSurfaceVariant, textAlign: "center", fontStyle: "italic" },
});
