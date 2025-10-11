import { Card } from '@/components/Card';
import { Carousel } from '@/components/Carousel';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import type { Report } from '@/models/report';
import { getReportById } from '@/services/data/mock/reports';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
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
	const [report, setReport] = useState<Report | null>(null);
	const [loading, setLoading] = useState(true);
	const [read, setRead] = useState(false);

	const toggleReadStatus = () => {
		setRead(!read);
	};

	useEffect(() => {
		if (id) {
			getReportById(id)
				.then(setReport)
				.catch(console.error)
				.finally(() => setLoading(false));
		}
	}, [id]);

	if (loading) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color={lightTheme.colors.primary} />
			</View>
		);
	}

	if (!report) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: lightTheme.colors.onBackground }}>
					Reporte no encontrado
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			{/* Manually added header bg offset */}
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
						{/* TODO -> Change from read to solved -> auto read on report detail access */}
						<Text style={styles.checkboxLabel}>
							Solventada
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
					{/* TODO -> Change IDs for vehicle plate and driver name */}
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							<InfoRow
								label="Fecha de creación"
								labelFlex={2}
								valueFlex={3}
								value={new Date(report.createdAt).toLocaleString()}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Vehículo"
								labelFlex={2}
								valueFlex={3}
								value={report.vehicleId}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Conductor"
								labelFlex={2}
								valueFlex={3}
								value={report.driverId}
							/>
						</View>
					</Card>

					{report.description && (
						<>
							<Text style={styles.cardTitle}>Descripción</Text>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.md}
								shadow='none'
								backgroundColor={lightTheme.colors.surface}
							>
								<Text style={styles.descriptionText}>
									{report.description}
								</Text>
							</Card>
						</>
					)}

					{/* Carousel de imágenes */}
					{report.images && report.images.length > 0 && (
						<>
							<Text style={styles.cardTitle}>Imágenes</Text>
							<Carousel
								data={report.images}
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

					{/* TODO: Secciones adicionales */}
					{/* - Botón para marcar como leído/no leído */}
					{/* - Imágenes adjuntas */}
					{/* - Historial de cambios */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

type InfoRowProps = {
	label: string;
	value: string;
	labelFlex?: number;
	valueFlex?: number;
};

function InfoRow({ label, value, labelFlex = 1, valueFlex = 1 }: InfoRowProps) {
	return (
		<View style={styles.infoRow}>
			<Text style={[styles.infoLabel, { flex: labelFlex }]}>{label}</Text>
			<Text style={[styles.infoValue, { flex: valueFlex }]}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
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
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
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
	headerSection: {
		paddingVertical: spacing.md,
		gap: spacing.sm,
	},
	title: {
		fontSize: typography.headlineLarge,
		fontWeight: '700',
		color: lightTheme.colors.onBackground,
	},
	statusBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: roundness.full,
		backgroundColor: lightTheme.colors.surfaceVariant,
	},
	statusText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
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
	carouselContainer: {
		marginTop: spacing.xs,
	},
	imageContainer: {
		width: '100%',
		height: '100%',
		borderRadius: roundness.md,
		overflow: 'hidden',
		backgroundColor: lightTheme.colors.surfaceVariant,
	},
	carouselImage: {
		width: '100%',
		height: '100%',
	},
	imageCounter: {
		position: 'absolute',
		top: spacing.sm,
		right: spacing.sm,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.sm,
	},
	imageCounterText: {
		color: '#fff',
		fontSize: typography.bodySmall,
		fontWeight: '600',
	},
});