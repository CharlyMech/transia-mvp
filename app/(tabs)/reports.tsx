import { router } from 'expo-router';
import { BellDot, Check, CheckCheck, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, ExternalLink, EyeOff, FileClock, MapPin, MapPinOff, Plus, Search, Trash2, TriangleAlert, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionsModal } from '@/components/ActionsModal';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { SkeletonList } from '@/components/skeletons';

import { ElevatedButton } from '@/components/ElevatedButton';
import { StatusLabel } from '@/components/StatusLabel';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useReportsStore } from '@/stores/useReportsStore';
import { getReportActiveStatusIcon, getReportTypeIcon } from '@/utils/reportsUtils';

type SortOption = 'createdAt' | 'readAt' | 'closedAt';
type SortOrder = 'asc' | 'desc';


export default function ReportsScreen() {
	const reports = useReportsStore((state) => state.reports);
	const loading = useReportsStore((state) => state.loading);
	const selectedReport = useReportsStore((state) => state.selectedReport);

	const setSelectedReport = useReportsStore((state) => state.setSelectedReport);
	const clearSelectedReport = useReportsStore((state) => state.clearSelectedReport);
	const deleteReport = useReportsStore((state) => state.deleteReport);
	const updateReport = useReportsStore((state) => state.updateReport);

	// Search and filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [filterHasLocation, setFilterHasLocation] = useState<boolean | null>(null);
	const [filterTitles, setFilterTitles] = useState<Set<string>>(new Set());
	const [filterRead, setFilterRead] = useState<boolean | null>(null);
	const [filterActive, setFilterActive] = useState<boolean | null>(null);
	const [sortBy, setSortBy] = useState<SortOption>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	const actionsModal = useActionsModal();
	const confirmationModal = useActionsModal();

	// Get unique report titles (types)
	const reportTitles = useMemo(() => {
		const titles = new Set(reports.map(r => r.title));
		return Array.from(titles).sort();
	}, [reports]);

	// Toggle filters with animation
	const toggleFilters = () => {
		if (isFiltersExpanded) {
			Animated.timing(filterHeight, {
				toValue: 0,
				duration: 300,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start(() => {
				setIsFiltersExpanded(false);
			});
		} else {
			setIsFiltersExpanded(true);
			Animated.timing(filterHeight, {
				toValue: 1,
				duration: 300,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}).start();
		}
	};

	// Toggle title filter
	const toggleTitleFilter = (title: string) => {
		setFilterTitles((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(title)) {
				newSet.delete(title);
			} else {
				newSet.add(title);
			}
			return newSet;
		});
	};

	// Clear filters
	const clearTitleFilters = () => {
		setFilterTitles(new Set());
	};

	// Toggle sort order
	const toggleSortOrder = () => {
		setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
	};

	// Simulate search delay for better UX
	useEffect(() => {
		if (searchQuery) {
			setIsSearching(true);
			const timer = setTimeout(() => {
				setIsSearching(false);
			}, 300);
			return () => clearTimeout(timer);
		} else {
			setIsSearching(false);
		}
	}, [searchQuery, filterHasLocation, filterTitles, filterRead, filterActive, sortBy, sortOrder]);

	// Filter and sort reports
	const filteredReports = useMemo(() => {
		let result = [...reports];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((report) => {
				const description = report.description?.toLowerCase() || '';
				const vehicleId = report.vehicleId?.toLowerCase() || '';
				const driverId = report.driverId?.toLowerCase() || '';

				return (
					description.includes(query) ||
					vehicleId.includes(query) ||
					driverId.includes(query)
				);
			});
		}

		// Apply location filter
		if (filterHasLocation !== null) {
			result = result.filter((report) =>
				filterHasLocation ? !!report.location : !report.location
			);
		}

		// Apply title filter
		if (filterTitles.size > 0) {
			result = result.filter((report) => filterTitles.has(report.title));
		}

		// Apply read filter
		if (filterRead !== null) {
			result = result.filter((report) => report.read === filterRead);
		}

		// Apply active filter
		if (filterActive !== null) {
			result = result.filter((report) => report.active === filterActive);
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'createdAt':
					comparison = a.createdAt.getTime() - b.createdAt.getTime();
					break;
				case 'readAt':
					const aReadAt = a.readAt?.getTime() || 0;
					const bReadAt = b.readAt?.getTime() || 0;
					comparison = aReadAt - bReadAt;
					break;
				case 'closedAt':
					const aClosedAt = a.closedAt?.getTime() || 0;
					const bClosedAt = b.closedAt?.getTime() || 0;
					comparison = aClosedAt - bClosedAt;
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return result;
	}, [reports, searchQuery, filterHasLocation, filterTitles, filterRead, filterActive, sortBy, sortOrder]);

	const handleLongPress = (report: typeof reports[0]) => {
		setSelectedReport(report);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedReport();
	};

	const handleViewReport = () => {
		if (selectedReport) {
			router.push(`/reports/${selectedReport.id}`);
			handleCloseActionsModal();
		}
	};

	const handleToggleRead = () => {
		if (selectedReport) {
			updateReport(selectedReport.id, { read: !selectedReport.read });
			handleCloseActionsModal();
		}
	};

	const handleToggleActive = () => {
		if (selectedReport) {
			updateReport(selectedReport.id, {
				active: !selectedReport.active,
				closedAt: !selectedReport.active ? null : new Date()
			});
			handleCloseActionsModal();
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedReport) {
			await deleteReport(selectedReport.id);
			clearSelectedReport();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedReport();
	};

	const clearSearch = () => {
		setSearchQuery('');
	};

	const getSortLabel = (sort: SortOption): string => {
		const labels: Record<SortOption, string> = {
			createdAt: 'F. Creación',
			readAt: 'F. Lectura',
			closedAt: 'F. Cierre',
		};
		return labels[sort];
	};

	const animatedMaxHeight = filterHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1000],
		extrapolate: 'clamp',
	});

	const animatedOpacity = filterHeight.interpolate({
		inputRange: [0, 0.3, 1],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp',
	});

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.headerWrapper}>
				<View style={styles.headerContainer}>
					<View style={styles.searchContainer}>
						<Search size={20} color={lightTheme.colors.onSurfaceVariant} />
						<TextInput
							style={styles.searchInput}
							placeholder="Buscar reportes..."
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{searchQuery.length > 0 && (
							<Pressable onPress={clearSearch} style={styles.clearButton}>
								<X size={18} color={lightTheme.colors.onSurfaceVariant} />
							</Pressable>
						)}
						{isSearching && (
							<ActivityIndicator size="small" color={lightTheme.colors.primary} />
						)}
					</View>
					<ElevatedButton
						backgroundColor={lightTheme.colors.primary}
						icon={Plus}
						iconSize={22}
						iconColor={lightTheme.colors.onPrimary}
						label="Nuevo"
						fontSize={typography.bodyMedium}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						rounded={roundness.sm}
						shadow="none"
						onPress={() => router.push("/reports/new-report")}
					/>
				</View>

				<TouchableOpacity
					style={styles.filtersHeader}
					onPress={toggleFilters}
					activeOpacity={0.7}
				>
					<Text style={styles.filtersHeaderText}>Filtros y ordenación</Text>
					<View style={styles.filtersHeaderRight}>
						{isFiltersExpanded ? (
							<ChevronUp size={20} color={lightTheme.colors.onSurface} />
						) : (
							<ChevronDown size={20} color={lightTheme.colors.onSurface} />
						)}
					</View>
				</TouchableOpacity>

				<Animated.View
					style={[
						styles.filtersContainer,
						{
							maxHeight: animatedMaxHeight,
							opacity: animatedOpacity,
						},
					]}
				>
					<View style={styles.filtersContent}>
						<View style={styles.filterSection}>
							<View style={styles.filterSectionHeader}>
								<Text style={styles.filterLabel}>Tipo de reporte</Text>
								{filterTitles.size > 0 && (
									<Pressable onPress={clearTitleFilters}>
										<Text style={styles.clearFiltersText}>Limpiar</Text>
									</Pressable>
								)}
							</View>
							<View style={styles.statusChipsGrid}>
								{reportTitles.map((title) => {
									const isSelected = filterTitles.has(title);
									const TypeIcon = getReportTypeIcon(title);

									return (
										<Pressable
											key={title}
											style={[
												styles.statusChip,
												{
													backgroundColor: isSelected ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
													borderColor: isSelected ? lightTheme.colors.primary : lightTheme.colors.outline,
												},
											]}
											onPress={() => toggleTitleFilter(title)}
										>
											<TypeIcon
												size={16}
												color={lightTheme.colors.onSurface}
											/>
											<Text
												style={[
													styles.statusChipText,
												]}
											>
												{title}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Estado de lectura</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterRead === true ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterRead === true ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterRead(filterRead === true ? null : true)}
								>
									<CheckCheck size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										Leído
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterRead === false ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterRead === false ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterRead(filterRead === false ? null : false)}
								>
									<BellDot size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										No leído
									</Text>
								</Pressable>
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Estado</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterActive === true ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterActive === true ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterActive(filterActive === true ? null : true)}
								>
									<CheckCheck size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										Pendiente
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterActive === false ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterActive === false ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterActive(filterActive === false ? null : false)}
								>
									<FileClock size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										Resuelta
									</Text>
								</Pressable>
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Ubicación</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterHasLocation === true ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterHasLocation === true ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterHasLocation(filterHasLocation === true ? null : true)}
								>
									<MapPin size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										Con ubicación
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										{
											backgroundColor: filterHasLocation === false ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
											borderColor: filterHasLocation === false ? lightTheme.colors.primary : lightTheme.colors.outline,
										},
									]}
									onPress={() => setFilterHasLocation(filterHasLocation === false ? null : false)}
								>
									<MapPinOff size={16} color={lightTheme.colors.onSurface} />
									<Text
										style={[
											styles.statusChipText,
										]}
									>
										Sin ubicación
									</Text>
								</Pressable>
							</View>
						</View>

						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Ordenar por</Text>
							<View style={styles.sortOrderContainer}>
								<Pressable
									onPress={toggleSortOrder}
									style={({ pressed }) => [
										styles.activeFilterCard,
										pressed && styles.activeFilterCardPressed,
									]}
									accessibilityRole="button"
									accessibilityLabel={`Filtro activo ${getSortLabel(sortBy)}. Cambiar orden`}
								>
									<Text style={styles.activeFilterCardText}>
										{`Orden: ${getSortLabel(sortBy)} - ${sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}`}
									</Text>

									<View style={styles.activeFilterCardIcon}>
										{sortOrder === 'asc' ? (
											<ChevronsUp size={18} color={lightTheme.colors.primary} />
										) : (
											<ChevronsDown size={18} color={lightTheme.colors.primary} />
										)}
									</View>
								</Pressable>
							</View>
							<View style={styles.sortOptionsContainer}>
								{(['createdAt', 'readAt', 'closedAt'] as SortOption[]).map((option) => (
									<Pressable
										key={option}
										style={[
											styles.sortOptionChip,
											sortBy === option && styles.sortOptionChipActive,
										]}
										onPress={() => setSortBy(option)}
									>
										<Text
											style={[
												styles.sortOptionText,
												sortBy === option && styles.sortOptionTextActive,
											]}
										>
											{getSortLabel(option)}
										</Text>
									</Pressable>
								))}
							</View>
						</View>
					</View>
				</Animated.View>

				{filteredReports.length > 0 && (
					<View style={styles.resultsInfo}>
						<Text style={styles.resultsText}>{filteredReports.length} reportes</Text>
					</View>
				)}
			</View>

			{loading ? (
				<SkeletonList count={8} cardHeight={100} />
			) : (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{filteredReports.map((item) => (
						<Card
							key={item.id}
							onPress={() => router.push(`/reports/${item.id}`)}
							onLongPress={() => handleLongPress(item)}
							paddingX={spacing.sm}
							paddingY={spacing.sm}
							shadow='none'
							backgroundColor={lightTheme.colors.surface}
							style={styles.reportCard}
						>
							<View style={styles.cardContent}>
								<View style={styles.reportHeader}>
									<Text style={styles.reportTitle}>
										{item.title}
									</Text>

									<StatusLabel
										status={item.active ? "PENDING" : "RESOLVED"}
										Icon={getReportActiveStatusIcon(item.active)}
									/>
								</View>

								<Text
									style={styles.reportVehicle}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									Vehículo: {item.vehicleId}
								</Text>

								<View style={styles.reportFooter}>
									{item.active ?
										(
											<Text
												style={styles.reportDate}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												Fecha de creación: {item.createdAt.toLocaleDateString()}
											</Text>
										)
										:
										(
											<Text
												style={styles.reportDate}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												Cerrada en: {item.closedAt?.toLocaleDateString()}
											</Text>
										)}
								</View>
							</View>
						</Card>
					))}
				</ScrollView>
			)}

			{selectedReport && (
				<>
					<ActionsModal
						visible={actionsModal.visible}
						onClose={handleCloseActionsModal}
						title="Acciones"
					>
						<View style={styles.modalContent}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleViewReport}
							>
								<ExternalLink size={22} color={lightTheme.colors.onSurface} />
								<Text style={styles.actionText}>Ver incidencia</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleToggleRead}
							>
								{selectedReport.read ? (
									<>
										<EyeOff size={22} color={lightTheme.colors.onSurface} />
										<Text style={styles.actionText}>Marcar como no leído</Text>
									</>
								) : (
									<>
										<Check size={22} color={lightTheme.colors.tertiary} />
										<Text style={styles.actionText}>Marcar como leído</Text>
									</>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleToggleActive}
							>
								{selectedReport.active ? (
									<>
										<CheckCheck size={22} color={lightTheme.colors.onSurface} />
										<Text style={styles.actionText}>Marcar como resuelta</Text>
									</>
								) : (
									<>
										<TriangleAlert size={22} color={lightTheme.colors.tertiary} />
										<Text style={styles.actionText}>Marcar como pendiente</Text>
									</>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.actionButton, styles.dangerAction]}
								onPress={handleRequestDelete}
							>
								<Trash2 size={22} color={lightTheme.colors.error} />
								<Text style={[styles.actionText, styles.dangerText]}>
									Eliminar
								</Text>
							</TouchableOpacity>
						</View>
					</ActionsModal>

					<ConfirmationModal
						visible={confirmationModal.visible}
						onClose={handleCancelDelete}
						onConfirm={handleConfirmDelete}
						title="¿Eliminar reporte?"
						message="Esta acción no se puede deshacer. El reporte será eliminado permanentemente."
						confirmText="Eliminar"
						cancelText="Cancelar"
					/>
				</>
			)}
		</SafeAreaView >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	headerWrapper: {
		backgroundColor: lightTheme.colors.background,
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 4,
		zIndex: 10,
	},
	headerContainer: {
		width: "100%",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xs,
		gap: spacing.sm,
		backgroundColor: lightTheme.colors.background,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		gap: spacing.xs,
	},
	searchInput: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
		padding: 0,
	},
	clearButton: {
		padding: spacing.xs,
	},
	filtersHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: spacing.xs,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		backgroundColor: "transparent",
	},
	filtersHeaderText: {
		fontSize: typography.bodySmall,
		fontWeight: '400',
		color: lightTheme.colors.onSurface,
	},
	filtersHeaderRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	filtersContainer: {
		overflow: 'hidden',
	},
	filtersContent: {
		padding: spacing.sm,
		gap: spacing.md,
		backgroundColor: "transparent"
	},
	filterSection: {
		gap: spacing.sm,
	},
	filterSectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	filterLabel: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	clearFiltersText: {
		fontSize: typography.bodySmall,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	statusChipsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.xs,
		justifyContent: 'space-between',
	},
	statusChip: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: roundness.sm,
		borderWidth: 1.5,
		gap: spacing.xs,
		flexBasis: '49%',
		flexGrow: 0,
		flexShrink: 0,
	},
	statusChipText: {
		color: lightTheme.colors.onSurface,
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		flex: 1,
	},
	sortOptionsContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: spacing.xs,
	},
	sortOptionChip: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.surface,
		borderWidth: 1.5,
		borderColor: lightTheme.colors.outline,
	},
	sortOptionChipActive: {
		backgroundColor: lightTheme.colors.secondaryContainer,
		borderColor: lightTheme.colors.primary,
	},
	sortOptionText: {
		width: '100%',
		textAlign: 'center',
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: lightTheme.colors.onSurface,
	},
	sortOptionTextActive: {
		fontWeight: '600',
	},
	sortOrderIcon: {
		padding: spacing.xs,
	},
	sortOrderContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: spacing.xs,
	},
	activeFilterCard: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.surface,
	},
	activeFilterCardPressed: {
		opacity: 0.9,
	},
	activeFilterCardText: {
		fontSize: 14,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	activeFilterCardIcon: {
		marginLeft: spacing.sm,
		alignItems: 'center',
		justifyContent: 'center',
	},
	resultsInfo: {
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.sm,
	},
	resultsText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		fontWeight: '500',
	},
	scrollView: {
		width: "100%",
	},
	scrollContent: {
		padding: spacing.sm,
		gap: spacing.sm,
	},
	reportCard: {
		height: 100,
	},
	cardContent: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		gap: spacing.sm,
	},
	reportHeader: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	reportTitle: {
		fontSize: typography.titleMedium,
		fontWeight: "600"
	},
	reportVehicle: {
		fontSize: typography.bodyMedium,
		fontWeight: "400",
		opacity: 0.7
	},
	reportFooter: {
		width: "100%",
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end"
	},
	reportDate: {
		fontSize: typography.bodySmall,
		fontWeight: "400",
		opacity: 0.7
	},
	modalContent: {
		gap: spacing.sm,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.background,
		gap: spacing.md,
	},
	actionText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	dangerAction: {
		backgroundColor: lightTheme.colors.errorContainer,
	},
	dangerText: {
		color: lightTheme.colors.error,
	},
});