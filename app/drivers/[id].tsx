import { Card } from '@/components/Card';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { StatusBadge } from '@/components/StatusBadge';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import type { Driver } from '@/models/driver';
import { getDriverById } from '@/services/data/mock/drivers';
import { useLocalSearchParams } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
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
	const [driver, setDriver] = useState<Driver | null>(null);
	const [loading, setLoading] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (id) {
			getDriverById(id)
				.then(setDriver)
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

	if (!driver) {
		return (
			<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: lightTheme.colors.onBackground }}>
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
					{driver.imageUrl ? (
						<Animated.Image
							source={{ uri: driver.imageUrl }}
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
						<StatusBadge status={driver.status ?? DriverStatus.INACTIVE} />
					</View>

					<View>
						<Text style={styles.name}>
							{driver.name} {driver.surnames || ''}
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
							{driver.phone && <InfoRow label="Teléfono" labelFlex={2} valueFlex={3} value={driver.phone} />}
							<View style={styles.separator} />
							{driver.email && <InfoRow label="Email" labelFlex={2} valueFlex={3} value={driver.email} />}
							<View style={styles.separator} />
							{driver.completeAddress && <InfoRow label="Dirección" labelFlex={2} valueFlex={3} value={driver.completeAddress} />}
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
							{driver.licenseNumber && (
								<InfoRow label="Licencia" labelFlex={2} valueFlex={3} value={driver.licenseNumber} />
							)}
							<View style={styles.separator} />
							<InfoRow
								label="Fecha de nacimiento"
								labelFlex={2}
								valueFlex={3}
								value={new Date(driver.birthDate).toLocaleDateString()}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="Fecha de registro"
								labelFlex={2}
								valueFlex={3}
								value={new Date(driver.registrationDate).toLocaleDateString()}
							/>
							<View style={styles.separator} />
							<InfoRow
								label="DNI/NIE"
								labelFlex={2}
								valueFlex={3}
								value={driver.personId}
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
});