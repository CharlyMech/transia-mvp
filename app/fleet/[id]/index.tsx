import { Card } from '@/components/Card';
import { ElevatedButton } from '@/components/ElevatedButton';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { InfoRow } from '@/components/InfoRow';
import { SkeletonDetail } from '@/components/skeletons';
import { StatusLabel } from '@/components/StatusLabel';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Driver } from '@/models/driver';
import type { VehicleAssignation } from '@/models/vehicleAssignation';
import type { VehicleMaintenance } from '@/models/vehicleMaintenance';
import { MaintenanceType } from '@/models/vehicleMaintenance';
import { drivers, vehicleAssignations, vehicleMaintenances } from '@/services/data';
import { useFleetStore } from '@/stores/useFleetStore';
import { formatDateToDisplay, formatISODate } from '@/utils/dateUtils';
import { getVehicleStatusIcon } from '@/utils/fleetUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight, ExternalLink, SquarePen, Truck, UserRound } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	Image,
	Pressable,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CARD_HEIGHT = 280;
const SCROLL_DISTANCE = 200;

export default function VehicleDetailScreen() {
	const { theme, isDark } = useAppTheme();
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const scrollY = useRef(new Animated.Value(0)).current;

	const currentVehicle = useFleetStore((state) => state.currentVehicle);
	const loadingVehicle = useFleetStore((state) => state.loadingVehicle);
	const vehicleError = useFleetStore((state) => state.vehicleError);
	const fetchVehicleById = useFleetStore((state) => state.fetchVehicleById);
	const clearCurrentVehicle = useFleetStore((state) => state.clearCurrentVehicle);

	const [maintenances, setMaintenances] = useState<VehicleMaintenance[]>([]);
	const [assignations, setAssignations] = useState<VehicleAssignation[]>([]);
	const [driversList, setDriversList] = useState<Driver[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	useEffect(() => {
		if (id) {
			fetchVehicleById(id as string);
			loadVehicleData(id as string);
		}
		return () => {
			clearCurrentVehicle();
		};
	}, [id, fetchVehicleById, clearCurrentVehicle]);

	const loadVehicleData = async (vehicleId: string) => {
		try {
			setLoadingData(true);
			const [maintenancesData, assignationsData, driversData] = await Promise.all([
				vehicleMaintenances.getMaintenancesByVehicleId(vehicleId),
				vehicleAssignations.getAssignationsByVehicleId(vehicleId),
				drivers.listDrivers(),
			]);

			// Filter maintenances: only future or current date (not "Otro" type)
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const futureMaintenances = maintenancesData.filter(m => {
				if (m.maintenanceType === MaintenanceType.OTHER) return false;
				const maintenanceDate = new Date(m.scheduledDate);
				maintenanceDate.setHours(0, 0, 0, 0);
				return maintenanceDate >= today;
			});

			// Get last 5 incidents (type "Otro")
			const incidents = maintenancesData
				.filter(m => m.maintenanceType === MaintenanceType.OTHER)
				.slice(0, 5);

			// Combine for display - incidents will be shown separately
			setMaintenances([...incidents, ...futureMaintenances]);

			// Get only the last assignation
			const lastAssignation = assignationsData.length > 0 ? [assignationsData[0]] : [];
			setAssignations(lastAssignation);

			setDriversList(driversData);
		} catch (error) {
			console.error('Error loading vehicle data:', error);
		} finally {
			setLoadingData(false);
		}
	};

	const getDriverName = (driverId: string): string => {
		const driver = driversList.find(d => d.id === driverId);
		return driver ? `${driver.name} ${driver.surnames}` : 'Conductor no encontrado';
	};

	const handleEditPress = () => {
		if (id) {
			router.push(`/fleet/edit/${id}` as any);
		}
	};

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

	const styles = useMemo(() => getStyles(theme), [theme]);

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
						backgroundColor={theme.colors.surface}
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
						backgroundColor={theme.colors.surface}
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
							{currentVehicle.vehicleBrand && (
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Marca"
										labelFlex={2}
										valueFlex={3}
										value={currentVehicle.vehicleBrand}
									/>
								</>
							)}
							{currentVehicle.vehicleModel && (
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Modelo"
										labelFlex={2}
										valueFlex={3}
										value={currentVehicle.vehicleModel}
									/>
								</>
							)}
							{currentVehicle.vehicleType && (
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Tipo"
										labelFlex={2}
										valueFlex={3}
										value={currentVehicle.vehicleType}
									/>
								</>
							)}
							{currentVehicle.year && (
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Año"
										labelFlex={2}
										valueFlex={3}
										value={currentVehicle.year.toString()}
									/>
								</>
							)}
							{currentVehicle.purchaseDate && (
								<>
									<View style={styles.separator} />
									<InfoRow
										label="Fecha de adquisición"
										labelFlex={2}
										valueFlex={3}
										value={formatISODate(currentVehicle.purchaseDate.toISOString())}
									/>
								</>
							)}
						</View>
					</Card>

					<View style={styles.row}>
						<Text style={styles.cardTitle}>Incidencias</Text>
						<TouchableOpacity style={styles.completeHisotry} onPress={() => router.push(`/fleet/${id}/report-history` as any)}>
							<Text style={styles.completeHisotryText}>(ver historial completo</Text>
							<ExternalLink size={12} style={{ marginLeft: spacing.xs }} color={`${theme.colors.onSurface}90`} />
							<Text style={styles.completeHisotryText}>)</Text>
						</TouchableOpacity>
					</View>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<View style={styles.cardContent}>
							{loadingData ? (
								<Text style={styles.placeHolderText}>Cargando...</Text>
							) : maintenances.filter(m => m.maintenanceType === MaintenanceType.OTHER).length > 0 ? (
								<>
									{/* TODO */}
									{/* {maintenances
										.filter(m => m.maintenanceType === MaintenanceType.OTHER)
										.map((incident, index) => (
											<React.Fragment key={incident.id}>
												{index > 0 && <View style={styles.separator} />}
												<InfoRow
													label={formatDateToDisplay(incident.scheduledDate)}
													value={incident.maintenanceType}
													labelFlex={2}
													valueFlex={3}
												/>
											</React.Fragment>
										))}
									{maintenances.filter(m => m.maintenanceType === MaintenanceType.OTHER).length > 5 && (
										<>
											<View style={styles.separator} />
											<Pressable onPress={() => router.push(`/fleet/${id}/report-history` as any)}>
												<Text style={styles.viewHistoryText}>ver historial completo</Text>
											</Pressable>
										</>
									)} */}
								</>
							) : (
								<Text style={styles.placeHolderText}>Sin incidencias</Text>
							)}
						</View>
					</Card>

					<View style={styles.row}>
						<Text style={styles.cardTitle}>Mantenimientos</Text>
						<TouchableOpacity style={styles.completeHisotry} onPress={() => router.push(`/fleet/${id}/maintenance-history` as any)}>
							<Text style={styles.completeHisotryText}>(ver historial completo</Text>
							<ExternalLink size={12} style={{ marginLeft: spacing.xs }} color={`${theme.colors.onSurface}90`} />
							<Text style={styles.completeHisotryText}>)</Text>
						</TouchableOpacity>
					</View>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<View style={styles.cardContent}>
							{loadingData ? (
								<Text style={styles.placeHolderText}>Cargando...</Text>
							) : maintenances.filter(m => m.maintenanceType !== MaintenanceType.OTHER).length > 0 ? (
								<>
									{maintenances
										.filter(m => m.maintenanceType !== MaintenanceType.OTHER)
										.map((maintenance, index) => (
											<React.Fragment key={maintenance.id}>
												{index > 0 && <View style={styles.separator} />}
												<InfoRow
													label={formatDateToDisplay(maintenance.scheduledDate)}
													value={maintenance.maintenanceType}
													labelFlex={2}
													valueFlex={3}
												/>
											</React.Fragment>
										))}
									{maintenances.filter(m => m.maintenanceType !== MaintenanceType.OTHER).length > 5 && (
										<>
											<View style={styles.separator} />
											<Pressable onPress={() => router.push(`/fleet/${id}/maintenance-history` as any)}>
												<Text style={styles.viewHistoryText}>ver historial completo</Text>
											</Pressable>
										</>
									)}
								</>
							) : (
								<Text style={styles.placeHolderText}>Sin mantenimientos próximos</Text>
							)}
						</View>
					</Card>

					<View style={styles.row}>
						<Text style={styles.cardTitle}>Asignación actual</Text>
						<TouchableOpacity style={styles.completeHisotry} onPress={() => router.push(`/fleet/${id}/assignation-history` as any)}>
							<Text style={styles.completeHisotryText}>(ver historial completo</Text>
							<ExternalLink size={12} style={{ marginLeft: spacing.xs }} color={`${theme.colors.onSurface}90`} />
							<Text style={styles.completeHisotryText}>)</Text>
						</TouchableOpacity>
					</View>
					{loadingData ? (
						<Card>
							<Text style={styles.placeHolderText}>Cargando...</Text>
						</Card>
					) : assignations.length > 0 ? (
						<Card
							paddingX={spacing.sm}
							paddingY={spacing.sm}
							rounded={roundness.sm}
							shadow='none'
							backgroundColor={theme.colors.surface}
							onPress={() => {
								const driver = driversList.find(d => d.id === assignations[0].driverId);
								if (driver) {
									router.push(`/drivers/${driver.id}` as any);
								}
							}}
						>
							<View style={styles.lastAssignationContainer}>
								{(() => {
									const driver = driversList.find(d => d.id === assignations[0].driverId);
									return driver ? (
										<>
											{driver.imageUrl ? (
												<Image
													source={{ uri: driver.imageUrl }}
													style={styles.userImage}
												/>
											) : (
												<Card
													paddingX={0}
													paddingY={0}
													rounded={roundness.xs}
													shadow='none'
													backgroundColor={`${theme.colors.primary}CC`}
													style={styles.userImage}
												>
													<IconPlaceholder
														color={theme.colors.onPrimary}
														icon={UserRound}
														size={80}
													/>
												</Card>
											)}
											<View style={styles.userInfo}>
												<Text style={styles.userName}>
													{driver.name} {driver.surnames}
												</Text>
												<Text style={styles.userEmail}>
													{driver.email}
												</Text>
											</View>
											<View style={styles.arrowContainer}>
												<ChevronRight size={20} color={theme.colors.onSurfaceVariant} />
											</View>
										</>
									) : (
										<Text style={styles.placeHolderText}>Conductor no encontrado</Text>
									);
								})()}
							</View>
						</Card>
					) : (
						<Card>
							<Text style={styles.placeHolderText}>Sin asignaciones previas</Text>
						</Card>
					)}
				</View>
			</Animated.ScrollView>
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
		color: `${theme.colors.onSurface}80`,
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
		color: theme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: spacing.xs,
	},
	completeHisotry: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	completeHisotryText: {
		fontSize: typography.bodyMedium,
		fontWeight: '300',
		color: `${theme.colors.onSurface}90`,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: theme.colors.outline,
		opacity: 0.5,
	},
	placeHolderText: {
		fontSize: typography.bodyMedium,
		fontWeight: '300',
		fontStyle: 'italic',
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	lastAssignationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	itemText: {
		fontSize: typography.bodyMedium,
		fontWeight: '400',
		color: theme.colors.onSurface,
		lineHeight: 20,
	},
	viewHistoryText: {
		fontSize: typography.bodySmall,
		fontWeight: '500',
		fontStyle: 'italic',
		color: theme.colors.primary,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.error,
	},
	userImage: {
		width: 80,
		height: 80,
		borderRadius: roundness.xs,
	},
	userInfo: {
		flex: 1,
		gap: spacing.xs,
	},
	userName: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onSurface,
	},
	userEmail: {
		fontSize: typography.bodySmall,
		fontWeight: '400',
		color: theme.colors.onSurfaceVariant,
	},
	arrowContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});