import { Card } from '@/components/Card';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { SkeletonHeaderDetail } from '@/components/skeletons';
import { StatusBadge } from '@/components/StatusBadge';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useDriversStore } from '@/stores/useDriversStore';
import { formatDateToDisplay } from '@/utils/dateUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { SquarePen, UserRound } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
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

export default function DriverProfileScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const scrollY = useRef(new Animated.Value(0)).current;

	const currentDriver = useDriversStore((state) => state.currentDriver);
	const loadingDriver = useDriversStore((state) => state.loadingDriver);
	const driverError = useDriversStore((state) => state.driverError);
	const fetchDriverById = useDriversStore((state) => state.fetchDriverById);
	const clearCurrentDriver = useDriversStore((state) => state.clearCurrentDriver);

	// Fetch driver
	useEffect(() => {
		if (id) {
			fetchDriverById(id as string);
		}
		// Clean up
		return () => {
			clearCurrentDriver();
		};
	}, [id, fetchDriverById, clearCurrentDriver]);

	const handleEditPress = () => {
		if (id) {
			router.push(`/drivers/edit/${id}` as any);
		}
	};

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

	if (loadingDriver) {
		return <SkeletonHeaderDetail />;
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
				<Text style={styles.errorText}>
					Conductor no encontrado
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
			<Pressable
				style={styles.editButton}
				onPress={handleEditPress}
			>
				<SquarePen size={28} color={lightTheme.colors.onSurface} />
			</Pressable>
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
					{currentDriver.imageUrl ? (
						<Animated.Image
							source={{ uri: currentDriver.imageUrl }}
							style={[styles.driverImage, { opacity: headerOpacity }]}
						/>
					) : (
						<Card
							paddingX={0}
							paddingY={0}
							rounded={roundness.md}
							shadow='none'
							backgroundColor={`${lightTheme.colors.onPrimary}CC`}
							style={styles.driverImage}
						>
							<View style={styles.iconContainer}>
								<IconPlaceholder icon={UserRound} rounded={roundness.sm} size={150} borderWidth={6} />
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
						<StatusBadge status={currentDriver.status ?? DriverStatus.INACTIVE} />
					</View>

					<View>
						<Text style={styles.name}>
							{currentDriver.name} {currentDriver.surnames || ''}
						</Text>
					</View>

					<Text style={styles.cardTitle}>Información de contacto</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{currentDriver.phone && <InfoRow label="Teléfono" labelFlex={2} valueFlex={3} value={currentDriver.phone} />}
							<View style={styles.separator} />
							{currentDriver.email && <InfoRow label="Email" labelFlex={2} valueFlex={3} value={currentDriver.email} />}
							<View style={styles.separator} />
							{currentDriver.completeAddress && <InfoRow label="Dirección" labelFlex={2} valueFlex={3} value={currentDriver.completeAddress} />}
						</View>
					</Card>

					<Text style={styles.cardTitle}>Detalles</Text>
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.md}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.cardContent}>
							{currentDriver.licenseNumber && (
								<InfoRow label="Licencia" labelFlex={2} valueFlex={3} value={currentDriver.licenseNumber} />
							)}
							<View style={styles.separator} />
							<InfoRow
								label="Fecha de nacimiento"
								labelFlex={2}
								valueFlex={3}
								value={formatDateToDisplay(currentDriver.birthDate)}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Fecha de registro"
								labelFlex={2}
								valueFlex={3}
								value={formatDateToDisplay(currentDriver.registrationDate)}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="DNI/NIE"
								labelFlex={2}
								valueFlex={3}
								value={currentDriver.personId}
							/>
						</View>
					</Card>

					{/* TODO -> assigned vehicle & assign new vehicle */}

					{/* More data??? */}
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
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	editButton: {
		position: 'absolute',
		right: spacing.md,
		top: STATUS_BAR_HEIGHT + spacing.md,
		zIndex: 1002,
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
	driverImage: {
		width: 180,
		height: 180,
		borderRadius: roundness.md,
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
		minHeight: SCREEN_HEIGHT - STATUS_BAR_HEIGHT + SCROLL_DISTANCE + 30,
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
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
	},
});