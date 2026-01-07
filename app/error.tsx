import { Card } from '@/components/Card';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { router } from 'expo-router';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ErrorScreen() {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	const handleRetry = () => {
		// Go back to login
		router.replace('/login' as any);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Card
					paddingX={spacing.xl}
					paddingY={spacing.xl}
					rounded={roundness.md}
					shadow="medium"
					backgroundColor={theme.colors.surface}
				>
					<View style={styles.iconContainer}>
						<View style={styles.iconWrapper}>
							<AlertTriangle
								size={64}
								color={theme.colors.error}
								strokeWidth={1.5}
							/>
						</View>
					</View>

					<Text style={styles.title}>Algo salió mal</Text>

					<Text style={styles.message}>
						Ha ocurrido un error inesperado al conectar con el servidor.
						Por favor, verifica tu conexión a internet e intenta de nuevo.
					</Text>

					<TouchableOpacity
						style={styles.retryButton}
						onPress={handleRetry}
						activeOpacity={0.8}
					>
						<RefreshCw size={20} color={theme.colors.onPrimary} />
						<Text style={styles.retryButtonText}>Reintentar</Text>
					</TouchableOpacity>

					<View style={styles.helperContainer}>
						<Text style={styles.helperText}>
							Si el problema persiste, contacta al administrador del sistema.
						</Text>
					</View>
				</Card>
			</View>
		</SafeAreaView>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
	},
	iconContainer: {
		alignItems: 'center',
		marginBottom: spacing.lg,
	},
	iconWrapper: {
		width: 100,
		height: 100,
		borderRadius: roundness.full,
		backgroundColor: theme.colors.errorContainer,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
		color: theme.colors.onSurface,
		textAlign: 'center',
		marginBottom: spacing.md,
	},
	message: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: spacing.xl,
	},
	retryButton: {
		flexDirection: 'row',
		backgroundColor: theme.colors.primary,
		borderRadius: roundness.sm,
		padding: spacing.md,
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		width: '100%',
	},
	retryButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onPrimary,
	},
	helperContainer: {
		marginTop: spacing.lg,
		paddingTop: spacing.md,
		borderTopWidth: 1,
		borderTopColor: theme.colors.outline,
	},
	helperText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 20,
	},
});