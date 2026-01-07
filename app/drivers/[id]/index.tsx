import { Card } from '@/components/Card';
import { ElevatedButton } from '@/components/ElevatedButton';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { InfoRow } from '@/components/InfoRow';
import { SkeletonDetail } from '@/components/skeletons';
import { StatusLabel } from '@/components/StatusLabel';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { autoCloseOldActiveRanges, calculateCurrentMinutes, formatDateToDisplay, getTotalDayTimeColor } from '@/utils/dateUtils';
import { getDriverStatusIcon } from '@/utils/driversUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ExternalLink, SquarePen, UserRound } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
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
const SCROLL_DISTANCE = 250;

export default function DriverProfileScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const scrollY = useRef(new Animated.Value(0)).current;

	const { theme, isDark } = useAppTheme();
	const user = useAuthStore((state) => state.user);
	const currentDriver = useDriversStore((state) => state.currentDriver);

	const styles = useMemo(() => getStyles(theme), [theme]);
	const loadingDriver = useDriversStore((state) => state.loadingDriver);
	const driverError = useDriversStore((state) => state.driverError);
	const fetchDriverById = useDriversStore((state) => state.fetchDriverById);
	const clearCurrentDriver = useDriversStore((state) => state.clearCurrentDriver);
	const fetchRegistrationsByDriver = useTimeRegistrationsStore((state) => state.fetchRegistrationsByDriver);
	const clearCurrentRegistration = useTimeRegistrationsStore((state) => state.clearCurrentRegistration);
	const registrations = useTimeRegistrationsStore((state) => state.registrations);

	// Role-based access control
	const canViewSensitiveData = user?.role === 'admin' || user?.role === 'manager';
	const isOwnProfile = user?.id === id;

	useEffect(() => {
		if (id) {
			fetchDriverById(id as string);
			fetchRegistrationsByDriver(id as string);
		}
		return () => {
			clearCurrentDriver();
			clearCurrentRegistration();
		};
	}, [id, fetchDriverById, clearCurrentDriver, fetchRegistrationsByDriver, clearCurrentRegistration]);

	const handleEditPress = () => {
		if (id) {
			router.push(`/drivers/${id}/edit` as any);
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

	if (loadingDriver) {
		return <SkeletonDetail />;
	}

	if (driverError) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Error: {driverError}</Text>
			</View>
		);
	}

	if (!currentDriver) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>Conductor no encontrado</Text>
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
						{currentDriver.imageUrl ? (
							<Image
								source={{ uri: currentDriver.imageUrl }}
								style={styles.driverImage}
								resizeMode="cover"
							/>
						) : (
							<View style={styles.iconContainer}>
								<IconPlaceholder
									icon={UserRound}
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
							status={currentDriver.status}
							Icon={getDriverStatusIcon(currentDriver.status)}
							iconSize={20}
							textSize={typography.titleSmall}
						/>
					</View>

					<View>
						<Text style={styles.name}>
							{currentDriver.name} {currentDriver.surnames || ''}
						</Text>
					</View>
					<Text style={styles.registrationDate}>Registrado en: {formatDateToDisplay(currentDriver.registrationDate)}</Text>

					<Text style={styles.cardTitle}>Información de contacto</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<View style={styles.cardContent}>
							{currentDriver.phone && (
								<InfoRow
									label="Teléfono"
									labelFlex={2}
									valueFlex={3}
									value={currentDriver.phone}
								/>
							)}
							<View style={styles.separator} />
							{currentDriver.email && (
								<InfoRow
									label="Email"
									labelFlex={2}
									valueFlex={3}
									value={currentDriver.email}
								/>
							)}
							<View style={styles.separator} />
							{currentDriver.completeAddress && (
								<InfoRow
									label="Dirección"
									labelFlex={2}
									valueFlex={3}
									value={currentDriver.completeAddress}
								/>
							)}
						</View>
					</Card>

					<Text style={styles.cardTitle}>Detalles</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<View style={styles.cardContent}>
							<InfoRow
								label="DNI/NIE"
								labelFlex={2}
								valueFlex={3}
								value={currentDriver.personId}
							/>
							<View style={styles.separator} />
							{currentDriver.licenseNumber && (
								<InfoRow
									label="Licencia"
									labelFlex={2}
									valueFlex={3}
									value={currentDriver.licenseNumber}
								/>
							)}
							<View style={styles.separator} />
							<InfoRow
								label="Fecha de nacimiento"
								labelFlex={2}
								valueFlex={3}
								value={formatDateToDisplay(currentDriver.birthDate)}
							/>
						</View>
					</Card>

					{(canViewSensitiveData || isOwnProfile) && (
						<Pressable
							style={({ pressed }) => [
								pressed && { opacity: 0.8 },
							]}
							onPress={() => {
								router.push({
									pathname: `/drivers/${id}/time-history` as any
								});
							}}
						>
							<View
								style={[styles.cardTitleContainer, { marginBottom: spacing.md }]}
							>
								<Text style={styles.cardTitle}>Registro horario</Text>
								<ExternalLink size={16} strokeWidth={2.5} color={theme.colors.onSurface} />
							</View>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow="none"
								backgroundColor={theme.colors.surface}
							>
								<View style={styles.cardContent}>
									{(!registrations || registrations.length === 0) ? (
										<Text style={styles.assignationText}>Sin registros horarios</Text>
									) : (
										<>
											{/* Cabecera simple */}
											<View style={[styles.tableRow, styles.tableHeader]}>
												<Text style={[styles.cell, styles.headerText]}>Fecha</Text>
												<Text style={[styles.cell, styles.headerText]}>Total</Text>
											</View>

											{(() => {
												const sorted = [...registrations].sort((a, b) => {
													const dateA = new Date(a.date).getTime() || 0;
													const dateB = new Date(b.date).getTime() || 0;
													return dateB - dateA;
												});

												const lastFive = sorted.slice(0, 5);
												const formatMinutes = (totalMinutes: number) => {
													if (totalMinutes <= 0 || isNaN(totalMinutes)) return '-';
													const hh = Math.floor(totalMinutes / 60);
													const mm = totalMinutes % 60;
													return `${hh}h ${mm}m`;
												};

												return lastFive.map((reg) => {
													const dateLabel = formatDateToDisplay(reg.date);


													const closedReg = autoCloseOldActiveRanges(reg);
													const ranges = Array.isArray(closedReg.timeRanges) ? closedReg.timeRanges : [];

													const totalMinutes = calculateCurrentMinutes(ranges, new Date());

													const totalColorObj = getTotalDayTimeColor(totalMinutes, theme);

													return (
														<View key={reg.id ?? `${dateLabel}`} style={styles.tableRow}>
															<Text style={styles.cell}>{dateLabel}</Text>
															<View style={{
																backgroundColor: totalColorObj.container,
																borderRadius: roundness.xs,
																paddingHorizontal: spacing.xs,
																paddingVertical: spacing.xs,
																alignItems: 'center',
																minWidth: 120,
																maxWidth: 120,
															}}>
																<Text style={[styles.cell, { color: totalColorObj.text }]}>{formatMinutes(totalMinutes)}</Text>
															</View>
														</View>
													);
												});
											})()}
										</>
									)}
								</View>
							</Card>
						</Pressable>
					)}

					{canViewSensitiveData && (
						// TODO -> assigned vehicles
						<>
							<Pressable
								style={({ pressed }) => [
									styles.cardTitleContainer,
									pressed && { opacity: 0.8 },
								]}
								onPress={() => console.log('Accediendo al historial de asignaciones')}
							>
								<Text style={styles.cardTitle}>Asignaciones recientes</Text>
								<ExternalLink size={16} strokeWidth={2.5} color={theme.colors.onSurface} />
							</Pressable>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow="none"
								backgroundColor={theme.colors.surface}
							>
								<View style={styles.cardContent}>
									<Text style={styles.assignationText}>Sin asignaciones previas</Text>
								</View>
							</Card>
						</>
					)}

					{(canViewSensitiveData || isOwnProfile) && (
						// TODO -> incidents & maintenances
						<>
							<Pressable
								style={({ pressed }) => [
									styles.cardTitleContainer,
									pressed && { opacity: 0.8 },
								]}
								onPress={() => console.log('Accediendo al historial de incidencias y mantenimientos')}
							>
								<Text style={styles.cardTitle}>Incidencias relacionadas</Text>
								<ExternalLink size={16} strokeWidth={2.5} color={theme.colors.onSurface} />
							</Pressable>
							<Card
								paddingX={spacing.md}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow="none"
								backgroundColor={theme.colors.surface}
							>
								<View style={styles.cardContent}>
									<Text style={styles.assignationText}>Sin incidencias ni mantenimientos</Text>
								</View>
							</Card>
						</>
					)}
				</View>
			</Animated.ScrollView >
		</View >
	);
}

function getStyles(theme: any) {
	return StyleSheet.create({
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
	driverImage: {
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
	name: {
		fontSize: typography.headlineLarge,
		fontWeight: '700',
		color: theme.colors.onBackground,
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
	assignationText: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		fontStyle: 'italic',
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: theme.colors.outline,
		opacity: 0.5,
	},
	tableHeader: {
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.outline,
		paddingBottom: spacing.xs,
		marginBottom: spacing.xs,
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: spacing.xs,
		gap: spacing.sm,
		// si quieres líneas separadoras entre filas:
		borderBottomWidth: 1,
		borderBottomColor: `${theme.colors.outline}33`, // ligera transparencia
	},
	cell: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurface,
		textAlign: 'left',
	},
	headerText: {
		fontWeight: '600',
		color: theme.colors.onSurfaceVariant,
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.error,
	},
	});
}