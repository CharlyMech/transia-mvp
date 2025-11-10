import { Card } from '@/components/Card';
import { SkeletonHome } from '@/components/skeletons';
import { TimeTracking } from '@/components/TimeTracking';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
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
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.container}>
					<View style={styles.headerSection}>
						<Text style={styles.title}>Dashboard</Text>
						<Text style={styles.subtitle}>Bienvenido a Transia</Text>
					</View>

					<Card
						backgroundColor={lightTheme.colors.surface}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						shadow="none"
					>
						<TimeTracking />
					</Card>

					{/* TEMPORARY CONTENT */}
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
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		padding: spacing.md,
		gap: spacing.lg,
	},
	headerSection: {
		gap: spacing.xs,
	},
	title: {
		fontSize: typography.displaySmall,
		fontWeight: '700',
		color: lightTheme.colors.onBackground,
	},
	subtitle: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
	},
	statsSection: {
		gap: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.titleLarge,
		fontWeight: '600',
		color: lightTheme.colors.onBackground,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: spacing.sm,
		flexWrap: 'wrap',
	},
	statCard: {
		flex: 1,
		minWidth: 100,
		backgroundColor: lightTheme.colors.surface,
		padding: spacing.md,
		borderRadius: roundness.md,
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		gap: spacing.xs,
	},
	statValue: {
		fontSize: typography.headlineMedium,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
	},
	statLabel: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
});
