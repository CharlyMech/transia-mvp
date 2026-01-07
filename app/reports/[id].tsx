import { Card } from '@/components/Card';
import { Carousel } from '@/components/Carousel';
import { ElevatedButton } from '@/components/ElevatedButton';
import { InfoRow } from '@/components/InfoRow';
import { LeafletMap } from '@/components/LeafletMap';
import { SkeletonDetail } from '@/components/skeletons';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { useReportsStore } from '@/stores/useReportsStore';
import { useNotesStore } from '@/stores/useNotesStore';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, SquarePen } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	Image,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ReportDetailScreen() {
	const { theme, isDark } = useAppTheme();
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();

	const currentReport = useReportsStore((state) => state.currentReport);
	const loadingReport = useReportsStore((state) => state.loadingReport);
	const reportError = useReportsStore((state) => state.reportError);
	const fetchReportById = useReportsStore((state) => state.fetchReportById);
	const clearCurrentReport = useReportsStore((state) => state.clearCurrentReport);
	const updateReport = useReportsStore((state) => state.updateReport);

	const drivers = useDriversStore((state) => state.drivers);
	const vehicles = useFleetStore((state) => state.vehicles);

	// Notes store
	const getNoteById = useNotesStore((state) => state.getNoteById);
	const [currentNote, setCurrentNote] = useState<any>(null);
	const [loadingNote, setLoadingNote] = useState(false);

	const styles = useMemo(() => getStyles(theme), [theme]);

	// Get full driver and vehicle info
	const driver = useMemo(() =>
		currentReport ? drivers.find(d => d.id === currentReport.driverId) : null,
		[drivers, currentReport]
	);

	const vehicle = useMemo(() =>
		currentReport ? vehicles.find(v => v.id === currentReport.vehicleId) : null,
		[vehicles, currentReport]
	);

	// Format driver name
	const driverFullName = useMemo(() => {
		if (driver) {
			return `${driver.name} ${driver.surnames}`.trim();
		}
		return currentReport?.driverId || 'Desconocido';
	}, [driver, currentReport]);

	// Format vehicle info
	const vehicleInfo = useMemo(() => {
		if (vehicle) {
			return `${vehicle.plateNumber} - ${vehicle.vehicleBrand} ${vehicle.vehicleModel}`;
		}
		return currentReport?.vehicleId || 'Desconocido';
	}, [vehicle, currentReport]);

	useEffect(() => {
		if (id) {
			fetchReportById(id as string);
		}
		return () => {
			clearCurrentReport();
		};
	}, [id, fetchReportById, clearCurrentReport]);

	// Fetch note when currentReport changes
	useEffect(() => {
		const fetchNote = async () => {
			if (currentReport?.noteId) {
				setLoadingNote(true);
				try {
					const note = await getNoteById(currentReport.noteId);
					setCurrentNote(note);
				} catch (error) {
					console.error('Error fetching note:', error);
					setCurrentNote(null);
				} finally {
					setLoadingNote(false);
				}
			} else {
				setCurrentNote(null);
			}
		};

		fetchNote();
	}, [currentReport?.noteId, getNoteById]);

	const handleEditPress = () => {
		if (id) {
			router.push(`/reports/edit/${id}` as any);
		}
	};

	const toggleSolvedStatus = () => {
		if (currentReport) {
			updateReport(currentReport.id, {
				active: !currentReport.active,
				closedAt: !currentReport.active ? null : new Date()
			});
		}
	};

	if (loadingReport) {
		return <SkeletonDetail />;
	}

	if (reportError) {
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Error: {reportError}</Text>
			</SafeAreaView>
		);
	}

	if (!currentReport) {
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>
					Reporte no encontrado
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle={isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
				translucent={false}
			/>
			<View style={[styles.floatingButtonsContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={theme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={theme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={() => router.back()}
				/>
				<ElevatedButton
					backgroundColor={theme.colors.primary}
					icon={SquarePen}
					iconSize={22}
					iconColor={theme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={handleEditPress}
				/>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollViewContent,
					{ paddingTop: insets.top + 60 }
				]}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.solvedStatusContainer}>
					<TouchableOpacity
						style={styles.checkboxRow}
						onPress={toggleSolvedStatus}
						activeOpacity={0.7}
					>
						<Text style={styles.checkboxLabel}>
							Resuelta
						</Text>
						<View style={[
							styles.checkbox,
							!currentReport.active && styles.checkboxChecked
						]}>
							{!currentReport.active && (
								<Text style={styles.checkmark}>✓</Text>
							)}
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.content}>
					<Text style={styles.cardTitle}>Información de la incidencia</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow='none'
						backgroundColor={theme.colors.surface}
					>
						<View style={styles.cardContent}>
							<InfoRow
								label="Fecha de creación"
								labelFlex={2}
								valueFlex={3}
								value={new Date(currentReport.createdAt).toLocaleString()}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Vehículo"
								labelFlex={2}
								valueFlex={3}
								value={vehicleInfo}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Conductor"
								labelFlex={2}
								valueFlex={3}
								value={driverFullName}
							/>
							{driver?.phone && (
								// TODO -> Link to directly call the driver
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Teléfono"
										labelFlex={2}
										valueFlex={3}
										value={driver.phone}
									/>
								</>
							)}
						</View>
					</Card>

					{/* Show note instead of description */}
					{loadingNote ? (
						<>
							<Text style={styles.cardTitle}>Nota</Text>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow='none'
								backgroundColor={theme.colors.surface}
							>
								<ActivityIndicator size="small" color={theme.colors.primary} />
							</Card>
						</>
					) : currentNote ? (
						<>
							<Text style={styles.cardTitle}>Nota</Text>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow='none'
								backgroundColor={theme.colors.surface}
							>
								<Text style={styles.descriptionText}>
									{currentNote.text}
								</Text>
								<Text style={styles.noteDate}>
									{new Date(currentNote.createdAt).toLocaleDateString('es-ES', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
									{currentNote.updatedAt && ' (editada)'}
								</Text>
							</Card>
						</>
					) : currentReport.description ? (
						<>
							<Text style={styles.cardTitle}>Descripción (legacy)</Text>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow='none'
								backgroundColor={theme.colors.surface}
							>
								<Text style={styles.descriptionText}>
									{currentReport.description}
								</Text>
							</Card>
						</>
					) : null}

					{currentReport.images && currentReport.images.length > 0 && (
						<>
							<Text style={styles.cardTitle}>Imágenes</Text>
							<Carousel
								data={currentReport.images}
								containerStyle={{ borderRadius: roundness.sm }}
								renderItem={(imageUri, index) => (
									<Image
										source={{ uri: imageUri }}
										style={styles.carouselImage}
										resizeMode="cover"
									/>
								)}
								itemWidth={SCREEN_WIDTH - spacing.md * 2}
								height={280}
								showArrows={true}
								arrowColor={theme.colors.onSurface}
								arrowSize={24}
								showCounter={true}
								onItemPress={(imageUri, index) => {
									console.log('Imagen presionada:', imageUri, 'índice:', index);
								}}
							/>
						</>
					)}

					{currentReport.location && (
						<>
							<Text style={styles.cardTitle}>Ubicación del reporte</Text>
							<LeafletMap
								location={currentReport.location}
								editable={false}
							/>
						</>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	floatingButtonsContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		zIndex: 1000,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	solvedStatusContainer: {
		width: '100%',
		padding: spacing.md,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: roundness.xs,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary,
	},
	checkmark: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	checkboxLabel: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		fontWeight: '500',
	},
	cardTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: theme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: theme.colors.outline,
		opacity: 0.5,
	},
	descriptionText: {
		fontSize: typography.bodyLarge,
		lineHeight: 24,
		color: theme.colors.onSurface,
	},
	noteDate: {
		fontSize: typography.labelSmall,
		color: theme.colors.onSurfaceVariant,
		marginTop: spacing.sm,
		fontStyle: 'italic',
	},
	carouselImage: {
		width: '100%',
		height: '100%',
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.error,
	},
});