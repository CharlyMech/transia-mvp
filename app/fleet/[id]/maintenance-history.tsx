import { Accordion } from "@/components/Accordion";
import { Card } from "@/components/Card";
import { ElevatedButton } from "@/components/ElevatedButton";
import { InfoRow } from "@/components/InfoRow";
import { SkeletonDetail } from "@/components/skeletons";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import type { VehicleMaintenance } from "@/models/vehicleMaintenance";
import { MaintenanceType } from "@/models/vehicleMaintenance";
import { vehicleMaintenances } from "@/services/data";
import { useFleetStore } from "@/stores/useFleetStore";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { router, useLocalSearchParams } from "expo-router";
import { AlertTriangle, ArrowLeft, Calendar, ChevronDown, Search, Wrench, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Easing,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TimeFilter = "all" | "future" | "past";
type SortOrder = "asc" | "desc";

export default function MaintenanceHistoryScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	// Get vehicle info from store - it's already loaded from previous screen
	const vehicles = useFleetStore((state) => state.vehicles);
	const currentVehicle = vehicles.find((v) => v.id === id);

	const [maintenances, setMaintenances] = useState<VehicleMaintenance[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
	const [typeFilter, setTypeFilter] = useState<MaintenanceType | "all">("all");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	useEffect(() => {
		if (id) {
			loadMaintenances(id as string);
		}
	}, [id]);

	const loadMaintenances = async (vehicleId: string) => {
		try {
			setLoading(true);
			const data = await vehicleMaintenances.getMaintenancesByVehicleId(
				vehicleId
			);
			setMaintenances(data);
		} catch (err) {
			setError("Error al cargar el historial");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

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
	}, [searchQuery]);

	const filteredMaintenances = useMemo(() => {
		let filtered = [...maintenances];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((maintenance) => {
				const type = maintenance.maintenanceType?.toLowerCase() || "";
				const status = maintenance.status?.toLowerCase() || "";
				const description = maintenance.description?.toLowerCase() || "";
				const workshop = maintenance.workshopName?.toLowerCase() || "";
				const scheduledDate = formatDateToDisplay(
					maintenance.scheduledDate
				).toLowerCase();

				return (
					type.includes(query) ||
					status.includes(query) ||
					description.includes(query) ||
					workshop.includes(query) ||
					scheduledDate.includes(query)
				);
			});
		}

		// Filter by time
		if (timeFilter !== "all") {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			filtered = filtered.filter((m) => {
				const maintenanceDate = new Date(m.scheduledDate);
				maintenanceDate.setHours(0, 0, 0, 0);

				if (timeFilter === "future") {
					return maintenanceDate >= today;
				} else {
					return maintenanceDate < today;
				}
			});
		}

		// Filter by type
		if (typeFilter !== "all") {
			filtered = filtered.filter((m) => m.maintenanceType === typeFilter);
		}

		// Sort by date
		filtered.sort((a, b) => {
			const dateA = new Date(a.scheduledDate).getTime();
			const dateB = new Date(b.scheduledDate).getTime();
			return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
		});

		return filtered;
	}, [maintenances, searchQuery, timeFilter, typeFilter, sortOrder]);

	const clearSearch = () => {
		setSearchQuery("");
	};

	const animatedMaxHeight = filterHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 700],
		extrapolate: "clamp",
	});

	const animatedOpacity = filterHeight.interpolate({
		inputRange: [0, 0.3, 1],
		outputRange: [0, 0, 1],
		extrapolate: "clamp",
	});

	if (loading) {
		return <SkeletonDetail />;
	}

	if (error) {
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	// Build vehicle title immediately from already loaded data
	const vehicleTitle = currentVehicle
		? `${currentVehicle.vehicleBrand} ${currentVehicle.vehicleModel}`
		: "Vehículo";
	const vehiclePlate = currentVehicle?.plateNumber || "";

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header with search and filters */}
			<View style={styles.headerWrapper}>
				<View style={styles.headerTop}>
					<ElevatedButton
						backgroundColor={lightTheme.colors.primary}
						icon={ArrowLeft}
						iconSize={22}
						iconColor={lightTheme.colors.onPrimary}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						rounded={roundness.full}
						shadow="none"
						onPress={() => router.back()}
					/>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Historial de Mantenimientos</Text>
						<Text style={styles.subtitle}>
							para {vehicleTitle}
							{vehiclePlate && ` • ${vehiclePlate}`}
						</Text>
					</View>
				</View>

				<View style={styles.searchContainer}>
					<Search size={20} color={lightTheme.colors.onSurfaceVariant} />
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar mantenimientos..."
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
						<ActivityIndicator
							size="small"
							color={lightTheme.colors.primary}
						/>
					)}
				</View>

				{/* Filters toggle */}
				<Pressable
					style={({ pressed }) => [
						styles.filterToggleCard,
						pressed && styles.filterToggleCardPressed,
					]}
					onPress={toggleFilters}
				>
					<Text style={styles.filterToggleText}>Filtros y ordenación</Text>
					<ChevronDown
						size={20}
						color={lightTheme.colors.onSurface}
						style={{
							transform: [{ rotate: isFiltersExpanded ? "180deg" : "0deg" }],
						}}
					/>
				</Pressable>

				{/* Filters content */}
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
						{/* Time Filter */}
						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Período</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										timeFilter === "all" && styles.statusChipActive,
									]}
									onPress={() => setTimeFilter("all")}
								>
									<Text
										style={[
											styles.statusChipText,
											timeFilter === "all" && styles.statusChipTextActive,
										]}
									>
										Todos
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										timeFilter === "future" && styles.statusChipActive,
									]}
									onPress={() => setTimeFilter("future")}
								>
									<Calendar
										size={18}
										color={
											timeFilter === "future"
												? lightTheme.colors.onSecondaryContainer
												: lightTheme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											timeFilter === "future" && styles.statusChipTextActive,
										]}
									>
										Próximos
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										timeFilter === "past" && styles.statusChipActive,
									]}
									onPress={() => setTimeFilter("past")}
								>
									<Text
										style={[
											styles.statusChipText,
											timeFilter === "past" && styles.statusChipTextActive,
										]}
									>
										Pasados
									</Text>
								</Pressable>
							</View>
						</View>

						{/* Type Filter */}
						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Tipo</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === "all" && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter("all")}
								>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === "all" && styles.statusChipTextActive,
										]}
									>
										Todos
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === MaintenanceType.ITV && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(MaintenanceType.ITV)}
								>
									<AlertTriangle
										size={18}
										color={
											typeFilter === MaintenanceType.ITV
												? lightTheme.colors.onSecondaryContainer
												: lightTheme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === MaintenanceType.ITV &&
											styles.statusChipTextActive,
										]}
									>
										ITV
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === MaintenanceType.MAINTENANCE &&
										styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(MaintenanceType.MAINTENANCE)}
								>
									<Wrench
										size={18}
										color={
											typeFilter === MaintenanceType.MAINTENANCE
												? lightTheme.colors.onSecondaryContainer
												: lightTheme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === MaintenanceType.MAINTENANCE &&
											styles.statusChipTextActive,
										]}
									>
										Mantenimiento
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === MaintenanceType.OTHER && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(MaintenanceType.OTHER)}
								>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === MaintenanceType.OTHER &&
											styles.statusChipTextActive,
										]}
									>
										Otro
									</Text>
								</Pressable>
							</View>
						</View>

						{/* Sort Order */}
						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Ordenar por fecha</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										sortOrder === "desc" && styles.statusChipActive,
									]}
									onPress={() => setSortOrder("desc")}
								>
									<Text
										style={[
											styles.statusChipText,
											sortOrder === "desc" && styles.statusChipTextActive,
										]}
									>
										Más reciente
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										sortOrder === "asc" && styles.statusChipActive,
									]}
									onPress={() => setSortOrder("asc")}
								>
									<Text
										style={[
											styles.statusChipText,
											sortOrder === "asc" && styles.statusChipTextActive,
										]}
									>
										Más antigua
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Animated.View>

				{/* Results count */}
				<View style={styles.resultsInfo}>
					<Text style={styles.resultsText}>
						{filteredMaintenances.length}{" "}
						{filteredMaintenances.length === 1
							? "mantenimiento"
							: "mantenimientos"}
					</Text>
				</View>
			</View>

			{/* Results List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{filteredMaintenances.length === 0 ? (
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<Text style={styles.emptyText}>
							{searchQuery
								? "No se encontraron mantenimientos"
								: "No hay mantenimientos que coincidan con los filtros"}
						</Text>
					</Card>
				) : (
					filteredMaintenances.map((maintenance) => (
						<Accordion
							key={maintenance.id}
							title={maintenance.maintenanceType}
							subtitle={`${formatDateToDisplay(maintenance.scheduledDate)} • ${maintenance.status
								}`}
						>
							<View style={styles.accordionContent}>
								<View style={styles.cardContent}>
									<InfoRow
										label="Tipo"
										labelFlex={2}
										valueFlex={3}
										value={maintenance.maintenanceType}
									/>
									<View style={styles.separator} />
									<InfoRow
										label="Estado"
										labelFlex={2}
										valueFlex={3}
										value={maintenance.status}
									/>
									<View style={styles.separator} />
									<InfoRow
										label="Fecha programada"
										labelFlex={2}
										valueFlex={3}
										value={formatDateToDisplay(maintenance.scheduledDate)}
									/>
									{maintenance.completedDate && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Fecha completada"
												labelFlex={2}
												valueFlex={3}
												value={formatDateToDisplay(maintenance.completedDate)}
											/>
										</>
									)}
									{maintenance.description && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Descripción"
												labelFlex={2}
												valueFlex={3}
												value={maintenance.description}
											/>
										</>
									)}
									{maintenance.workshopName && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Taller"
												labelFlex={2}
												valueFlex={3}
												value={maintenance.workshopName}
											/>
										</>
									)}
									{maintenance.cost !== undefined && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Coste"
												labelFlex={2}
												valueFlex={3}
												value={`${maintenance.cost.toFixed(2)} €`}
											/>
										</>
									)}
									{maintenance.mileage !== undefined && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Kilometraje"
												labelFlex={2}
												valueFlex={3}
												value={maintenance.mileage.toLocaleString()}
											/>
										</>
									)}
								</View>
							</View>
						</Accordion>
					))
				)}
			</ScrollView>
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
	centered: {
		justifyContent: "center",
		alignItems: "center",
	},
	headerTop: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xs,
		gap: spacing.sm,
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		fontSize: typography.titleLarge,
		fontWeight: "700",
		color: lightTheme.colors.onSurface,
	},
	subtitle: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		color: lightTheme.colors.onSurfaceVariant,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		marginHorizontal: spacing.sm,
		marginTop: spacing.xs,
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
	filterToggleCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		marginHorizontal: spacing.sm,
		marginTop: spacing.xs,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.surface,
	},
	filterToggleCardPressed: {
		opacity: 0.9,
	},
	filterToggleText: {
		fontSize: typography.bodyMedium,
		fontWeight: "600",
		color: lightTheme.colors.onSurface,
	},
	filtersContainer: {
		overflow: "hidden",
	},
	filtersContent: {
		padding: spacing.sm,
		gap: spacing.md,
		backgroundColor: "transparent",
	},
	filterSection: {
		gap: spacing.sm,
	},
	filterLabel: {
		fontSize: typography.bodyMedium,
		fontWeight: "600",
		color: lightTheme.colors.onSurface,
	},
	statusChipsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xs,
	},
	statusChip: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: roundness.sm,
		borderWidth: 1.5,
		gap: spacing.xs,
		minWidth: 140,
		flexGrow: 1,
		flexShrink: 1,
		borderColor: lightTheme.colors.outline,
		backgroundColor: lightTheme.colors.background,
	},
	statusChipActive: {
		backgroundColor: lightTheme.colors.secondaryContainer,
		borderColor: lightTheme.colors.primary,
	},
	statusChipText: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		flex: 1,
		color: lightTheme.colors.onSurface,
	},
	statusChipTextActive: {
		fontWeight: "600",
		color: lightTheme.colors.onSecondaryContainer,
	},
	resultsInfo: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	resultsText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		fontWeight: "500",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.sm,
		gap: spacing.sm,
	},
	accordionContent: {
		padding: spacing.md,
		backgroundColor: lightTheme.colors.surface,
		borderBottomLeftRadius: roundness.sm,
		borderBottomRightRadius: roundness.sm,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: lightTheme.colors.outline,
		opacity: 0.5,
	},
	emptyText: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		fontStyle: "italic",
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: "center",
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.error,
	},
});