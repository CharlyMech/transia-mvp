import { Accordion } from '@/components/Accordion';
import { Card } from '@/components/Card';
import { ElevatedButton } from '@/components/ElevatedButton';
import { SkeletonDetail } from '@/components/skeletons';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { calculateCurrentMinutes, formatDateToDisplay, getTotalDayTimeColor } from '@/utils/dateUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react-native';
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

export default function TimeHistoryScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const user = useAuthStore((state) => state.user);

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

	// Group registrations by month and year
	const groupedRegistrations: GroupedRegistrations[] = useMemo(() => {
		if (!registrations || registrations.length === 0) return [];

		const groups: { [key: string]: any[] } = {};

		registrations.forEach((reg) => {
			const date = new Date(reg.date);
			const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

			if (!groups[monthYear]) {
				groups[monthYear] = [];
			}
			groups[monthYear].push(reg);
		});

		// Convert to array and sort by date (most recent first)
		const groupedArray = Object.entries(groups).map(([monthYear, regs]) => {
			const [year, month] = monthYear.split('-');
			const monthNames = [
				'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
				'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
			];
			const displayName = `${monthNames[parseInt(month) - 1]} ${year}`;

			// Sort registrations within the month by date (most recent first)
			const sortedRegs = regs.sort((a, b) => {
				const dateA = new Date(a.date).getTime();
				const dateB = new Date(b.date).getTime();
				return dateB - dateA;
			});

			// Calculate total minutes for the month
			const totalMinutes = sortedRegs.reduce((sum, reg) => {
				const ranges = Array.isArray(reg.timeRanges) ? reg.timeRanges : [];
				return sum + calculateCurrentMinutes(ranges, new Date());
			}, 0);

			// Calculate expected minutes (8 hours per day with registration)
			const expectedMinutes = sortedRegs.length * 480;

			return {
				monthYear,
				displayName,
				registrations: sortedRegs,
				totalMinutes,
				expectedMinutes
			};
		});

		// Sort by month-year (most recent first)
		return groupedArray.sort((a, b) => b.monthYear.localeCompare(a.monthYear));
	}, [registrations]);

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
			return lightTheme.colors.success;
		}

		// Acceptable range: ±59 minutes per day on average
		const acceptableRange = (expectedMinutes / 480) * 59;
		if (diff <= acceptableRange) {
			return lightTheme.colors.warning;
		}

		return lightTheme.colors.error;
	};

	// Calculate total statistics
	// const totalStats = useMemo(() => {
	// 	const totalMinutes = groupedRegistrations.reduce((sum, group) => sum + group.totalMinutes, 0);
	// 	const totalExpectedMinutes = groupedRegistrations.reduce((sum, group) => sum + group.expectedMinutes, 0);

	// 	return {
	// 		totalDays: registrations.length,
	// 		totalMonths: groupedRegistrations.length,
	// 		totalHours: formatMinutes(totalMinutes),
	// 		expectedHours: formatMinutes(totalExpectedMinutes),
	// 		variance: totalMinutes - totalExpectedMinutes,
	// 	};
	// }, [groupedRegistrations, registrations.length]);

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
				barStyle="dark-content"
				backgroundColor={lightTheme.colors.background}
				translucent={false}
			/>

			{/* Header */}
			<View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
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
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Driver Info */}
				<View style={styles.driverInfo}>
					<Text style={styles.driverName}>
						{currentDriver.name} {currentDriver.surnames || ''}
					</Text>
					<Text style={styles.driverSubtitle}>
						Historial de registros horarios
					</Text>
				</View>

				{/* Empty State */}
				{groupedRegistrations.length === 0 ? (
					<Card
						paddingX={spacing.md}
						paddingY={spacing.xl}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.emptyState}>
							<Calendar size={48} color={lightTheme.colors.onSurfaceVariant} />
							<Text style={styles.emptyStateText}>
								No hay registros horarios disponibles
							</Text>
						</View>
					</Card>
				) : (
					<>
						{/* Summary Card - Table Style */}
						{/* ??? TODO ??? */}
						{/* <Card
							paddingX={spacing.md}
							paddingY={spacing.md}
							rounded={roundness.sm}
							shadow="small"
							backgroundColor={lightTheme.colors.surface}
						>
							<Text style={styles.summaryTitle}>Resumen General</Text>

							<View style={[styles.summaryTableRow, styles.summaryTableHeader]}>
								<Text style={styles.summaryTableHeaderText}>Concepto</Text>
								<Text style={[styles.summaryTableHeaderText, { textAlign: 'right' }]}>Valor</Text>
							</View>

							<View style={styles.summaryTableRow}>
								<Text style={styles.summaryTableLabel}>Total de días registrados</Text>
								<Text style={styles.summaryTableValue}>{totalStats.totalDays}</Text>
							</View>

							<View style={styles.summaryTableRow}>
								<Text style={styles.summaryTableLabel}>Meses con registros</Text>
								<Text style={styles.summaryTableValue}>{totalStats.totalMonths}</Text>
							</View>

							<View style={styles.summaryTableRow}>
								<Text style={styles.summaryTableLabel}>Total horas trabajadas</Text>
								<Text style={styles.summaryTableValue}>{totalStats.totalHours}</Text>
							</View>

							<View style={styles.summaryTableRow}>
								<Text style={styles.summaryTableLabel}>Total horas esperadas</Text>
								<Text style={styles.summaryTableValue}>{totalStats.expectedHours}</Text>
							</View>

							<View style={[styles.summaryTableRow, styles.summaryTableRowLast]}>
								<Text style={[styles.summaryTableLabel, { fontWeight: '600' }]}>Diferencia</Text>
								<Text style={[
									styles.summaryTableValue,
									{
										fontWeight: '700',
										color: totalStats.variance >= 0
											? lightTheme.colors.success
											: lightTheme.colors.error
									}
								]}>
									{totalStats.variance >= 0 ? '+' : ''}{formatMinutes(Math.abs(totalStats.variance))}
								</Text>
							</View>
						</Card> */}

						{/* Grouped Registrations with Accordion */}
						{groupedRegistrations.map((group) => {
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
										backgroundColor={lightTheme.colors.surface}
									>
										{/* Table Header */}
										<View style={[styles.tableRow, styles.tableHeader]}>
											<Text style={[styles.cellDate, styles.headerText]}>Fecha</Text>
											<Text style={[styles.cellTotal, styles.headerText]}>Total</Text>
										</View>

										{/* Registrations */}
										{group.registrations.map((reg) => {
											const dateLabel = formatDateToDisplay(reg.date);
											const ranges = Array.isArray(reg.timeRanges) ? reg.timeRanges : [];
											const totalMinutes = calculateCurrentMinutes(ranges, new Date());
											const colorInfo = getTotalDayTimeColor(totalMinutes);

											return (
												<Pressable
													key={reg.id ?? `${dateLabel}`}
													style={({ pressed }) => [
														styles.tableRow,
														styles.tableRowClickable,
														pressed && { backgroundColor: `${lightTheme.colors.outline}33` }
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
													<ChevronRight size={16} color={lightTheme.colors.onSurface} />
												</Pressable>
											);
										})}
									</Card>
								</Accordion>
							);
						})}
					</>
				)}
			</ScrollView>
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
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		backgroundColor: 'transparent',
	},
	headerTitle: {
		fontSize: typography.titleLarge,
		fontWeight: '600',
		color: lightTheme.colors.onBackground,
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
		color: lightTheme.colors.onBackground,
		marginBottom: spacing.xs,
	},
	driverSubtitle: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
	},
	emptyState: {
		alignItems: 'center',
		gap: spacing.md,
	},
	emptyStateText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
		fontStyle: 'italic',
	},
	summaryTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.md,
	},
	summaryTableRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.outlineVariant,
	},
	summaryTableRowLast: {
		borderBottomWidth: 0,
		paddingTop: spacing.md,
		borderTopWidth: 2,
		borderTopColor: lightTheme.colors.outline,
	},
	summaryTableHeader: {
		borderBottomWidth: 2,
		borderBottomColor: lightTheme.colors.outline,
		paddingBottom: spacing.xs,
		marginBottom: spacing.xs,
	},
	summaryTableHeaderText: {
		fontSize: typography.labelLarge,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	summaryTableLabel: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
	},
	summaryTableValue: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	accordionHeader: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
	},
	accordionContent: {
		backgroundColor: lightTheme.colors.surface,
		marginTop: 0,
		borderBottomRightRadius: roundness.sm,
		borderBottomLeftRadius: roundness.sm,
	},
	monthTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	monthSubtitle: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
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
		color: lightTheme.colors.onSurfaceVariant,
	},
	separator: {
		marginHorizontal: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.primary,
	},
	tableHeader: {
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.outline,
		marginBottom: spacing.xs,
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: spacing.sm,
		gap: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: `${lightTheme.colors.outline}33`,
	},
	tableRowClickable: {
		borderRadius: roundness.xs,
		paddingHorizontal: spacing.xs,
	},
	cellDate: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
	},
	cellTotal: {
		flex: 1,
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		textAlign: 'center',
	},
	headerText: {
		fontWeight: '600',
		color: lightTheme.colors.onSurfaceVariant,
		fontSize: typography.labelMedium,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
	},
});