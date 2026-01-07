import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StorageCleanupTools } from '@/utils/storageCleanUpTools';
import {
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Database,
	RefreshCw,
	Search,
	Trash2,
	Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface DebugPanelProps {
	/**
	 * Callback opcional que se ejecuta después de cada operación exitosa
	 */
	onOperationComplete?: (operation: string) => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
	onOperationComplete,
}) => {
	const { theme } = useAppTheme();
	const styles = createStyles(theme);

	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleOperation = async (
		operation: () => Promise<void>,
		operationName: string,
		confirmTitle: string,
		confirmMessage: string,
		isDestructive = false
	) => {
		Alert.alert(
			confirmTitle,
			confirmMessage,
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Confirmar',
					style: isDestructive ? 'destructive' : 'default',
					onPress: async () => {
						setIsLoading(true);
						try {
							await operation();
							Alert.alert(
								'✅ Éxito',
								`${operationName} completado correctamente`
							);
							onOperationComplete?.(operationName);
						} catch (error) {
							Alert.alert(
								'❌ Error',
								`Error en ${operationName}: ${error}`
							);
						} finally {
							setIsLoading(false);
						}
					},
				},
			]
		);
	};

	const handleClearAuth = () => {
		handleOperation(
			StorageCleanupTools.clearAuthOnly,
			'Clear Auth',
			'🔄 Limpiar Autenticación',
			'Se borrarán solo los datos de autenticación. Tendrás que volver a iniciar sesión.'
		);
	};

	const handleClearAll = () => {
		handleOperation(
			StorageCleanupTools.clearAllStorage,
			'Clear All',
			'⚠️ Limpiar Todo el Storage',
			'Se borrará TODO el AsyncStorage. Esta acción no se puede deshacer.',
			true
		);
	};

	const handleNuke = () => {
		handleOperation(
			StorageCleanupTools.nukeStorage,
			'NUKE',
			'💣 Limpieza Nuclear',
			'Se realizará una limpieza agresiva elemento por elemento. Úsalo solo si otras opciones fallaron.',
			true
		);
	};

	const handleFullReset = () => {
		handleOperation(
			StorageCleanupTools.fullReset,
			'Full Reset',
			'🔄 Reset Completo',
			'Se limpiará todo el storage y se reinicializará con datos limpios. Recomendado para problemas persistentes.'
		);
	};

	const handleDiagnose = async () => {
		setIsLoading(true);
		try {
			const diag = await StorageCleanupTools.diagnose();
			const tokenInfo = await StorageCleanupTools.checkTokenExpiration();

			const tokenStatus = tokenInfo.hasToken
				? tokenInfo.isExpired
					? '❌ Expirado'
					: '✅ Válido'
				: '⚠️ No encontrado';

			Alert.alert(
				'🔍 Diagnóstico del Sistema',
				`📊 Estado del Storage:\n` +
				`• Keys almacenadas: ${diag.totalKeys}\n\n` +
				`🔐 Estado del Token:\n` +
				`• Token: ${tokenStatus}\n` +
				`• Expira: ${tokenInfo.expiresAt || 'N/A'}\n` +
				`• Tiempo restante: ${tokenInfo.timeRemaining || 'N/A'}\n\n` +
				`💡 Ver consola para detalles completos`,
				[{ text: 'Entendido', style: 'default' }]
			);
		} catch (error) {
			Alert.alert(
				'❌ Error en Diagnóstico',
				`No se pudo completar el diagnóstico: ${error}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={[
					styles.toggleButton,
					isExpanded && styles.toggleButtonExpanded,
				]}
				onPress={() => setIsExpanded(!isExpanded)}
				disabled={isLoading}
				activeOpacity={0.7}
			>
				<View style={styles.toggleContent}>
					<View style={styles.toggleLeft}>
						<Database size={18} color={theme.colors.error} />
						<Text style={styles.toggleTitle}>Herramientas de Debug</Text>
					</View>
					{isExpanded ? (
						<ChevronUp size={20} color={theme.colors.error} />
					) : (
						<ChevronDown size={20} color={theme.colors.error} />
					)}
				</View>
			</TouchableOpacity>

			{isExpanded && (
				<View style={styles.panel}>
					{/* Header del Panel */}
					<View style={styles.panelHeader}>
						<AlertCircle
							size={20}
							color={theme.colors.error}
						/>
						<Text style={styles.panelTitle}>
							Herramientas de Limpieza
						</Text>
					</View>

					<Text style={styles.panelDescription}>
						Usa estas herramientas para solucionar problemas de autenticación
						en Android. Prueba en orden de menos a más agresivo.
					</Text>

					{/* Botones de Acción */}
					<View style={styles.buttonsGrid}>
						{/* Nivel 1: Clear Auth */}
						<TouchableOpacity
							style={[styles.actionButton, styles.buttonLevel1]}
							onPress={handleClearAuth}
							disabled={isLoading}
							activeOpacity={0.8}
						>
							<View style={styles.buttonContent}>
								<RefreshCw
									size={20}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<View style={styles.buttonTextContainer}>
									<Text style={styles.buttonTitle}>Clear Auth</Text>
									<Text style={styles.buttonSubtitle}>Nivel 1 · Suave</Text>
								</View>
							</View>
						</TouchableOpacity>

						{/* Nivel 2: Clear All */}
						<TouchableOpacity
							style={[styles.actionButton, styles.buttonLevel2]}
							onPress={handleClearAll}
							disabled={isLoading}
							activeOpacity={0.8}
						>
							<View style={styles.buttonContent}>
								<Trash2
									size={20}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<View style={styles.buttonTextContainer}>
									<Text style={styles.buttonTitle}>Clear All</Text>
									<Text style={styles.buttonSubtitle}>Nivel 2 · Medio</Text>
								</View>
							</View>
						</TouchableOpacity>

						{/* Nivel 3: NUKE */}
						<TouchableOpacity
							style={[styles.actionButton, styles.buttonLevel3]}
							onPress={handleNuke}
							disabled={isLoading}
							activeOpacity={0.8}
						>
							<View style={styles.buttonContent}>
								<Zap
									size={20}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<View style={styles.buttonTextContainer}>
									<Text style={styles.buttonTitle}>💣 NUKE</Text>
									<Text style={styles.buttonSubtitle}>Nivel 3 · Agresivo</Text>
								</View>
							</View>
						</TouchableOpacity>

						{/* Nivel 4: Full Reset */}
						<TouchableOpacity
							style={[styles.actionButton, styles.buttonLevel4]}
							onPress={handleFullReset}
							disabled={isLoading}
							activeOpacity={0.8}
						>
							<View style={styles.buttonContent}>
								<RefreshCw
									size={20}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<View style={styles.buttonTextContainer}>
									<Text style={styles.buttonTitle}>Full Reset</Text>
									<Text style={styles.buttonSubtitle}>Nivel 4 · Completo</Text>
								</View>
							</View>
						</TouchableOpacity>

						{/* Diagnóstico */}
						<TouchableOpacity
							style={[styles.actionButton, styles.buttonDiagnose]}
							onPress={handleDiagnose}
							disabled={isLoading}
							activeOpacity={0.8}
						>
							<View style={styles.buttonContent}>
								<Search
									size={20}
									color="#fff"
									style={styles.buttonIcon}
								/>
								<View style={styles.buttonTextContainer}>
									<Text style={styles.buttonTitle}>Diagnose</Text>
									<Text style={styles.buttonSubtitle}>Ver estado</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>

					{/* Footer con ayuda */}
					<View style={styles.helpContainer}>
						<View style={styles.helpIconContainer}>
							<AlertCircle size={16} color="#6b7280" />
						</View>
						<Text style={styles.helpText}>
							Si no puedes hacer login, prueba en orden:{' '}
							<Text style={styles.helpTextBold}>
								Clear Auth → Full Reset → NUKE
							</Text>
						</Text>
					</View>

					{/* Loading Overlay */}
					{isLoading && (
						<View style={styles.loadingOverlay}>
							<ActivityIndicator
								size="small"
								color={theme.colors.primary}
							/>
							<Text style={styles.loadingText}>Procesando...</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const createStyles = (theme: any) => StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	toggleButton: {
		backgroundColor: '#fee2e2',
		borderWidth: 1.5,
		borderColor: '#fca5a5',
		borderRadius: roundness.sm,
		paddingVertical: spacing.sm + 2,
		paddingHorizontal: spacing.md,
		shadowColor: '#dc2626',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	toggleButtonExpanded: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderBottomWidth: 0,
	},
	toggleContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	toggleLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	toggleTitle: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: '#dc2626',
	},
	panel: {
		backgroundColor: '#fff',
		borderWidth: 1.5,
		borderColor: '#fca5a5',
		borderTopWidth: 0,
		borderBottomLeftRadius: roundness.sm,
		borderBottomRightRadius: roundness.sm,
		padding: spacing.md,
		shadowColor: '#dc2626',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 3,
	},
	panelHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	panelTitle: {
		fontSize: typography.titleSmall,
		fontWeight: '700',
		color: '#1f2937',
	},
	panelDescription: {
		fontSize: typography.bodySmall,
		color: '#6b7280',
		lineHeight: 18,
		marginBottom: spacing.md,
	},
	buttonsGrid: {
		gap: spacing.sm,
	},
	actionButton: {
		borderRadius: roundness.xs,
		paddingVertical: spacing.sm + 2,
		paddingHorizontal: spacing.md,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	buttonIcon: {
		marginRight: spacing.xs,
	},
	buttonTextContainer: {
		flex: 1,
	},
	buttonTitle: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: '#fff',
		marginBottom: 2,
	},
	buttonSubtitle: {
		fontSize: typography.labelSmall,
		color: 'rgba(255, 255, 255, 0.8)',
		fontWeight: '500',
	},
	buttonLevel1: {
		backgroundColor: '#3b82f6',
	},
	buttonLevel2: {
		backgroundColor: '#f59e0b',
	},
	buttonLevel3: {
		backgroundColor: '#ef4444',
	},
	buttonLevel4: {
		backgroundColor: '#8b5cf6',
	},
	buttonDiagnose: {
		backgroundColor: '#10b981',
	},
	helpContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.xs,
		marginTop: spacing.md,
		padding: spacing.sm,
		backgroundColor: '#f9fafb',
		borderRadius: roundness.xs,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	helpIconContainer: {
		marginTop: 2,
	},
	helpText: {
		flex: 1,
		fontSize: typography.labelSmall,
		color: '#6b7280',
		lineHeight: 16,
	},
	helpTextBold: {
		fontWeight: '600',
		color: '#374151',
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		borderRadius: roundness.sm,
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	loadingText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurface,
		fontWeight: '500',
	},
});