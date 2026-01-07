import { spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
	onFinish: () => void;
	duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	useEffect(() => {
		const timer = setTimeout(() => {
			onFinish();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onFinish]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Image
						source={require('@/assets/images/splash-icon.png')}
						style={styles.logo}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.textContainer}>
					<Text style={styles.appName}>Transia</Text>
					<Text style={styles.tagline}>Gestión de flota de vehículos</Text>
				</View>

				<View style={styles.loaderContainer}>
					<ActivityIndicator
						size="large"
						color={theme.colors.primary}
					/>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={styles.footerText}>
					© 2025 Transia MVP
				</Text>
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
		paddingHorizontal: spacing.xl,
	},
	logoContainer: {
		marginBottom: spacing.xl,
	},
	logo: {
		width: 200,
		height: 200,
	},
	textContainer: {
		alignItems: 'center',
		gap: spacing.sm,
		marginBottom: spacing.xxxl,
	},
	appName: {
		fontSize: typography.displayLarge,
		fontWeight: '700',
		color: theme.colors.primary,
	},
	tagline: {
		fontSize: typography.titleMedium,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	loaderContainer: {
		marginTop: spacing.xl,
	},
	footer: {
		paddingBottom: spacing.xl,
		alignItems: 'center',
	},
	footerText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
	},
});