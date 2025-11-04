import { ActionsModal } from "@/components/ActionsModal";
import { Card } from "@/components/Card";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ElevatedButton } from "@/components/ElevatedButton";
import { IconBadge } from "@/components/IconBadge";
import { IconPlaceholder } from "@/components/IconPlaceholder";
import { SkeletonList } from "@/components/skeletons";
import { StatusLabel } from "@/components/StatusLabel";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { useActionsModal } from "@/hooks/useActionsModal";
import { useFleetStore } from "@/stores/useFleetStore";
import { getVehicleStatusIcon } from "@/utils/fleetUtils";
import { router } from "expo-router";
import { Check, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp, ExternalLink, Pause, Plus, RefreshCcw, Search, Trash2, Truck, Wrench, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SortOption = 'vehicleBrand' | 'vehicleModel' | 'plateNumber' | 'registrationDate' | 'purchaseDate' | 'year';
type SortOrder = 'asc' | 'desc';

export default function FleetScreen() {
	const vehicles = useFleetStore((state) => state.vehicles);
	const loading = useFleetStore((state) => state.loading);
	const selectedVehicle = useFleetStore((state) => state.selectedVehicle);

	const setSelectedVehicle = useFleetStore((state) => state.setSelectedVehicle);
	const clearSelectedVehicle = useFleetStore((state) => state.clearSelectedVehicle);
	const updateVehicle = useFleetStore((state) => state.updateVehicle);
	const deleteVehicle = useFleetStore((state) => state.deleteVehicle);

	// Search and filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [filterStatuses, setFilterStatuses] = useState<Set<VehicleStatus>>(new Set());
	const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set());
	const [sortBy, setSortBy] = useState<SortOption>('vehicleBrand');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	const actionsModal = useActionsModal();
	const statusModal = useActionsModal();
	const confirmationModal = useActionsModal();

	// Get unique vehicle types
	const vehicleTypes = useMemo(() => {
		const types = new Set(vehicles.map(v => v.vehicleType));
		return Array.from(types).sort();
	}, [vehicles]);

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
	const toggleStatusFilter = (status: VehicleStatus) => {
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

	// Toggle type filter
	const toggleTypeFilter = (type: string) => {
		setFilterTypes((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(type)) {
				newSet.delete(type);
			} else {
				newSet.add(type);
			}
			return newSet;
		});
	};

	// Clear all status filters
	const clearStatusFilters = () => {
		setFilterStatuses(new Set());
	};

	// Clear all type filters
	const clearTypeFilters = () => {
		setFilterTypes(new Set());
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
	}, [searchQuery, filterStatuses, filterTypes, sortBy, sortOrder]);

	// Filter and sort vehicles
	const filteredVehicles = useMemo(() => {
		let result = [...vehicles];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((vehicle) => {
				const brand = vehicle.vehicleBrand?.toLowerCase() || '';
				const model = vehicle.vehicleModel?.toLowerCase() || '';
				const plate = vehicle.plateNumber?.toLowerCase() || '';

				return (
					brand.includes(query) ||
					model.includes(query) ||
					plate.includes(query)
				);
			});
		}

		// Apply status filter (multiselection)
		if (filterStatuses.size > 0) {
			result = result.filter((vehicle) => filterStatuses.has(vehicle.status));
		}

		// Apply type filter
		if (filterTypes.size > 0) {
			result = result.filter((vehicle) => filterTypes.has(vehicle.vehicleType));
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'vehicleBrand':
					comparison = (a.vehicleBrand || '').localeCompare(b.vehicleBrand || '');
					break;
				case 'vehicleModel':
					comparison = (a.vehicleModel || '').localeCompare(b.vehicleModel || '');
					break;
				case 'plateNumber':
					comparison = (a.plateNumber || '').localeCompare(b.plateNumber || '');
					break;
				case 'registrationDate':
					comparison = a.registrationDate.getTime() - b.registrationDate.getTime();
					break;
				case 'purchaseDate':
					const aDate = a.purchaseDate?.getTime() || 0;
					const bDate = b.purchaseDate?.getTime() || 0;
					comparison = aDate - bDate;
					break;
				case 'year':
					comparison = (a.year || 0) - (b.year || 0);
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return result;
	}, [vehicles, searchQuery, filterStatuses, filterTypes, sortBy, sortOrder]);

	const handleLongPress = (vehicle: typeof vehicles[0]) => {
		setSelectedVehicle(vehicle);
		actionsModal.open();
	};

	const handleCloseActionsModal = () => {
		actionsModal.close();
		clearSelectedVehicle();
	};

	const handleViewVehicle = () => {
		if (selectedVehicle) {
			router.push(`/fleet/${selectedVehicle.id}`);
			handleCloseActionsModal();
		}
	};

	const handleCloseStatusModal = () => {
		statusModal.close();
		clearSelectedVehicle();
	};

	const handleChangeStatus = () => {
		actionsModal.close();
		statusModal.open();
	};

	const handleUpdateVehicleStatus = (status: VehicleStatus) => {
		if (selectedVehicle) {
			updateVehicle(selectedVehicle.id, { status });
			handleCloseStatusModal();
		}
	};

	const handleRequestDelete = () => {
		actionsModal.close();
		confirmationModal.open();
	};

	const handleConfirmDelete = async () => {
		if (selectedVehicle) {
			await deleteVehicle(selectedVehicle.id);
			clearSelectedVehicle();
		}
	};

	const handleCancelDelete = () => {
		confirmationModal.close();
		clearSelectedVehicle();
	};

	const clearSearch = () => {
		setSearchQuery('');
	};

	const getStatusLabel = (status: VehicleStatus): string => {
		return status;
	};

	const getSortLabel = (sort: SortOption): string => {
		const labels: Record<SortOption, string> = {
			vehicleBrand: 'Marca',
			vehicleModel: 'Modelo',
			plateNumber: 'Matrícula',
			registrationDate: 'F. Registro',
			purchaseDate: 'F. Compra',
			year: 'Año',
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
							placeholder="Buscar vehículos..."
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
						onPress={() => router.push("/fleet/new-vehicle")}
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
								<Text style={styles.filterLabel}>Estado del vehículo</Text>
								{filterStatuses.size > 0 && (
									<Pressable onPress={clearStatusFilters}>
										<Text style={styles.clearFiltersText}>Limpiar</Text>
									</Pressable>
								)}
							</View>
							<View style={styles.statusChipsGrid}>
								{Object.values(VehicleStatus).map((status) => {
									const isSelected = filterStatuses.has(status);
									const StatusIcon = getVehicleStatusIcon(status);

									return (
										<Pressable
											key={status}
											style={[
												styles.statusChip,
												{
													backgroundColor: isSelected ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
													borderColor: isSelected ? lightTheme.colors.primary : lightTheme.colors.outline,
												},
											]}
											onPress={() => toggleStatusFilter(status)}
										>
											<StatusIcon
												size={16}
												color={lightTheme.colors.onSurface}
											/>
											<Text
												style={[
													styles.statusChipText,
													{ color: lightTheme.colors.onSurface },
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
							<View style={styles.filterSectionHeader}>
								<Text style={styles.filterLabel}>Tipo de vehículo</Text>
								{filterTypes.size > 0 && (
									<Pressable onPress={clearTypeFilters}>
										<Text style={styles.clearFiltersText}>Limpiar</Text>
									</Pressable>
								)}
							</View>
							<View style={styles.statusChipsGrid}>
								{vehicleTypes.map((type) => {
									const isSelected = filterTypes.has(type);
									return (
										<Pressable
											key={type}
											style={[
												styles.statusChip,
												{
													backgroundColor: isSelected ? lightTheme.colors.secondaryContainer : lightTheme.colors.surface,
													borderColor: isSelected ? lightTheme.colors.primary : lightTheme.colors.outline,
												},
											]}
											onPress={() => toggleTypeFilter(type)}
										>
											<Text
												style={[
													styles.statusChipText,
													{ color: lightTheme.colors.onSurface },
												]}
											>
												{type}
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
											<ChevronsUp size={18} color={lightTheme.colors.primary} />
										) : (
											<ChevronsDown size={18} color={lightTheme.colors.primary} />
										)}
									</View>
								</Pressable>
							</View>
							<View style={styles.sortOptionsContainer}>
								{(['vehicleBrand', 'vehicleModel', 'plateNumber'] as SortOption[]).map((option) => (
									<TouchableOpacity
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
									</TouchableOpacity>
								))}
							</View>
							<View style={styles.sortOptionsContainer}>
								{(['registrationDate', 'purchaseDate', 'year'] as SortOption[]).map((option) => (
									<TouchableOpacity
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
									</TouchableOpacity>
								))}
							</View>
						</View>
					</View>
				</Animated.View>

				{filteredVehicles.length > 0 && (
					<View style={styles.resultsInfo}>
						<Text style={styles.resultsText}>{filteredVehicles.length} vehículos</Text>
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
					{filteredVehicles.map((item) => {
						return (
							<Card
								key={item.id}
								onPress={() => router.push(`/fleet/${item.id}`)}
								onLongPress={() => handleLongPress(item)}
								paddingX={spacing.sm}
								paddingY={spacing.sm}
								shadow='none'
								backgroundColor={lightTheme.colors.surface}
								style={styles.vehicleCard}
							>
								<View style={styles.cardContent}>
									<View style={styles.avatarContainer}>
										{item.imageUrl ?
											<Image source={{ uri: item.imageUrl }} style={styles.avatar} />
											:
											<Card
												paddingX={0}
												paddingY={0}
												rounded={roundness.xs}
												shadow='none'
												backgroundColor={`${lightTheme.colors.primary}CC`}
											>
												<IconPlaceholder color={lightTheme.colors.onPrimary} icon={Truck} size={80} />
											</Card>
										}
									</View>
									<View style={styles.vehicleInfo}>
										<View style={styles.vehicleHeader}>
											<Text
												style={styles.vehicleName}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{item.vehicleBrand} {item.vehicleModel} ({item.year})
											</Text>
											<StatusLabel
												status={item.status}
												Icon={getVehicleStatusIcon(item.status)}
											/>
										</View>

										<Text style={styles.vehiclePlate}>
											{item.plateNumber} ({item.vehicleType})
										</Text>
										<View style={styles.vehicleFooter}>
											{item.purchaseDate ? (
												<Text style={styles.vehicleDate}>
													Activo desde: {item.purchaseDate.toLocaleDateString()}
												</Text>
											) : (
												<Text style={styles.vehicleDate}>
													Registrado en: {item.registrationDate.toLocaleDateString()}
												</Text>
											)}
										</View>
									</View>
								</View>
							</Card>
						);
					})}
				</ScrollView>
			)}
			{selectedVehicle && (
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
								onPress={handleViewVehicle}
							>
								<ExternalLink size={22} color={lightTheme.colors.onSurface} />
								<Text style={styles.actionText}>Ver vehículo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleChangeStatus}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={RefreshCcw}
									size={22}
									color={lightTheme.colors.onBackground}
									badgeSize={12}
									badgeColor={lightTheme.colors.onBackground}
									badgeBackgroundColor={lightTheme.colors.background}
								/>
								<Text style={styles.actionText}>Cambiar estado del vehículo</Text>
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

					<ActionsModal
						visible={statusModal.visible}
						onClose={handleCloseStatusModal}
						animationType="none"
					>
						<View style={[styles.modalContent, { marginTop: spacing.md }]}>
							<TouchableOpacity
								style={[styles.actionButton, styles.successAction,]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.ACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Check}
									size={22}
									color={lightTheme.colors.statusActive}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusActive}
									badgeBackgroundColor={lightTheme.colors.statusActiveContainer}
								/>
								<Text style={styles.actionText}>Dar de alta</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setBrokenDownAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.INACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={X}
									size={22}
									color={lightTheme.colors.statusBrokenDown}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusBrokenDown}
									badgeBackgroundColor={lightTheme.colors.statusBrokenDownContainer}
								/>
								<Text style={[styles.actionText, styles.setBrokenDownText]}>Dar de baja</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setMaintenanceAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.MAINTENANCE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Wrench}
									size={22}
									color={lightTheme.colors.statusMaintenance}
									badgeSize={12}
									badgeColor={lightTheme.colors.statusMaintenance}
									badgeBackgroundColor={lightTheme.colors.statusMaintenanceContainer}
								/>
								<Text style={[styles.actionText, styles.setMaintenanceText]}>Poner en mantenimiento</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.actionButton, styles.setInactiveAction]}
								onPress={() => handleUpdateVehicleStatus(VehicleStatus.INACTIVE)}
							>
								<IconBadge
									Icon={Truck}
									BadgeIcon={Pause}
									size={22}
									color={lightTheme.colors.onBackground}
									badgeSize={12}
									badgeColor={lightTheme.colors.onBackground}
									badgeBackgroundColor={lightTheme.colors.background}
								/>
								<Text style={[styles.actionText, styles.setInactiveText]}>Poner como inactivo</Text>
							</TouchableOpacity>
						</View>
					</ActionsModal>

					<ConfirmationModal
						visible={confirmationModal.visible}
						onClose={handleCancelDelete}
						onConfirm={handleConfirmDelete}
						title="¿Eliminar vehículo?"
						message="Esta acción no se puede deshacer. El vehículo será eliminado permanentemente."
						confirmText="Eliminar"
						cancelText="Cancelar"
					/>
				</>
			)}
		</SafeAreaView>
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
	},
	statusChip: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: roundness.sm,
		borderWidth: 1.5,
		gap: spacing.xs,
		minWidth: '48%',
		flex: 1,
	},
	statusChipText: {
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
	vehicleCard: {
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
	vehicleInfo: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		gap: spacing.sm,
	},
	vehicleHeader: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	vehicleName: {
		fontSize: typography.titleMedium,
		fontWeight: "600",
		flex: 1,
	},
	vehiclePlate: {
		fontSize: typography.bodyMedium,
		opacity: 0.7,
	},
	vehicleFooter: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		gap: spacing.xs,
	},
	vehicleDate: {
		fontSize: typography.bodySmall,
		opacity: 0.7,
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
	successAction: {
		backgroundColor: lightTheme.colors.statusActiveContainer,
	},
	setMaintenanceAction: {
		backgroundColor: lightTheme.colors.statusMaintenanceContainer,
	},
	setMaintenanceText: {
		color: lightTheme.colors.statusMaintenance,
	},
	setInactiveAction: {
		backgroundColor: lightTheme.colors.background,
	},
	setInactiveText: {
		color: lightTheme.colors.onBackground,
	},
	setBrokenDownAction: {
		backgroundColor: lightTheme.colors.statusBrokenDownContainer,
	},
	setBrokenDownText: {
		color: lightTheme.colors.statusBrokenDown,
	},
});