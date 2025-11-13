import { Card } from '@/components/Card';
import { ElevatedButton } from '@/components/ElevatedButton';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { InfoRow } from '@/components/InfoRow';
import { SkeletonDetail } from '@/components/skeletons';
import { StatusLabel } from '@/components/StatusLabel';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useFleetStore } from '@/stores/useFleetStore';
import { formatDateToDisplay, formatISODate } from '@/utils/dateUtils';
import { getVehicleStatusIcon } from '@/utils/fleetUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ExternalLink, SquarePen, Truck } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
	Animated,
	Image,
	Pressable,
	StatusBar,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CARD_HEIGHT = 280;
const SCROLL_DISTANCE = 200;

export default function VehicleDetailScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const scrollY = useRef(new Animated.Value(0)).current;

	const currentVehicle = useFleetStore((state) => state.currentVehicle);
	const loadingVehicle = useFleetStore((state) => state.loadingVehicle);
	const vehicleError = useFleetStore((state) => state.vehicleError);
	const fetchVehicleById = useFleetStore((state) => state.fetchVehicleById);
	const clearCurrentVehicle = useFleetStore((state) => state.clearCurrentVehicle);

	useEffect(() => {
		if (id) {
			fetchVehicleById(id as string);
		}
		return () => {
			clearCurrentVehicle();
		};
	}, [id, fetchVehicleById, clearCurrentVehicle]);

	const handleEditPress = () => {
		if (id) {
			router.push(`/fleet/edit/${id}` as any);
		}
	};

	// Animaciones para la card
	const cardScale = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [1, 0.3],
		extrapolate: 'clamp',
	});

	const cardOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.8, SCROLL_DISTANCE],
		outputRange: [1, 0.5, 0],
		extrapolate: 'clamp',
	});

	const cardTranslateY = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [0, -50],
		extrapolate: 'clamp',
	});

	if (loadingVehicle) {
		return <SkeletonDetail />;
	}

	if (vehicleError) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Error: {vehicleError}</Text>
			</View>
		);
	}

	if (!currentVehicle) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Vehículo no encontrado</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={lightTheme.colors.background}
				translucent={false}
			/>

			<View style={[styles.floatingButtonsContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={lightTheme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={lightTheme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={() => router.back()}
				/>
				<ElevatedButton
					backgroundColor={lightTheme.colors.primary}
					icon={SquarePen}
					iconSize={22}
					iconColor={lightTheme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={handleEditPress}
				/>
			</View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollViewContent,
					{ paddingTop: insets.top + 60 }
				]}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				scrollEventThrottle={16}
			>
				<Animated.View
					style={[
						styles.imageCardContainer,
						{
							opacity: cardOpacity,
							transform: [
								{ scale: cardScale },
								{ translateY: cardTranslateY }
							],
						}
					]}
				>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="medium"
						backgroundColor={lightTheme.colors.surface}
					>
						{currentVehicle.imageUrl ? (
							<Image
								source={{ uri: currentVehicle.imageUrl }}
								style={styles.vehicleImage}
								resizeMode="cover"
							/>
						) : (
							<View style={styles.iconContainer}>
								<IconPlaceholder
									icon={Truck}
									size={150}
									rounded={roundness.sm}
									borderWidth={6}
								/>
							</View>
						)}
					</Card>
				</Animated.View>

				<View style={styles.content}>
					<View style={styles.statusBadgeContainer}>
						<StatusLabel
							status={currentVehicle.status}
							Icon={getVehicleStatusIcon(currentVehicle.status)}
							iconSize={20}
							textSize={typography.titleSmall}
						/>
					</View>
					<Text style={styles.registrationDate}>Registrado en: {formatDateToDisplay(currentVehicle.registrationDate)}</Text>

					<Text style={styles.cardTitle}>Información del vehículo</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{currentVehicle.plateNumber && (
								<InfoRow
									label="Matrícula"
									labelFlex={2}
									valueFlex={3}
									value={currentVehicle.plateNumber}
								/>
							)}
							<View style={styles.separator} />
							{currentVehicle.vehicleBrand && (
								<InfoRow
									label="Marca"
									labelFlex={2}
									valueFlex={3}
									value={currentVehicle.vehicleBrand}
								/>
							)}
							<View style={styles.separator} />
							{currentVehicle.vehicleModel && (
								<InfoRow
									label="Modelo"
									labelFlex={2}
									valueFlex={3}
									value={currentVehicle.vehicleModel}
								/>
							)}
							<View style={styles.separator} />
							{currentVehicle.vehicleType && (
								<InfoRow
									label="Tipo"
									labelFlex={2}
									valueFlex={3}
									value={currentVehicle.vehicleType}
								/>
							)}
						</View>
					</Card>

					<Text style={styles.cardTitle}>Información adicional</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{currentVehicle.year && (
								<InfoRow
									label="Año"
									labelFlex={2}
									valueFlex={3}
									value={currentVehicle.year.toString()}
								/>
							)}
							<View style={styles.separator} />
							{currentVehicle.purchaseDate && (
								<InfoRow
									label="Fecha de adquisición"
									labelFlex={2}
									valueFlex={3}
									value={formatISODate(currentVehicle.purchaseDate.toISOString())}
								/>
							)}
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
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
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
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							<Text style={styles.assignationText}>Sin asignaciones previas</Text>
						</View>
					</Card>
				</View>
			</Animated.ScrollView>
		</View>
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
	imageCardContainer: {
		paddingHorizontal: spacing.md,
		marginBottom: spacing.md,
	},
	vehicleImage: {
		width: '100%',
		height: CARD_HEIGHT,
		borderRadius: roundness.xs,
	},
	iconContainer: {
		width: '100%',
		height: CARD_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	statusBadgeContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
		marginBottom: spacing.xs,
	},
	registrationDate: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		fontStyle: 'italic',
		color: `${lightTheme.colors.onSurface}80`,
		textAlign: 'left',
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
		opacity: 0.5,
	},
	assignationText: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		fontStyle: 'italic',
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
	},
});