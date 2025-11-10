import { IconBadge } from '@/components/IconBadge';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { calculateCurrentMinutes, getTotalDayTimeColor } from '@/utils/dateUtils';
import { router } from 'expo-router';
import { ChevronRight, Clock, Info } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface TimeTrackingProps {
	onPress?: () => void;
}

export function TimeTracking({ onPress }: TimeTrackingProps) {
	const user = useAuthStore((state) => state.user);
	const currentRegistration = useTimeRegistrationsStore((state) => state.currentRegistration);
	const loadingRegistration = useTimeRegistrationsStore((state) => state.loadingRegistration);
	const fetchRegistrationByDriverAndDate = useTimeRegistrationsStore(
		(state) => state.fetchRegistrationByDriverAndDate
	);

	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every second for real-time tracking
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (user?.id) {
			fetchRegistrationByDriverAndDate(user.id, new Date());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	const getCurrentMinutes = () => {
		if (!currentRegistration) return 0;
		return calculateCurrentMinutes(currentRegistration.timeRanges, currentTime);
	};

	const getActiveRange = () => {
		if (!currentRegistration) return null;
		return currentRegistration.timeRanges.find((range) => !range.endTime);
	};

	const getStatusInfo = () => {
		if (!currentRegistration) {
			return {
				label: 'Sin registro',
				color: lightTheme.colors.onSurface,
				backgroundColor: `${lightTheme.colors.outline}50`,
			};
		}

		const activeRange = getActiveRange();

		if (activeRange) {
			return {
				label: 'Jornada en curso',
				color: lightTheme.colors.onPrimary,
				backgroundColor: lightTheme.colors.primary,
			};
		}

		if (currentRegistration.isActive) {
			return {
				label: 'Jornada pausada',
				color: lightTheme.colors.onPrimary,
				backgroundColor: `${lightTheme.colors.primary}80`, // 50% opacity
			};
		}

		const endedColors = getTotalDayTimeColor(currentMinutes);

		return {
			label: 'Jornada finalizada',
			color: endedColors.text,
			backgroundColor: endedColors.container,
		};
	};

	const getCurrentTimeText = () => {
		if (!currentRegistration) return '';
		if (isActive) {
			if (currentMinutes > 0 && currentMinutes < targetMinutes) {
				return `Quedan ${formatTime(targetMinutes - currentMinutes)}`;
			}
			if (currentMinutes > 0 && currentMinutes > targetMinutes) {
				return `Excedido: ${formatTime(currentMinutes - targetMinutes)}`;
			}
		} else {
			if (currentMinutes > 0 && currentMinutes < targetMinutes) {
				return `Tiempo restante: ${formatTime(targetMinutes - currentMinutes)}`;
			}
			if (currentMinutes > 0 && currentMinutes > targetMinutes) {
				return `Tiempo excedido: ${formatTime(currentMinutes - targetMinutes)}`;
			}
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const handlePress = () => {
		if (onPress) {
			onPress();
		} else if (user?.id) {
			router.push(`/drivers/${user.id}/time-registration`);
		}
	};

	const currentMinutes = getCurrentMinutes();
	const targetMinutes = 480; // 8 hours
	const activeRange = getActiveRange();
	const isActive = !!activeRange;
	const isPaused = !activeRange && currentRegistration?.isActive;
	const isFinished = currentRegistration && !currentRegistration.isActive;
	const statusInfo = getStatusInfo();

	let circleColor: string;

	if (!currentRegistration || currentMinutes === 0) {
		circleColor = lightTheme.colors.outline;
	} else if (isActive) {
		circleColor = lightTheme.colors.primary;
	} else if (isPaused) {
		circleColor = `${lightTheme.colors.primary}80`;
	} else if (isFinished) {
		circleColor = getTotalDayTimeColor(currentMinutes).container;
	} else {
		circleColor = lightTheme.colors.outline;
	}

	// Calculate progress for mini chart
	const progress = Math.min(currentMinutes / targetMinutes, 1);
	const size = 100;
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDashoffset = circumference - progress * circumference;

	return (
		<>
			<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
				<View style={styles.container}>

					{loadingRegistration ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" color={lightTheme.colors.primary} />
						</View>
					) : (
						<>
							<View style={styles.chartContainer}>
								<Svg width={size} height={size}>
									{/* Background circle */}
									<Circle
										cx={size / 2}
										cy={size / 2}
										r={radius}
										stroke={`${lightTheme.colors.outline}50`}
										strokeWidth={strokeWidth}
										fill="none"
									/>

									{/* Progress circle */}
									<Circle
										cx={size / 2}
										cy={size / 2}
										r={radius}
										stroke={circleColor}
										strokeWidth={strokeWidth}
										fill="none"
										strokeDasharray={`${circumference} ${circumference}`}
										strokeDashoffset={strokeDashoffset}
										strokeLinecap="round"
										rotation="-90"
										origin={`${size / 2}, ${size / 2}`}
									/>
								</Svg>

								<View style={styles.chartCenter}>
									<Text style={styles.chartTime}>{formatTime(currentMinutes)}</Text>
								</View>
							</View>


							<View style={styles.content}>
								<View style={styles.row}>
									<IconBadge color={lightTheme.colors.primary} size={20} Icon={Clock} badgeSize={10} badgeColor={lightTheme.colors.primary} BadgeIcon={Info} />
									<Text style={styles.title}>Registro de hoy</Text>
								</View>

								{/* Status badge */}
								<View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
									<Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
										{statusInfo.label}
									</Text>
								</View>

								<View style={[styles.row, { flex: 1, width: '100%', }]}>
									<Text style={styles.remainingText}>
										{getCurrentTimeText()}
									</Text>
								</View>
							</View>

							<View style={styles.chevronIndicator}>
								<ChevronRight size={24} strokeWidth={2.5} color={lightTheme.colors.primary} />
							</View>
						</>
					)
					}
				</View>
			</TouchableOpacity >
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	chevronIndicator: {
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	title: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	loadingContainer: {
		height: 100,
		flex: 1,
		paddingVertical: spacing.lg,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		gap: spacing.sm,
	},
	chartContainer: {
		position: 'relative',
	},
	chartCenter: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	chartTime: {
		fontSize: typography.titleSmall,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
	},
	details: {
		flex: 1,
		gap: spacing.xs,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	statusText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	statusTextInactive: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurfaceVariant,
	},
	remainingText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.sm,
		alignSelf: 'flex-start',
	},
	statusBadgeText: {
		fontSize: typography.labelSmall,
		fontWeight: '600',
	},
});