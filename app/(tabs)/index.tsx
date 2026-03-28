import { SkeletonHome } from '@/components/skeletons';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { Bell } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	const user = useAuthStore((state) => state.user);

	const reportsLoading = useReportsStore((state) => state.loading);
	const driversLoading = useDriversStore((state) => state.loading);
	const fleetLoading = useFleetStore((state) => state.loading);

	const reports = useReportsStore((state) => state.reports);
	const drivers = useDriversStore((state) => state.drivers);
	const vehicles = useFleetStore((state) => state.vehicles);

	// Show skeleton while ANY store is loading
	const isLoading = reportsLoading || driversLoading || fleetLoading;

	if (isLoading) {
		return <SkeletonHome />;
	}

	// Calculate stats
	const unreadReports = reports.filter((r) => !r.read).length;
	const activeDrivers = drivers.length;
	const activeVehicles = vehicles.length;

	return (
		<SafeAreaView style={styles.safeArea} edges={['top']}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<Text style={styles.subtitle}>Bienvenido a Transia</Text>
						<Text style={styles.title}>{user?.name} {user?.surnames}</Text>
					</View>
					<TouchableOpacity
						style={styles.notificationButton}
						onPress={() => {
							// TODO: Navigate to notifications screen
							console.log('Navigate to notifications');
						}}
					>
						<Bell
							size={24}
							color={theme.colors.onPrimary}
							strokeWidth={2}
						/>
						{unreadReports > 0 && (
							<View style={styles.notificationBadge}>
								<Text style={styles.notificationBadgeText}>
									{unreadReports > 99 ? '99+' : unreadReports}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
				{/* <View style={styles.container}>
					<View style={styles.headerSection}>
						<Text style={styles.title}>Dashboard</Text>
						<Text style={styles.subtitle}>Bienvenido a Transia</Text>
					</View>

					<Card
						backgroundColor={theme.colors.surface}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						shadow="none"
					>
						<TimeTracking />
					</Card>

					<View style={styles.statsSection}>
						<Text style={styles.sectionTitle}>Resumen</Text>

						<View style={styles.statsContainer}>
							<View style={styles.statCard}>
								<Text style={styles.statValue}>{reports.length}</Text>
								<Text style={styles.statLabel}>Total Reportes</Text>
							</View>

							<View style={styles.statCard}>
								<Text style={styles.statValue}>{unreadReports}</Text>
								<Text style={styles.statLabel}>Sin Leer</Text>
							</View>

							<View style={styles.statCard}>
								<Text style={styles.statValue}>{activeDrivers}</Text>
								<Text style={styles.statLabel}>Conductores</Text>
							</View>

							<View style={styles.statCard}>
								<Text style={styles.statValue}>{activeVehicles}</Text>
								<Text style={styles.statLabel}>Vehículos</Text>
							</View>
						</View>
					</View>
				</View> */}
			</ScrollView>
		</SafeAreaView>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: spacing.md,
		paddingTop: spacing.md,
		paddingBottom: spacing.xl,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerContent: {
		flexDirection: 'column',
		gap: spacing.xs,
		flexShrink: 1,
		marginRight: spacing.sm,
	},
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
		padding: spacing.md,
		gap: spacing.lg,
	},
	headerSection: {
		gap: spacing.xs,
	},
	title: {
		fontSize: typography.headlineMedium,
		fontWeight: '700',
		color: theme.colors.onBackground,
	},
	subtitle: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurfaceVariant,
	},
	statsSection: {
		gap: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.titleLarge,
		fontWeight: '600',
		color: theme.colors.onBackground,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: spacing.sm,
		flexWrap: 'wrap',
	},
	statCard: {
		flex: 1,
		minWidth: 100,
		backgroundColor: theme.colors.surface,
		padding: spacing.md,
		borderRadius: roundness.md,
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		gap: spacing.xs,
	},
	statValue: {
		fontSize: typography.headlineMedium,
		fontWeight: '700',
		color: theme.colors.onSurface,
	},
	statLabel: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
	},
	notificationButton: {
		position: 'relative',
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		borderRadius: roundness.sm
	},
	notificationBadge: {
		position: 'absolute',
		top: 6,
		right: 6,
		backgroundColor: theme.colors.error,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 4,
	},
	notificationBadgeText: {
		color: theme.colors.onPrimary,
		fontSize: 10,
		fontWeight: '700',
		lineHeight: 12,
	},
});