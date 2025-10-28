import { Card } from '@/components/Card';
import { Carousel } from '@/components/Carousel';
import { InfoRow } from '@/components/InfoRow';
import { ReportMap } from '@/components/ReportMap';
import { SkeletonDetail } from '@/components/skeletons';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useReportsStore } from '@/stores/useReportsStore';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ReportDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const currentReport = useReportsStore((state) => state.currentReport);
	const loadingReport = useReportsStore((state) => state.loadingReport);
	const reportError = useReportsStore((state) => state.reportError);
	const fetchReportById = useReportsStore((state) => state.fetchReportById);
	const clearCurrentReport = useReportsStore((state) => state.clearCurrentReport);

	const [read, setRead] = useState(false);

	useEffect(() => {
		if (id) {
			fetchReportById(id as string);
		}
		// Clean up
		return () => {
			clearCurrentReport();
		};
	}, [id, fetchReportById, clearCurrentReport]);

	useEffect(() => {
		if (currentReport) {
			setRead(currentReport.read);
		}
	}, [currentReport]);

	const toggleReadStatus = () => {
		setRead(!read);
		// TODO: Update report in store
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
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={{ width: '100%', height: 30, backgroundColor: lightTheme.colors.background }} />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.solvedStatusContainer}>
					<TouchableOpacity
						style={styles.checkboxRow}
						onPress={toggleReadStatus}
						activeOpacity={0.7}
					>
						<Text style={styles.checkboxLabel}>
							Resuelta
						</Text>
						<View style={[
							styles.checkbox,
							read && styles.checkboxChecked
						]}>
							{read && (
								<Text style={styles.checkmark}>✓</Text>
							)}
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.content}>
					<Text style={styles.cardTitle}>Información de la incicencia</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
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
								value={currentReport.vehicleId}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Conductor"
								labelFlex={2}
								valueFlex={3}
								value={currentReport.driverId}
							/>
						</View>
					</Card>

					{currentReport.description && (
						<>
							<Text style={styles.cardTitle}>Descripción</Text>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow='none'
								backgroundColor={lightTheme.colors.surface}
							>
								<Text style={styles.descriptionText}>
									{currentReport.description}
								</Text>
							</Card>
						</>
					)}

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
								arrowColor={lightTheme.colors.onSurface}
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
							<ReportMap
								location={currentReport.location}
								compact={true}
								showExpandButton={true}
								height={320}
								containerStyle={{ borderRadius: roundness.sm, overflow: 'hidden' }}
							/>
						</>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
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
		borderColor: lightTheme.colors.primary,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: lightTheme.colors.primary,
		borderColor: lightTheme.colors.primary,
	},
	checkmark: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	checkboxLabel: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	cardTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: lightTheme.colors.outline,
		opacity: 0.5,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: spacing.xs,
	},
	infoLabel: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	infoValue: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: lightTheme.colors.onSurface,
		textAlign: 'right',
	},
	descriptionText: {
		fontSize: typography.bodyLarge,
		lineHeight: 24,
		color: lightTheme.colors.onSurface,
	},
	carouselImage: {
		width: '100%',
		height: '100%',
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
	},
	mapWrapper: {
		marginHorizontal: spacing.md,
		marginBottom: spacing.md,
		borderRadius: roundness.sm,
		overflow: 'hidden',
		// Opcional: añadir sombra como el carrusel si lo deseas
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
});