import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
	const handleEmailPress = () => Linking.openURL('mailto:dev@charlymech.com');

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				<Text style={styles.pageTitle}>Términos y Condiciones</Text>
				<View style={styles.updateInfo}>
					<Text style={styles.updateText}>Última actualización: Diciembre 2024</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
					<Text style={styles.paragraph}>
						Al descargar, instalar o utilizar Transia ("la Aplicación"), aceptas estos Términos y
						Condiciones en su totalidad. Si no estás de acuerdo con alguna parte de estos términos,
						no utilices la Aplicación.
					</Text>
					<Text style={styles.paragraph}>
						Este es un acuerdo legal vinculante entre tú (el "Usuario") y Carlos Sánchez Recio -
						Transia MVP ("Transia", "nosotros"). El uso continuado de la aplicación constituye tu
						aceptación de estos términos y cualquier actualización futura.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>2. Definiciones</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Aplicación:</Text> Software móvil Transia disponible para iOS y Android</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Usuario:</Text> Cualquier persona física que utiliza la aplicación</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Conductor:</Text> Usuario con rol básico de conductor de vehículos</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Gestor:</Text> Usuario con permisos de supervisión y gestión de equipos</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Administrador:</Text> Usuario con acceso completo al sistema y configuración</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Empresa:</Text> Entidad legal que contrata el uso de Transia para su operativa</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Flota:</Text> Conjunto de vehículos gestionados en la aplicación</Text>
					<Text style={styles.listItem}>• <Text style={styles.bold}>Control horario:</Text> Sistema de registro de jornadas laborales según RD-ley 8/2019</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>3. Descripción del Servicio</Text>
					<Text style={styles.paragraph}>
						Transia es una plataforma integral de gestión de flotas de transporte y control horario
						de personal que ofrece las siguientes funcionalidades principales:
					</Text>
					<Text style={styles.listItem}>• Registro completo de jornadas laborales con inicio, pausa, reanudación y finalización</Text>
					<Text style={styles.listItem}>• Cálculo automático de horas trabajadas y comparación con objetivo diario</Text>
					<Text style={styles.listItem}>• Histórico mensual y anual de registros horarios</Text>
					<Text style={styles.listItem}>• Gestión completa de perfiles de conductores con validación de DNI/NIE</Text>
					<Text style={styles.listItem}>• Control de inventario de vehículos con 6 tipos soportados (camiones y furgonetas)</Text>
					<Text style={styles.listItem}>• Gestión de estados de vehículos: Activo, Inactivo, En mantenimiento, Averiado</Text>
					<Text style={styles.listItem}>• Sistema de reportes e incidencias con 5 tipos: Accidente, Mantenimiento, Revisión, ITV, Otro</Text>
					<Text style={styles.listItem}>• Adjuntar múltiples fotografías a reportes desde cámara o galería</Text>
					<Text style={styles.listItem}>• Geolocalización GPS opcional en reportes (puntual, no continua)</Text>
					<Text style={styles.listItem}>• Historial de mantenimientos e ITVs de vehículos</Text>
					<Text style={styles.listItem}>• Asignación de vehículos a conductores con control de kilometraje</Text>
					<Text style={styles.listItem}>• Control de acceso diferenciado por tres niveles de roles</Text>
					<Text style={styles.listItem}>• Búsqueda avanzada y filtrado de conductores, vehículos y reportes</Text>
					<Text style={styles.listItem}>• Análisis y estadísticas de actividad operativa</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>4. Elegibilidad y Registro</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Requisitos de elegibilidad:</Text>
					</Text>
					<Text style={styles.listItem}>• Ser mayor de 18 años</Text>
					<Text style={styles.listItem}>• Tener capacidad legal para celebrar contratos vinculantes</Text>
					<Text style={styles.listItem}>• Contar con autorización expresa de tu empresa empleadora</Text>
					<Text style={styles.listItem}>• Proporcionar información veraz, exacta y actualizada</Text>
					<Text style={styles.listItem}>• Poseer un dispositivo compatible (iOS o Android)</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Seguridad de las credenciales:</Text> Eres el único responsable
						de mantener la confidencialidad de tus credenciales de acceso (email/teléfono y contraseña).
						Todas las actividades realizadas con tu cuenta se considerarán realizadas por ti. Debes
						notificar inmediatamente cualquier uso no autorizado de tu cuenta. NO compartas tus
						credenciales con terceros bajo ninguna circunstancia.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Autenticación:</Text> El acceso a la aplicación requiere
						autenticación mediante email o número de teléfono español válido y contraseña de mínimo
						6 caracteres. La sesión se mantiene mediante token JWT con fecha de expiración.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>5. Uso Aceptable de la Aplicación</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Usos permitidos:</Text>
					</Text>
					<Text style={styles.listItem}>• Utilizar la aplicación exclusivamente para fines profesionales y laborales previstos</Text>
					<Text style={styles.listItem}>• Registrar información veraz y precisa en control horario y reportes</Text>
					<Text style={styles.listItem}>• Mantener tu perfil de usuario actualizado con datos correctos</Text>
					<Text style={styles.listItem}>• Crear reportes honestos y documentados sobre incidencias reales</Text>
					<Text style={styles.listItem}>• Respetar los niveles de acceso establecidos para tu rol</Text>

					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Usos estrictamente prohibidos:</Text>
					</Text>
					<Text style={styles.listItem}>• Realizar actividades ilegales o no autorizadas mediante la aplicación</Text>
					<Text style={styles.listItem}>• Registrar información falsa, inexacta o manipular datos de control horario</Text>
					<Text style={styles.listItem}>• Intentar acceder a áreas restringidas, cuentas de otros usuarios o funcionalidades no autorizadas</Text>
					<Text style={styles.listItem}>• Realizar ingeniería inversa, descompilación o desensamblado del código</Text>
					<Text style={styles.listItem}>• Utilizar bots, scripts, automatizaciones o herramientas no autorizadas</Text>
					<Text style={styles.listItem}>• Interferir con el funcionamiento normal de la aplicación o sus servidores</Text>
					<Text style={styles.listItem}>• Transmitir malware, virus, código malicioso o contenido dañino</Text>
					<Text style={styles.listItem}>• Realizar scraping, crawling o extracción masiva de datos</Text>
					<Text style={styles.listItem}>• Compartir tus credenciales de acceso con terceros</Text>
					<Text style={styles.listItem}>• Acosar, amenazar, difamar o perjudicar a otros usuarios</Text>
					<Text style={styles.listItem}>• Utilizar la aplicación para fines distintos a la gestión de flotas y control horario</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>6. Funcionalidades por Rol de Usuario</Text>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>Conductor (rol básico):</Text>
						<Text style={styles.listItemContent}>
							• Registro de su propio control horario: iniciar, pausar, reanudar y finalizar jornada{'\n'}
							• Visualización de su histórico completo de horas trabajadas (mensual y anual){'\n'}
							• Creación de reportes e incidencias con fotografías y geolocalización opcional{'\n'}
							• Actualización de información personal básica (foto, contacto){'\n'}
							• Consulta del vehículo actualmente asignado{'\n'}
							• Agregar notas explicativas a registros horarios
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>Gestor (rol de supervisión):</Text>
						<Text style={styles.listItemContent}>
							• Todas las funcionalidades del rol Conductor{'\n'}
							• Visualización y gestión de conductores asignados a su cargo{'\n'}
							• Acceso a reportes e incidencias de su equipo{'\n'}
							• Cambio de estado operativo de conductores (Activo, Inactivo, Baja, Vacaciones){'\n'}
							• Consulta de estadísticas y métricas del equipo{'\n'}
							• Marcar reportes como leídos o resueltos
						</Text>
					</View>

					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>Administrador (acceso completo):</Text>
						<Text style={styles.listItemContent}>
							• Todas las funcionalidades de Conductor y Gestor{'\n'}
							• Gestión completa de usuarios: crear, modificar, eliminar, asignar roles{'\n'}
							• Configuración y gestión completa de la flota de vehículos{'\n'}
							• Acceso a todos los datos, reportes y estadísticas del sistema{'\n'}
							• Gestión de mantenimientos e ITVs de vehículos{'\n'}
							• Asignación y reasignación de vehículos a conductores{'\n'}
							• Configuración general del sistema y parámetros{'\n'}
							• Eliminación de registros (sujeto a obligaciones legales)
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>7. Control Horario y Registros de Jornada</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Exactitud y veracidad:</Text> Te comprometes a registrar tus
						horas de trabajo de forma precisa, honesta y en tiempo real. Los registros manipulados,
						falsos o inexactos pueden resultar en acciones disciplinarias por parte de tu empleador,
						además de constituir una violación de estos términos.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Funcionamiento del sistema:</Text> El control horario permite
						registrar múltiples rangos horarios por día (para gestionar pausas de comida, descansos).
						Cada jornada puede tener inicio, pausas, reanudaciones y finalización. El sistema calcula
						automáticamente las horas totales trabajadas y las compara con el objetivo diario de 8
						horas (480 minutos).
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Cierre automático de jornadas:</Text> La aplicación cierra
						automáticamente las jornadas abiertas no finalizadas a las 23:59:59 del mismo día. Este
						cierre automático es una medida de seguridad y NO debe interpretarse como tiempo trabajado
						real si no corresponde con tu jornada efectiva. Eres responsable de finalizar manualmente
						tu jornada al terminar de trabajar.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Modificaciones y edición:</Text> Los cambios a registros
						históricos pueden requerir aprobación de tu supervisor o administrador según las políticas
						de tu empresa. Todos los cambios quedan registrados en logs de auditoría con fecha, hora
						y usuario que realizó la modificación.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Valor legal probatorio:</Text> Los registros de jornada generados
						tienen valor probatorio según el Real Decreto-ley 8/2019 y legislación laboral vigente en
						España. Pueden ser utilizados en inspecciones de trabajo, procedimientos judiciales y
						trámites administrativos.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>8. Geolocalización y Privacidad de Ubicación</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Uso limitado de GPS:</Text> La aplicación puede solicitar acceso
						a tu ubicación GPS exclusivamente para geolocalizar reportes e incidencias, vinculando
						eventos con ubicaciones geográficas específicas donde ocurrieron.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Consentimiento explícito requerido:</Text> La captura de ubicación
						requiere tu consentimiento explícito en cada uso. Al crear un reporte, puedes activar o
						desactivar la geolocalización mediante un toggle. Puedes revocar el permiso de ubicación
						en cualquier momento desde la configuración del dispositivo.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>NO hay tracking continuo:</Text> La aplicación NO rastrea tu
						ubicación de forma continua ni en segundo plano. NO mantiene un historial de tus movimientos.
						Solo accede a GPS en el momento exacto en que creas manualmente un reporte específico y
						has activado la opción de geolocalización.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Datos GPS capturados:</Text> Cuando autorizas la geolocalización
						en un reporte, se capturan: latitud, longitud, altitud (opcional), precisión del GPS y
						dirección postal obtenida mediante geocoding reverso. Estos datos quedan vinculados
						únicamente a ese reporte específico.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>9. Contenido Generado por el Usuario</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Propiedad del contenido:</Text> Mantienes todos los derechos
						de propiedad sobre el contenido que generas (notas, descripciones de reportes, fotografías).
						Al usar la aplicación, nos otorgas una licencia limitada, no exclusiva, revocable y gratuita
						para procesar, almacenar y mostrar ese contenido conforme a la funcionalidad del servicio.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Responsabilidad del contenido:</Text> Eres el único responsable
						del contenido que publicas o compartes en la aplicación. Garantizas que tienes todos los
						derechos necesarios para publicar ese contenido.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Contenido prohibido. NO publiques:</Text>
					</Text>
					<Text style={styles.listItem}>• Contenido ilegal, difamatorio, obsceno o que infrinja derechos de terceros</Text>
					<Text style={styles.listItem}>• Información confidencial de la empresa sin autorización expresa</Text>
					<Text style={styles.listItem}>• Contenido que infrinja derechos de propiedad intelectual o industrial</Text>
					<Text style={styles.listItem}>• Contenido que incite al odio, violencia o discriminación</Text>
					<Text style={styles.listItem}>• Datos personales sensibles de terceros sin su consentimiento</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Moderación y eliminación:</Text> Nos reservamos el derecho de
						revisar, editar o eliminar contenido que viole estos términos, sin previo aviso, aunque
						no tenemos obligación de monitorizar todo el contenido.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>10. Propiedad Intelectual</Text>
					<Text style={styles.paragraph}>
						La Aplicación, su diseño, código fuente, estructura, funcionalidades, interfaces de usuario,
						gráficos, logotipos y documentación son propiedad exclusiva de Transia y están protegidos
						por leyes de propiedad intelectual españolas, europeas e internacionales.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Licencia de uso limitada:</Text> Te otorgamos una licencia
						limitada, no exclusiva, no transferible, no sublicenciable y revocable para usar la
						aplicación conforme a estos términos, exclusivamente para tus actividades laborales
						autorizadas.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Restricciones absolutas. NO puedes:</Text>
					</Text>
					<Text style={styles.listItem}>• Copiar, reproducir o duplicar la aplicación o partes de ella</Text>
					<Text style={styles.listItem}>• Modificar, adaptar, traducir o crear obras derivadas</Text>
					<Text style={styles.listItem}>• Distribuir, sublicenciar, vender, alquilar o prestar la aplicación</Text>
					<Text style={styles.listItem}>• Realizar ingeniería inversa, descompilación o desensamblado del código</Text>
					<Text style={styles.listItem}>• Eliminar, ocultar o alterar marcas de copyright, marcas registradas o avisos legales</Text>
					<Text style={styles.listItem}>• Utilizar la aplicación para desarrollar productos competidores</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>11. Disponibilidad del Servicio</Text>
					<Text style={styles.paragraph}>
						Nos esforzamos por mantener la aplicación disponible 24 horas al día, 7 días a la semana,
						pero NO garantizamos acceso ininterrumpido ni libre de errores. Podemos suspender
						temporalmente el servicio para realizar mantenimientos programados, actualizaciones de
						seguridad, mejoras técnicas o reparaciones de emergencia.
					</Text>
					<Text style={styles.paragraph}>
						Nos reservamos el derecho de modificar, suspender o discontinuar cualquier funcionalidad
						de la aplicación, temporal o permanentemente, con o sin previo aviso. No seremos responsables
						ante ti ni ante terceros por modificaciones, suspensiones o discontinuaciones del servicio.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>12. Limitación de Responsabilidad</Text>
					<Text style={styles.paragraph}>
						Utilizas la aplicación bajo tu propio riesgo. La proporcionamos "tal cual" (AS IS) y
						"según disponibilidad" (AS AVAILABLE), sin garantías de ningún tipo, expresas o implícitas.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Renuncias de garantías:</Text> No garantizamos que la aplicación:
						sea ininterrumpida, oportuna, segura o libre de errores; que los resultados sean exactos
						o confiables; que los defectos serán corregidos; que cumpla todos tus requisitos específicos.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Exclusión de responsabilidad:</Text> En la máxima medida permitida
						por la ley aplicable, NO seremos responsables de:
					</Text>
					<Text style={styles.listItem}>• Daños indirectos, incidentales, especiales, consecuentes o punitivos</Text>
					<Text style={styles.listItem}>• Pérdida de datos, beneficios, ingresos, oportunidades de negocio o ahorros esperados</Text>
					<Text style={styles.listItem}>• Interrupciones del servicio o tiempo de inactividad</Text>
					<Text style={styles.listItem}>• Errores en el contenido, información inexacta o decisiones basadas en ella</Text>
					<Text style={styles.listItem}>• Acciones u omisiones de terceros (proveedores, otros usuarios)</Text>
					<Text style={styles.listItem}>• Uso no autorizado de tu cuenta por terceros</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Límite máximo de responsabilidad:</Text> Nuestra responsabilidad
						total agregada hacia ti por todas las reclamaciones derivadas del uso de la aplicación no
						excederá el importe total pagado por tu empresa a Transia en los 12 meses anteriores a la
						reclamación (o 100 euros si no se han realizado pagos).
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>13. Indemnización</Text>
					<Text style={styles.paragraph}>
						Aceptas indemnizar, defender y mantener indemne a Transia, sus desarrolladores, directores,
						empleados, agentes y proveedores de cualquier reclamación, demanda, daño, pérdida, coste,
						gasto (incluidos honorarios razonables de abogados) derivados de o relacionados con:
					</Text>
					<Text style={styles.listItem}>• Tu uso o mal uso de la aplicación</Text>
					<Text style={styles.listItem}>• Tu violación de estos Términos y Condiciones</Text>
					<Text style={styles.listItem}>• Tu violación de derechos de terceros, incluidos derechos de propiedad intelectual</Text>
					<Text style={styles.listItem}>• El contenido que publicas o compartes (notas, reportes, fotografías)</Text>
					<Text style={styles.listItem}>• Tus acciones u omisiones que causen daños a otros usuarios o terceros</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>14. Terminación del Servicio</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Terminación por tu parte:</Text> Puedes dejar de usar la
						aplicación en cualquier momento. Para desactivar completamente tu cuenta, contacta con
						el administrador de tu empresa o con dev@charlymech.com
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Terminación por nuestra parte. Podemos suspender o terminar
						tu acceso si:</Text>
					</Text>
					<Text style={styles.listItem}>• Violas estos Términos y Condiciones o la Política de Privacidad</Text>
					<Text style={styles.listItem}>• Detectamos actividad fraudulenta, abusiva o ilegal</Text>
					<Text style={styles.listItem}>• Tu empresa cancela el servicio o finaliza tu relación laboral</Text>
					<Text style={styles.listItem}>• Lo requiere la ley, autoridades o una orden judicial</Text>
					<Text style={styles.listItem}>• Existe sospecha razonable de que tu cuenta ha sido comprometida</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Efectos de la terminación:</Text>
					</Text>
					<Text style={styles.listItem}>• Pierdes inmediatamente todo acceso a la aplicación y tus datos</Text>
					<Text style={styles.listItem}>• Tus datos pueden conservarse según obligaciones legales (mínimo 4 años para datos laborales)</Text>
					<Text style={styles.listItem}>• Las cláusulas que por su naturaleza deben sobrevivir (propiedad intelectual, limitación de responsabilidad, indemnización) continúan vigentes tras la terminación</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>15. Modificaciones de los Términos</Text>
					<Text style={styles.paragraph}>
						Nos reservamos el derecho de modificar, actualizar o reemplazar estos Términos y Condiciones
						en cualquier momento para reflejar cambios en la aplicación, requisitos legales o mejoras
						en el servicio.
					</Text>
					<Text style={styles.paragraph}>
						<Text style={styles.bold}>Notificación de cambios significativos mediante:</Text>
					</Text>
					<Text style={styles.listItem}>• Notificación destacada dentro de la aplicación al iniciar sesión</Text>
					<Text style={styles.listItem}>• Email a tu dirección de contacto registrada</Text>
					<Text style={styles.listItem}>• Aviso en la pantalla de login antes de acceder</Text>
					<Text style={styles.paragraph}>
						El uso continuado de la aplicación después de la publicación de cambios constituye tu
						aceptación de los nuevos términos. Si no aceptas los cambios, debes dejar de usar la
						aplicación inmediatamente. Es tu responsabilidad revisar periódicamente estos términos.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>16. Ley Aplicable y Jurisdicción</Text>
					<Text style={styles.paragraph}>
						Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de España,
						sin dar efecto a sus disposiciones sobre conflicto de leyes.
					</Text>
					<Text style={styles.paragraph}>
						Cualquier disputa, controversia o reclamación derivada de o relacionada con estos términos
						o el uso de la aplicación se someterá a la jurisdicción exclusiva de los tribunales de
						Madrid, España, sin perjuicio de las normas imperativas de protección al consumidor que
						pudieran resultar aplicables.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>17. Disposiciones Generales</Text>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Acuerdo completo:</Text>
						<Text style={styles.listItemContent}>
							Estos Términos y Condiciones, junto con la Política de Privacidad, constituyen el acuerdo completo entre tú y Transia respecto al uso de la aplicación
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Divisibilidad:</Text>
						<Text style={styles.listItemContent}>
							Si una cláusula es declarada inválida o inaplicable por un tribunal competente, el resto de términos permanecerán en pleno vigor y efecto
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Renuncia:</Text>
						<Text style={styles.listItemContent}>
							El no ejercicio o ejecución de cualquier derecho o disposición no constituye una renuncia a dicho derecho
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Cesión:</Text>
						<Text style={styles.listItemContent}>
							No puedes ceder, transferir o sublicenciar tus derechos u obligaciones bajo estos términos sin nuestro consentimiento previo por escrito. Nosotros podemos ceder libremente estos términos
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Fuerza mayor:</Text>
						<Text style={styles.listItemContent}>
							No seremos responsables por retrasos o incumplimientos debidos a causas fuera de nuestro control razonable (desastres naturales, guerras, ciberataques, fallos de infraestructura de terceros)
						</Text>
					</View>
					<View style={styles.listItemContainer}>
						<Text style={styles.listItemTitle}>• Idioma:</Text>
						<Text style={styles.listItemContent}>
							Estos términos se redactan en español. Cualquier traducción es solo para conveniencia. En caso de conflicto, prevalecerá la versión en español
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>18. Contacto y Soporte</Text>
					<Text style={styles.paragraph}>
						Para consultas, dudas o cuestiones relacionadas con estos Términos y Condiciones, o
						para reportar violaciones, contacta con:
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>Email: dev@charlymech.com</Text>
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
						Al continuar usando Transia, confirmas que has leído, entendido y aceptado íntegramente
						estos Términos y Condiciones, así como la Política de Privacidad.
					</Text>
					<Text style={styles.footerText}>
						© 2024-2025 Transia MVP - Carlos Sánchez Recio (CharlyMech)
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
	footerText: { fontSize: typography.bodySmall, color: lightTheme.colors.onSurfaceVariant, textAlign: "center", marginBottom: spacing.xs / 2 },
});
