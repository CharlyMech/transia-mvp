import { SkeletonHome } from '@/components/skeletons';
import { lightTheme } from '@/constants/theme';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { StyleSheet, Text, View } from 'react-native';
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
	const unreadReports = reports.filter(r => !r.read).length;
	const activeDrivers = drivers.length;
	const activeVehicles = vehicles.length;

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>Dashboard</Text>
				<Text style={styles.text}>Bienvenido a Transia</Text>

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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		padding: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: lightTheme.colors.onBackground,
		marginBottom: 8,
	},
	text: {
		fontSize: 16,
		color: lightTheme.colors.onSurfaceVariant,
		marginBottom: 24,
	},
	statsContainer: {
		flexDirection: 'row',
		gap: 12,
		flexWrap: 'wrap',
	},
	statCard: {
		flex: 1,
		minWidth: 100,
		backgroundColor: lightTheme.colors.surface,
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	statValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: lightTheme.colors.onSurface,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 14,
		color: lightTheme.colors.onSurfaceVariant,
	},
});