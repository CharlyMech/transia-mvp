import { ActionsModal } from '@/components/ActionsModal';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { IconBadge } from '@/components/IconBadge';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { SkeletonList } from '@/components/skeletons';
import { StatusLabel } from '@/components/StatusLabel';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { roundness, spacing, typography } from '@/constants/theme';
import { useActionsModal } from '@/hooks/useActionsModal';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Driver } from '@/models/driver';
import { useDriversStore } from '@/stores/useDriversStore';
import { getDriverStatusIcon } from '@/utils/driversUtils';
import { router } from 'expo-router';
import {
	CalendarClock,
	Check,
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	ExternalLink,
	Pause,
	Plus,
	RefreshCcw,
	Search,
	Stethoscope,
	Trash2,
	UserRound,
	X
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Easing,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SortOption = 'name' | 'registrationDate' | 'status';
type SortOrder = 'asc' | 'desc';

export default function DriversScreen() {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	const drivers = useDriversStore((state) => state.drivers);
	const loading = useDriversStore((state) => state.loading);
	const selectedDriver = useDriversStore((state) => state.selectedDriver);

	const setSelectedDriver = useDriversStore((state) => state.setSelectedDriver);
	const clearSelectedDriver = useDriversStore((state) => state.clearSelectedDriver);
	const updateDriver = useDriversStore((state) => state.updateDriver);
	const deleteDriver = useDriversStore((state) => state.deleteDriver);

	// Search and filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [filterStatuses, setFilterStatuses] = useState<Set<DriverStatus>>(new Set());
	const [sortBy, setSortBy] = useState<SortOption>('name');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	const actionsModal = useActionsModal();
	const statusModal = useActionsModal();
	const confirmationModal = useActionsModal();

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

	// Toggle status filter (multiselection)
	const toggleStatusFilter = (status: DriverStatus) => {
		setFilterStatuses((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(status)) {
				newSet.delete(status);
			} else {
				newSet.add(status);
			}
			return newSet;
		});
	};

	// Clear all status filters
	const clearStatusFilters = () => {
		setFilterStatuses(new Set());
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
	}, [searchQuery, filterStatuses, sortBy, sortOrder]);

	// Filter and sort drivers
	const filteredDrivers = useMemo(() => {
		let result = [...drivers];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((driver) => {
				const fullName = `${driver.name} ${driver.surnames}`.toLowerCase();
				const phone = driver.phone?.toLowerCase() || '';
				const personId = driver.personId.toLowerCase();
				const email = driver.email?.toLowerCase() || '';

				return (
					fullName.includes(query) ||
					phone.includes(query) ||
					personId.includes(query) ||
					email.includes(query)
				);
			});
		}

		// Apply status filter (multiselection)
		if (filterStatuses.size > 0) {
			result = result.filter((driver) => filterStatuses.has(driver.status));
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					const nameA = `${a.name} ${a.surnames}`.toLowerCase();
					const nameB = `${b.name} ${b.surnames}`.toLowerCase();
					comparison = nameA.localeCompare(nameB);
					break;
				case 'registrationDate':
					comparison = a.registrationDate.getTime() - b.registrationDate.getTime();
					break;
				case 'status':
					comparison = a.status.localeCompare(b.status);
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return result;
	}, [drivers, searchQuery, filterStatuses, sortBy, sortOrder]);

	const handleLongPress = (driver: Driver) => {
		setSelectedDriver(driver);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedDriver();
	};

	const handleViewDriver = () => {
		if (selectedDriver) {
			router.push(`/drivers/${selectedDriver.id}`);
			handleCloseActionsModal();
		}
	};

	const handleCloseStatusModal = () => {
		statusModal.close();
		clearSelectedDriver();
	};

	const handleChangeStatus = () => {
		actionsModal.close();
		statusModal.open();
	};

	const handleUpdateDriverStatus = (status: DriverStatus) => {
		if (selectedDriver) {
			updateDriver(selectedDriver.id, { status });
			handleCloseStatusModal();
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedDriver) {
			await deleteDriver(selectedDriver.id);
			clearSelectedDriver();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedDriver();
	};

	const clearSearch = () => {
		setSearchQuery('');
	};

	const getStatusLabel = (status: DriverStatus): string => {
		const labels: Record<DriverStatus, string> = {
			[DriverStatus.ACTIVE]: 'Activo',
			[DriverStatus.INACTIVE]: 'Inactivo',
			[DriverStatus.SICK_LEAVE]: 'De baja',
			[DriverStatus.HOLIDAYS]: 'Vacaciones',
		};
		return labels[status];
	};

	const getSortLabel = (sort: SortOption): string => {
		const labels: Record<SortOption, string> = {
			name: 'Nombre',
			registrationDate: 'F. registro',
			status: 'Estado',
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
						<Search size={20} color={theme.colors.onSurfaceVariant} />
						<TextInput
							style={styles.searchInput}
							placeholder="Buscar conductores..."
							placeholderTextColor={theme.colors.onSurfaceVariant}
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{searchQuery.length > 0 && (
							<Pressable onPress={clearSearch} style={styles.clearButton}>
								<X size={18} color={theme.colors.onSurfaceVariant} />
							</Pressable>
						)}
						{isSearching && (
							<ActivityIndicator size="small" color={theme.colors.primary} />
						)}
					</View>
					<ElevatedButton
						backgroundColor={theme.colors.primary}
						icon={Plus}
						iconSize={22}
						iconColor={theme.colors.onPrimary}
						label="Nuevo"
						fontSize={typography.bodyMedium}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						rounded={roundness.sm}
						shadow="none"
						onPress={() => router.push("/drivers/new-driver")}
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
							<ChevronUp size={20} color={theme.colors.onSurface} />
						) : (
							<ChevronDown size={20} color={theme.colors.onSurface} />
						)}
					</View>
				</TouchableOpacity>

				<Animated.View
					style={[
						styles.filtersContainer,
						{
							maxHeight: animatedMaxHeight,
							opacity: animatedOpacity,
						}
					]}
					pointerEvents={isFiltersExpanded ? 'auto' : 'none'}
				>
					<View style={styles.filtersContent}>
						<View style={styles.filterSection}>
							<View style={styles.filterSectionHeader}>
								<Text style={styles.filterLabel}>Estado del conductor</Text>
								{filterStatuses.size > 0 && (
									<Pressable onPress={clearStatusFilters}>
										<Text style={styles.clearFiltersText}>Limpiar</Text>
									</Pressable>
								)}
							</View>
							<View style={styles.statusChipsGrid}>
								{Object.values(DriverStatus).map((status) => {
									const isSelected = filterStatuses.has(status);
									const StatusIcon = getDriverStatusIcon(status);

									return (
										<Pressable
											key={status}
											style={[
												styles.statusChip,
												{
													backgroundColor: isSelected ? theme.colors.secondaryContainer : theme.colors.surface,
													borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
												},
											]}
											onPress={() => toggleStatusFilter(status)}
										>
											<StatusIcon
												size={16}
												color={theme.colors.onSurface}
											/>
											<Text
												style={[
													styles.statusChipText,
													{ color: theme.colors.onSurface },
												]}
											>
												{getStatusLabel(status)}
											</Text>
										</Pressable>
									);
								})}
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
											<ChevronsUp size={18} color={theme.colors.primary} />
										) : (
											<ChevronsDown size={18} color={theme.colors.primary} />
										)}
									</View>
								</Pressable>
							</View>
							<View style={styles.sortOptionsGrid}>
								{(['name', 'registrationDate', 'status'] as const).map((option) => {
									const isSelected = sortBy === option;

									return (
										<Pressable
											key={option}
											style={[
												styles.sortOptionChip,
												{
													backgroundColor: isSelected ? theme.colors.secondaryContainer : theme.colors.surface,
													borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
												},
											]}
											onPress={() => setSortBy(option)}
										>
											<Text
												style={[
													styles.sortOptionText,
													{ color: theme.colors.onSurface },
												]}
											>
												{getSortLabel(option)}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>
					</View>
				</Animated.View>

				{!loading && (
					<View style={styles.resultsInfo}>
						<Text style={styles.resultsText}>
							{filteredDrivers.length} {filteredDrivers.length === 1 ? 'conductor' : 'conductores'}
							{searchQuery && ` para "${searchQuery}"`}
							{filterStatuses.size > 0 && ` · ${filterStatuses.size} filtro${filterStatuses.size > 1 ? 's' : ''} activo${filterStatuses.size > 1 ? 's' : ''}`}
						</Text>
					</View>
				)}
			</View>

			{loading ? (
				<SkeletonList count={8} cardHeight={100} />
			) : isSearching ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
					<Text style={styles.loadingText}>Buscando...</Text>
				</View>
			) : filteredDrivers.length === 0 ? (
				<View style={styles.emptyContainer}>
					<UserRound size={64} color={theme.colors.onSurfaceVariant} />
					<Text style={styles.emptyTitle}>
						{searchQuery || filterStatuses.size > 0
							? 'No se encontraron conductores'
							: 'No hay conductores registrados'}
					</Text>
					<Text style={styles.emptySubtitle}>
						{searchQuery || filterStatuses.size > 0
							? 'Intenta ajustar los filtros de búsqueda'
							: 'Añade tu primer conductor usando el botón "Nuevo"'}
					</Text>
				</View>
			) : (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					onScroll={(event) => {
						const currentOffset = event.nativeEvent.contentOffset.y;
						if (currentOffset > 10 && isFiltersExpanded) {
							toggleFilters();
						}
					}}
				>
					{filteredDrivers.map((item) => {
						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/drivers/${item.id}`)}
								onLongPress={() => handleLongPress(item)}
								paddingX={spacing.sm}
								paddingY={spacing.sm}
								shadow='none'
								backgroundColor={theme.colors.surface}
								style={styles.driverCard}
							>
								<View style={styles.cardContent}>
									<View style={styles.avatarContainer}>
										{item.imageUrl ? (
											<Image
												source={{ uri: item.imageUrl }}
												style={styles.avatar}
											/>
										) : (
											<Card
												paddingX={0}
												paddingY={0}
												rounded={roundness.xs}
												shadow='none'
												backgroundColor={`${theme.colors.primary}CC`}
											>
												<IconPlaceholder
													color={theme.colors.onPrimary}
													icon={UserRound}
													size={80}
												/>
											</Card>
										)}
									</View>
									<View style={styles.driverInfo}>
										<View style={styles.driverHeader}>
											<Text
												style={styles.driverName}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{item.name} {item.surnames}
											</Text>
											<StatusLabel
												status={item.status}
												Icon={getDriverStatusIcon(item.status)}
											/>
										</View>
										<Text style={styles.driverPhone}>Teléfono: {item.phone}</Text>
										<View style={styles.driverFooter}>
											<Text style={styles.driverDate}>
												Registrado en: {item.registrationDate.toLocaleDateString()}
											</Text>
										</View>
									</View>
								</View>
							</Card>
						);
					})}
				</ScrollView>
			)}

			{selectedDriver && (
				<>
					<ActionsModal
						visible={actionsModal.visible}
						onClose={handleCloseActionsModal}
						title="Acciones"
						animationType="none"
					>
						<View style={styles.modalContent}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleViewDriver}
							>
								<ExternalLink size={22} color={theme.colors.onSurface} />
								<Text style={styles.actionText}>Ver conductor</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleChangeStatus}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={RefreshCcw}
									size={22}
									color={theme.colors.onBackground}
									badgeSize={12}
									badgeColor={theme.colors.onBackground}
									badgeBackgroundColor={theme.colors.background}
								/>
								<Text style={styles.actionText}>Cambiar estado del conductor</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.dangerAction]}
								onPress={handleRequestDelete}
							>
								<Trash2 size={22} color={theme.colors.error} />
								<Text style={[styles.actionText, styles.dangerText]}>
									Eliminar
								</Text>
							</TouchableOpacity>
						</View>
					</ActionsModal>

					<ActionsModal
						visible={statusModal.visible}
						onClose={handleCloseStatusModal}
						animationType="none"
					>
						<View style={[styles.modalContent, { marginTop: spacing.md }]}>
							<TouchableOpacity
								style={[styles.actionButton, styles.successAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.ACTIVE)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={Check}
									size={22}
									color={theme.colors.statusActive}
									badgeSize={12}
									badgeColor={theme.colors.statusActive}
									badgeBackgroundColor={theme.colors.statusActiveContainer}
								/>
								<Text style={styles.actionText}>Dar de alta</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setSickAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.SICK_LEAVE)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={Stethoscope}
									size={22}
									color={theme.colors.statusSickLeave}
									badgeSize={12}
									badgeColor={theme.colors.statusSickLeave}
									badgeBackgroundColor={theme.colors.statusSickLeaveContainer}
								/>
								<Text style={[styles.actionText, styles.setSickText]}>Dar de baja</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setHolidaysAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.HOLIDAYS)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={CalendarClock}
									size={22}
									color={theme.colors.statusHolidays}
									badgeSize={12}
									badgeColor={theme.colors.statusHolidays}
									badgeBackgroundColor={theme.colors.statusHolidaysContainer}
								/>
								<Text style={[styles.actionText, styles.setHolidaysText]}>Asignar vacaciones</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setInactiveAction]}
								onPress={() => handleUpdateDriverStatus(DriverStatus.INACTIVE)}
							>
								<IconBadge
									Icon={UserRound}
									BadgeIcon={Pause}
									size={22}
									color={theme.colors.onBackground}
									badgeSize={12}
									badgeColor={theme.colors.onBackground}
									badgeBackgroundColor={theme.colors.background}
								/>
								<Text style={[styles.actionText, styles.setInactiveText]}>Poner como inactivo</Text>
							</TouchableOpacity>
						</View>
					</ActionsModal>

					<ConfirmationModal
						visible={confirmationModal.visible}
						onClose={handleCancelDelete}
						onConfirm={handleConfirmDelete}
						title="¿Eliminar chófer?"
						message="Esta acción no se puede deshacer. El chófer será eliminado permanentemente."
						confirmText="Eliminar"
						cancelText="Cancelar"
					/>
				</>
			)}
		</SafeAreaView>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	headerWrapper: {
		width: "100%",
		backgroundColor: theme.colors.background,
		shadowColor: theme.colors.shadow,
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
		backgroundColor: theme.colors.background,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.surface,
		borderRadius: roundness.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		gap: spacing.xs,
	},
	searchInput: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurface,
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
		color: theme.colors.onSurface,
	},
	filtersHeaderRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	activeFiltersBadge: {
		backgroundColor: theme.colors.secondary,
		borderRadius: roundness.full,
		minWidth: 20,
		height: 20,
		paddingHorizontal: spacing.xs,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeFiltersText: {
		fontSize: typography.labelSmall,
		fontWeight: '700',
		color: theme.colors.onPrimary,
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
		color: theme.colors.onSurface,
	},
	clearFiltersText: {
		fontSize: typography.bodySmall,
		fontWeight: '600',
		color: theme.colors.primary,
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
		minWidth: 190,
		flexGrow: 1,
		flexShrink: 1,
		maxWidth: 280,
	},
	statusChipText: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		flex: 1,
	},
	sortOptionsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.xs,
		justifyContent: 'space-between',
	},
	sortOptionChip: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: theme.colors.surface,
		borderWidth: 1.5,
		borderColor: theme.colors.outline,
		flexBasis: '32%',
		flexGrow: 1,
		minHeight: 44,
	},
	sortOptionChipActive: {
		backgroundColor: theme.colors.secondaryContainer,
		borderColor: theme.colors.primary,
	},
	sortOptionText: {
		width: '100%',
		textAlign: 'center',
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: theme.colors.onSurface,
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
		backgroundColor: theme.colors.surface,
	},
	activeFilterCardPressed: {
		opacity: 0.9,
	},
	activeFilterCardText: {
		fontSize: 14,
		fontWeight: '600',
		color: theme.colors.onSurface,
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
		color: theme.colors.onSurfaceVariant,
		fontWeight: '500',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.md,
	},
	loadingText: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacing.xl,
		gap: spacing.md,
	},
	emptyTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: theme.colors.onSurface,
		textAlign: 'center',
	},
	emptySubtitle: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	scrollView: {
		width: "100%",
	},
	scrollContent: {
		padding: spacing.sm,
		gap: spacing.sm,
	},
	driverCard: {
		height: 100,
	},
	cardContent: {
		width: "100%",
		height: "100%",
		flex: 1,
		flexDirection: "row",
		gap: spacing.md,
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: roundness.xs,
	},
	driverInfo: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		gap: spacing.sm,
	},
	driverHeader: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	driverName: {
		fontSize: typography.titleMedium,
		fontWeight: "600",
		flex: 1,
		color: theme.colors.onSurface,
	},
	driverPhone: {
		fontSize: typography.bodyMedium,
		opacity: 0.7,
		color: theme.colors.onSurface,
	},
	driverFooter: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		gap: spacing.xs,
	},
	driverDate: {
		fontSize: typography.bodySmall,
		opacity: 0.7,
		color: theme.colors.onSurface,
	},
	modalContent: {
		gap: spacing.sm,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: theme.colors.background,
		gap: spacing.md,
	},
	actionText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onSurface,
	},
	dangerAction: {
		backgroundColor: theme.colors.errorContainer,
	},
	dangerText: {
		color: theme.colors.error,
	},
	successAction: {
		backgroundColor: theme.colors.statusActiveContainer,
	},
	successText: {
		color: theme.colors.statusActive,
	},
	setHolidaysAction: {
		backgroundColor: theme.colors.statusHolidaysContainer,
	},
	setHolidaysText: {
		color: theme.colors.statusHolidays,
	},
	setInactiveAction: {
		backgroundColor: theme.colors.background,
	},
	setInactiveText: {
		color: theme.colors.onBackground,
	},
	setSickAction: {
		backgroundColor: theme.colors.statusSickLeaveContainer,
	},
	setSickText: {
		color: theme.colors.statusSickLeave,
	},
});