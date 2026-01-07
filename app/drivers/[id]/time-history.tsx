import { Accordion } from '@/components/Accordion';
import { Card } from '@/components/Card';
import { ElevatedButton } from '@/components/ElevatedButton';
import { SkeletonDetail } from '@/components/skeletons';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { calculateCurrentMinutes, formatDateToDisplay, getTotalDayTimeColor } from '@/utils/dateUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GroupedRegistrations {
	monthYear: string;
	displayName: string;
	registrations: any[];
	totalMinutes: number;
	expectedMinutes: number;
}

interface YearGroup {
	year: string;
	months: GroupedRegistrations[];
}

export default function TimeHistoryScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const user = useAuthStore((state) => state.user);
	const { theme, isDark } = useAppTheme();

	const styles = useMemo(() => getStyles(theme), [theme]);
	const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

	const currentDriver = useDriversStore((state) => state.currentDriver);
	const loadingDriver = useDriversStore((state) => state.loadingDriver);
	const driverError = useDriversStore((state) => state.driverError);
	const fetchDriverById = useDriversStore((state) => state.fetchDriverById);

	const registrations = useTimeRegistrationsStore((state) => state.registrations);
	const loading = useTimeRegistrationsStore((state) => state.loading);
	const fetchRegistrationsByDriver = useTimeRegistrationsStore((state) => state.fetchRegistrationsByDriver);

	// Check permissions
	const canViewHistory = user?.role === 'admin' || user?.role === 'manager';
	const isOwnProfile = user?.id === id;

	useEffect(() => {
		// Redirect if user doesn't have permission and it's not their own profile
		if (!canViewHistory && !isOwnProfile) {
			Alert.alert(
				'Acceso denegado',
				'No tienes permisos para ver esta información',
				[
					{
						text: 'Volver',
						onPress: () => router.back()
					}
				]
			);
			return;
		}

		if (id) {
			// Only fetch driver if not already loaded or if it's a different driver
			if (!currentDriver || currentDriver.id !== id) {
				fetchDriverById(id);
			}

			// Always fetch registrations for this specific view
			fetchRegistrationsByDriver(id);
		}

		// No cleanup needed - keep the driver data in store for navigation back
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, canViewHistory, isOwnProfile]);

	// Helper function to calculate minutes with auto-close for past days
	const calculateMinutesWithAutoClose = (registration: any): number => {
		const ranges = Array.isArray(registration.timeRanges) ? registration.timeRanges : [];

		// Get registration date
		const regDate = new Date(registration.date);
		regDate.setHours(0, 0, 0, 0);

		// Get today's date
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// If it's today, calculate with current time
		if (regDate.getTime() >= today.getTime()) {
			return calculateCurrentMinutes(ranges, new Date());
		}

		// For past days, check if there are open ranges
		const hasOpenRange = ranges.some((r: any) => !r.endTime);

		if (!hasOpenRange) {
			// No open ranges, calculate normally
			return calculateCurrentMinutes(ranges, new Date());
		}

		// Close open ranges at 23:59 of that day
		const endOfDay = new Date(regDate);
		endOfDay.setHours(23, 59, 59, 999);

		const closedRanges = ranges.map((range: any) => {
			if (!range.endTime) {
				return {
					...range,
					endTime: endOfDay,
				};
			}
			return range;
		});

		return calculateCurrentMinutes(closedRanges, new Date());
	};

	// Group registrations by month and year - Generate ALL months from registration date to today
	const groupedRegistrations: GroupedRegistrations[] = useMemo(() => {
		if (!currentDriver) return [];

		// Get driver's registration date
		const driverRegDate = new Date(currentDriver.registrationDate);
		driverRegDate.setHours(0, 0, 0, 0);

		// Get current date
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Helper function to count business days in a month range
		const countBusinessDays = (startDate: Date, endDate: Date): number => {
			let count = 0;
			const current = new Date(startDate);

			while (current <= endDate) {
				const dayOfWeek = current.getDay();
				// 0 = Sunday, 6 = Saturday
				if (dayOfWeek !== 0 && dayOfWeek !== 6) {
					count++;
				}
				current.setDate(current.getDate() + 1);
			}

			return count;
		};

		// Group existing registrations by monthYear
		const registrationsByMonth: { [key: string]: any[] } = {};

		if (registrations && registrations.length > 0) {
			registrations.forEach((reg) => {
				const regDate = new Date(reg.date);
				regDate.setHours(0, 0, 0, 0);

				// Only include registrations from registration date onwards
				if (regDate >= driverRegDate) {
					const monthYear = `${regDate.getFullYear()}-${String(regDate.getMonth() + 1).padStart(2, '0')}`;

					if (!registrationsByMonth[monthYear]) {
						registrationsByMonth[monthYear] = [];
					}
					registrationsByMonth[monthYear].push(reg);
				}
			});
		}

		// Generate all months from registration date to current month
		const allMonths: GroupedRegistrations[] = [];
		const current = new Date(driverRegDate.getFullYear(), driverRegDate.getMonth(), 1);
		const endMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		const monthNames = [
			'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
			'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		];

		while (current <= endMonth) {
			const year = current.getFullYear();
			const month = current.getMonth() + 1;
			const monthYear = `${year}-${String(month).padStart(2, '0')}`;
			const displayName = `${monthNames[month - 1]} ${year}`;

			// Get registrations for this month (if any)
			const monthRegs = registrationsByMonth[monthYear] || [];

			// Sort registrations within the month by date (most recent first)
			const sortedRegs = monthRegs.sort((a, b) => {
				const dateA = new Date(a.date).getTime();
				const dateB = new Date(b.date).getTime();
				return dateB - dateA;
			});

			// Calculate total minutes for the month
			const totalMinutes = sortedRegs.reduce((sum, reg) => {
				return sum + calculateMinutesWithAutoClose(reg);
			}, 0);

			// Calculate expected minutes based on business days
			const monthStart = new Date(year, month - 1, 1);
			const monthEnd = new Date(year, month, 0); // Last day of the month

			// Determine the actual start date for this month
			let actualStartDate = monthStart;
			if (monthStart < driverRegDate) {
				actualStartDate = driverRegDate;
			}

			// Determine the actual end date for this month (don't count future days)
			let actualEndDate = monthEnd;
			if (monthEnd > today) {
				actualEndDate = today;
			}

			// Count business days from the actual start date to the actual end date
			const businessDays = countBusinessDays(actualStartDate, actualEndDate);
			const expectedMinutes = businessDays * 480; // 8 hours per business day

			allMonths.push({
				monthYear,
				displayName,
				registrations: sortedRegs,
				totalMinutes,
				expectedMinutes
			});

			// Move to next month
			current.setMonth(current.getMonth() + 1);
		}

		// Sort by month-year (most recent first)
		return allMonths.sort((a, b) => b.monthYear.localeCompare(a.monthYear));
	}, [registrations, currentDriver]);

	// Group months by year
	const groupedByYear: YearGroup[] = useMemo(() => {
		const yearMap: { [year: string]: GroupedRegistrations[] } = {};

		groupedRegistrations.forEach((group) => {
			const year = group.monthYear.split('-')[0];
			if (!yearMap[year]) {
				yearMap[year] = [];
			}
			yearMap[year].push(group);
		});

		// Convert to array and sort by year (most recent first)
		return Object.entries(yearMap)
			.map(([year, months]) => ({ year, months }))
			.sort((a, b) => b.year.localeCompare(a.year));
	}, [groupedRegistrations]);

	const toggleMonth = (monthYear: string) => {
		setExpandedMonths((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(monthYear)) {
				newSet.delete(monthYear);
			} else {
				newSet.add(monthYear);
			}
			return newSet;
		});
	};

	const formatMinutes = (totalMinutes: number) => {
		if (totalMinutes <= 0 || isNaN(totalMinutes)) return '-';
		const hh = Math.floor(totalMinutes / 60);
		const mm = totalMinutes % 60;
		return `${hh}h ${mm}m`;
	};

	const getMonthVarianceColor = (totalMinutes: number, expectedMinutes: number) => {
		const diff = Math.abs(totalMinutes - expectedMinutes);

		// Perfect range: ±15 minutes per day on average
		const perfectRange = (expectedMinutes / 480) * 15;
		if (diff <= perfectRange) {
			return theme.colors.success;
		}

		// Acceptable range: ±59 minutes per day on average
		const acceptableRange = (expectedMinutes / 480) * 59;
		if (diff <= acceptableRange) {
			return theme.colors.warning;
		}

		return theme.colors.error;
	};

	if (loadingDriver || loading) {
		return <SkeletonDetail />;
	}

	// Check access permissions before rendering content
	if (!canViewHistory && !isOwnProfile) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>No tienes permisos para ver esta información</Text>
			</View>
		);
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

			{/* Floating Back Button - Positioned absolutely over content */}
			<View style={[styles.floatingButtonContainer, { paddingTop: insets.top + spacing.sm }]}>
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
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollViewContent,
					{
						paddingTop: insets.top + 60,
						paddingBottom: insets.bottom + spacing.xl
					}
				]}
				showsVerticalScrollIndicator={false}
			>
				{/* Driver Info */}
				<View style={styles.driverInfo}>
					<Text style={styles.driverName}>
						{currentDriver.name} {currentDriver.surnames || ''}
					</Text>
					<Text style={styles.driverSubtitle}>
						Historial completo de registros horarios
					</Text>
				</View>

				{/* Grouped Registrations by Year */}
				{groupedByYear.map((yearGroup) => (
					<View key={yearGroup.year} style={styles.yearGroup}>
						{/* Year Title */}
						<Text style={styles.yearTitle}>{yearGroup.year}</Text>

						{/* Months for this year */}
						<View style={styles.monthsContainer}>
							{yearGroup.months.map((group) => {
								const isExpanded = expandedMonths.has(group.monthYear);
								const varianceColor = getMonthVarianceColor(group.totalMinutes, group.expectedMinutes);

								return (
									<Accordion
										key={group.monthYear}
										title={group.displayName}
										subtitle={`${group.registrations.length} ${group.registrations.length === 1 ? 'día' : 'días'}`}
										isExpanded={isExpanded}
										onToggle={() => toggleMonth(group.monthYear)}
										headerStyle={styles.accordionHeader}
										contentStyle={styles.accordionContent}
										titleStyle={styles.monthTitle}
										subtitleStyle={styles.monthSubtitle}
										rightContent={
											<View style={styles.monthStats}>
												<Text style={[styles.monthTotal, { color: varianceColor }]}>
													{formatMinutes(group.totalMinutes)}
												</Text>
												<Text style={styles.monthExpected}>
													de {formatMinutes(group.expectedMinutes)}
												</Text>
											</View>
										}
									>
										<View style={styles.separator} />
										<Card
											paddingX={spacing.md}
											paddingY={spacing.md}
											rounded={0}
											shadow="none"
											backgroundColor={theme.colors.surface}
										>
											{group.registrations.length === 0 ? (
												<View style={styles.emptyMonthState}>
													<Text style={styles.emptyMonthText}>
														No hay registros para este mes
													</Text>
												</View>
											) : (
												<>
													{/* Table Header */}
													<View style={[styles.tableRow, styles.tableHeader]}>
														<Text style={[styles.cellDate, styles.headerText]}>Fecha</Text>
														<Text style={[styles.cellTotal, styles.headerText]}>Total</Text>
													</View>

													{/* Registrations */}
													{group.registrations.map((reg) => {
														const dateLabel = formatDateToDisplay(reg.date);
														const totalMinutes = calculateMinutesWithAutoClose(reg);
														const colorInfo = getTotalDayTimeColor(totalMinutes, theme);

														return (
															<Pressable
																key={reg.id ?? `${dateLabel}`}
																style={({ pressed }) => [
																	styles.tableRow,
																	styles.tableRowClickable,
																	pressed && { backgroundColor: `${theme.colors.outline}33` }
																]}
																onPress={() => {
																	router.push({
																		pathname: `/drivers/${id}/time-registration` as any,
																		params: { date: reg.date }
																	});
																}}
															>
																<Text style={styles.cellDate}>{dateLabel}</Text>
																<View style={{
																	backgroundColor: colorInfo.container,
																	borderRadius: roundness.xs,
																	paddingHorizontal: spacing.xs,
																	paddingVertical: spacing.xs,
																	alignItems: 'center',
																	minWidth: 120,
																	maxWidth: 120,
																}}>
																	<Text style={[styles.cellTotal, { color: colorInfo.text }]}>{formatMinutes(totalMinutes)}</Text>
																</View>
																<ChevronRight size={16} color={theme.colors.onSurface} />
															</Pressable>
														);
													})}
												</>
											)}
										</Card>
									</Accordion>
								);
							})}
						</View>
					</View>
				))}
			</ScrollView>
		</View>
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
		floatingButtonContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			paddingHorizontal: spacing.md,
			zIndex: 1000,
			backgroundColor: 'transparent',
		},
		scrollView: {
			flex: 1,
		},
		scrollViewContent: {
			padding: spacing.sm,
			gap: spacing.sm,
		},
		driverInfo: {
			marginBottom: spacing.sm,
		},
		driverName: {
			fontSize: typography.headlineMedium,
			fontWeight: '700',
			color: theme.colors.onBackground,
			marginBottom: spacing.xs,
		},
		driverSubtitle: {
			fontSize: typography.bodyLarge,
			color: theme.colors.onSurfaceVariant,
		},
		yearGroup: {
			marginBottom: spacing.md,
		},
		yearTitle: {
			fontSize: typography.headlineSmall,
			fontWeight: '700',
			color: theme.colors.primary,
			marginBottom: spacing.md,
			marginLeft: spacing.xs,
		},
		monthsContainer: {
			gap: spacing.sm,
		},
		emptyMonthState: {
			paddingVertical: spacing.lg,
			alignItems: 'center',
		},
		emptyMonthText: {
			fontSize: typography.bodyMedium,
			color: theme.colors.onSurfaceVariant,
			fontStyle: 'italic',
		},
		accordionHeader: {
			backgroundColor: theme.colors.surface,
			borderRadius: roundness.sm,
		},
		accordionContent: {
			backgroundColor: theme.colors.surface,
			marginTop: 0,
			borderBottomRightRadius: roundness.sm,
			borderBottomLeftRadius: roundness.sm,
		},
		monthTitle: {
			fontSize: typography.titleMedium,
			fontWeight: '600',
			color: theme.colors.onSurface,
		},
		monthSubtitle: {
			fontSize: typography.bodySmall,
			color: theme.colors.onSurfaceVariant,
		},
		monthStats: {
			alignItems: 'flex-end',
		},
		monthTotal: {
			fontSize: typography.titleMedium,
			fontWeight: '600',
		},
		monthExpected: {
			fontSize: typography.bodySmall,
			color: theme.colors.onSurfaceVariant,
		},
		separator: {
			marginHorizontal: spacing.md,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.primary,
		},
		tableHeader: {
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.outline,
			marginBottom: spacing.xs,
		},
		tableRow: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingVertical: spacing.sm,
			gap: spacing.sm,
			borderBottomWidth: 1,
			borderBottomColor: `${theme.colors.outline}33`,
		},
		tableRowClickable: {
			borderRadius: roundness.xs,
			paddingHorizontal: spacing.xs,
		},
		cellDate: {
			flex: 1,
			fontSize: typography.bodyMedium,
			color: theme.colors.onSurface,
		},
		cellTotal: {
			flex: 1,
			fontSize: typography.bodyMedium,
			fontWeight: '600',
			textAlign: 'center',
		},
		headerText: {
			fontWeight: '600',
			color: theme.colors.onSurfaceVariant,
			fontSize: typography.labelMedium,
			textTransform: 'uppercase',
			letterSpacing: 0.5,
		},
		errorText: {
			fontSize: typography.bodyLarge,
			color: theme.colors.error,
		},
	});
}