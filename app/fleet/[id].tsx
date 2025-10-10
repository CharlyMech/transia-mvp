import { Card } from '@/components/Card';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { StatusBadge } from '@/components/StatusBadge';
import { VehicleStatus } from '@/constants/enums/VehicleStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { Vehicle } from '@/models/vehicle';
import { getVehicleById } from '@/services/data/mock/fleet';
import { formatISODate } from '@/utils/dateUtils';
import { useLocalSearchParams } from 'expo-router';
import { ExternalLink, Truck } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Pressable,
	StatusBar,
	StyleSheet,
	Text,
	View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 250;
const SCROLL_DISTANCE = 200;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 44;

export default function VehicleDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [vehicle, setVehicle] = useState<Vehicle | null>(null);
	const [loading, setLoading] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (id) {
			getVehicleById(id)
				.then(setVehicle)
				.catch(console.error)
				.finally(() => setLoading(false));
		}
	}, [id]);

	const headerHeight = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [HEADER_HEIGHT + STATUS_BAR_HEIGHT, STATUS_BAR_HEIGHT],
		extrapolate: 'clamp',
	});

	const imageScale = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.7, SCROLL_DISTANCE],
		outputRange: [1, 0.3, 0],
		extrapolate: 'clamp',
	});

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.8, SCROLL_DISTANCE],
		outputRange: [1, 0.3, 0],
		extrapolate: 'clamp',
	});

	const overlayOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.8],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	const contentPaddingTop = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [spacing.md, 0],
		extrapolate: 'clamp',
	});

	if (loading) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color={lightTheme.colors.primary} />
			</View>
		);
	}

	if (!vehicle) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: lightTheme.colors.onBackground }}>
					Vehículo no encontrado
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor="transparent"
				translucent={true}
			/>
			<Animated.View
				style={[
					styles.header,
					{
						height: headerHeight,
						opacity: headerOpacity,
						backgroundColor: lightTheme.colors.primary,
					}
				]}
			>
				<Animated.View
					style={[
						styles.imageContainer,
						{
							transform: [{ scale: imageScale }],
						}
					]}
				>
					{vehicle.imageUrl ? (
						<Animated.Image
							source={{ uri: vehicle.imageUrl }}
							style={[styles.vehicleImage, { opacity: headerOpacity }]}
						/>
					) : (
						<Card
							paddingX={0}
							paddingY={0}
							rounded={roundness.md}
							shadow='none'
							backgroundColor={`${lightTheme.colors.onPrimary}CC`}
							style={{ marginTop: spacing.lg }}
						>
							<View style={styles.iconContainer}>
								<IconPlaceholder icon={Truck} size={150} rounded={roundness.sm} borderWidth={6} />
							</View>
						</Card>
					)}
				</Animated.View>
			</Animated.View>

			<Animated.View
				style={[
					styles.backgroundOverlay,
					{
						opacity: overlayOpacity,
						height: STATUS_BAR_HEIGHT + 55,
					}
				]}
			/>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
				bounces={false}
			>
				<View style={[styles.headerSpacer, { height: HEADER_HEIGHT + STATUS_BAR_HEIGHT }]} />

				<Animated.View style={[styles.content, { paddingTop: contentPaddingTop }]}>
					<View style={styles.statusBadgeContainer}>
						<StatusBadge status={vehicle.status ?? VehicleStatus.INACTIVE} />
					</View>

					<Text style={styles.cardTitle}>Información del vehículo</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{vehicle.plateNumber && <InfoRow label="Matrícula" labelFlex={2} valueFlex={3} value={vehicle.plateNumber} />}
							<View style={styles.separator} />
							{vehicle.vehicleBrand && <InfoRow label="Marca" labelFlex={2} valueFlex={3} value={vehicle.vehicleBrand} />}
							<View style={styles.separator} />
							{vehicle.vehicleModel && <InfoRow label="Modelo" labelFlex={2} valueFlex={3} value={vehicle.vehicleModel} />}
							<View style={styles.separator} />
							{vehicle.vehicleType && <InfoRow label="Tipo" labelFlex={2} valueFlex={3} value={vehicle.vehicleType} />}
						</View>
					</Card>

					<Text style={styles.cardTitle}>Información adicional</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{vehicle.year && <InfoRow label="Año" labelFlex={2} valueFlex={3} value={vehicle.year.toString()} />}
							<View style={styles.separator} />
							{vehicle.purchaseDate && <InfoRow label="Fecha de adquisición" labelFlex={2} valueFlex={3} value={formatISODate(vehicle.purchaseDate.toISOString())} />}
							<View style={styles.separator} />
							{vehicle.registrationDate && <InfoRow label="Fecha de registro" labelFlex={2} valueFlex={3} value={formatISODate(vehicle.registrationDate.toISOString())} />}
						</View>
					</Card>

					<Pressable
						style={({ pressed }) => [
							styles.cardTitleContainer,
							pressed && { opacity: 0.8 },
						]}
						onPress={() => console.log('Accediendo al historial de incidencias y mantenimientos')}
					>
						<Text style={styles.cardTitle}>Incidencias y mantenimientos</Text>
						<ExternalLink size={16} strokeWidth={2.5} color={lightTheme.colors.onSurface} />
					</Pressable>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						{/* ! HARD CODED CONTENT ! */}
						<View style={styles.cardContent}>
							<Text style={styles.assignationText}>Sin incidencias ni mantenimientos</Text>
						</View>
					</Card>

					<Pressable
						style={({ pressed }) => [
							styles.cardTitleContainer,
							pressed && { opacity: 0.8 },
						]}
						onPress={() => console.log('Accediendo al historial de asignaciones')}
					>
						<Text style={styles.cardTitle}>Asignaciones recientes</Text>
						<ExternalLink size={16} strokeWidth={2.5} color={lightTheme.colors.onSurface} />
					</Pressable>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						{/* ! HARD CODED CONTENT ! */}
						<View style={styles.cardContent}>
							<Text style={styles.assignationText}>Sin asignaciones previas</Text>
						</View>
					</Card>
				</Animated.View>
			</Animated.ScrollView>
		</View>
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
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: STATUS_BAR_HEIGHT,
	},
	backgroundOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1001,
		backgroundColor: lightTheme.colors.background,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	vehicleImage: {
		width: 300,
		height: 180,
		borderRadius: roundness.md,
		marginTop: spacing.lg,
	},
	iconContainer: {
		width: 180,
		height: 180,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollView: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	scrollViewContent: {
		flexGrow: 1,
		minHeight: SCREEN_HEIGHT - STATUS_BAR_HEIGHT + SCROLL_DISTANCE + 30, // Manually fix offset
	},
	headerSpacer: {
		backgroundColor: 'transparent',
	},
	content: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		borderTopLeftRadius: spacing.md,
		borderTopRightRadius: spacing.md,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	name: {
		fontSize: typography.headlineLarge,
		fontWeight: '700',
		color: lightTheme.colors.onBackground,
	},
	statusBadgeContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
		marginBottom: spacing.xs,
	},
	cardTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: spacing.xs,
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
		opacity: 0.5
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
	assignationText: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		fontStyle: 'italic',
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
});