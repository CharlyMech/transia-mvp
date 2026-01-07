import { Accordion } from "@/components/Accordion";
import { Card } from "@/components/Card";
import { ElevatedButton } from "@/components/ElevatedButton";
import { InfoRow } from "@/components/InfoRow";
import { SkeletonDetail } from "@/components/skeletons";
import { roundness, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { VehicleAssignation } from "@/models/vehicleAssignation";
import { vehicleAssignations } from "@/services/data";
import { useFleetStore } from "@/stores/useFleetStore";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, ChevronDown, Clock, Search, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Easing,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusFilter = "all" | "active" | "completed";
type SortOrder = "asc" | "desc";

export default function VehicleAssignationsHistoryScreen() {
	const { theme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const styles = useMemo(() => getStyles(theme), [theme]);

	// Get vehicle info from store - it's already loaded from previous screen
	const vehicles = useFleetStore((state) => state.vehicles);
	const currentVehicle = vehicles.find((v) => v.id === id);

	const [assignations, setAssignations] = useState<VehicleAssignation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	useEffect(() => {
		if (id) {
			loadAssignations(id as string);
		}
	}, [id]);

	const loadAssignations = async (vehicleId: string) => {
		try {
			setLoading(true);
			const data = await vehicleAssignations.getAssignationsByVehicleId(
				vehicleId
			);
			setAssignations(data);
		} catch (err) {
			setError("Error al cargar las asignaciones");
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

	const filteredAssignations = useMemo(() => {
		let filtered = [...assignations];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((assignation) => {
				const status = assignation.status?.toLowerCase() || "";
				const notes = assignation.notes?.toLowerCase() || "";
				const startDate = formatDateToDisplay(assignation.startDate).toLowerCase();
				const endDate = assignation.endDate
					? formatDateToDisplay(assignation.endDate).toLowerCase()
					: "";

				return (
					status.includes(query) ||
					notes.includes(query) ||
					startDate.includes(query) ||
					endDate.includes(query)
				);
			});
		}

		// Filter by status
		if (statusFilter !== "all") {
			filtered = filtered.filter((a) => {
				if (statusFilter === "active") {
					return a.status === "Activa" && !a.endDate;
				} else {
					return a.status === "Completada" || !!a.endDate;
				}
			});
		}

		// Sort by date
		filtered.sort((a, b) => {
			const dateA = new Date(a.startDate).getTime();
			const dateB = new Date(b.startDate).getTime();
			return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
		});

		return filtered;
	}, [assignations, searchQuery, statusFilter, sortOrder]);

	const clearSearch = () => {
		setSearchQuery("");
	};

	const animatedMaxHeight = filterHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 500],
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
						backgroundColor={theme.colors.primary}
						icon={ArrowLeft}
						iconSize={22}
						iconColor={theme.colors.onPrimary}
						paddingX={spacing.sm}
						paddingY={spacing.sm}
						rounded={roundness.full}
						shadow="none"
						onPress={() => router.back()}
					/>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Historial de Asignaciones</Text>
						<Text style={styles.subtitle}>
							para {vehicleTitle}
							{vehiclePlate && ` • ${vehiclePlate}`}
						</Text>
					</View>
				</View>

				<View style={styles.searchContainer}>
					<Search size={20} color={theme.colors.onSurfaceVariant} />
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar asignaciones..."
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
						<ActivityIndicator
							size="small"
							color={theme.colors.primary}
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
						color={theme.colors.onSurface}
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
						{/* Status Filter */}
						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Estado</Text>
							<View style={styles.statusChipsGrid}>
								<Pressable
									style={[
										styles.statusChip,
										statusFilter === "all" && styles.statusChipActive,
									]}
									onPress={() => setStatusFilter("all")}
								>
									<Text
										style={[
											styles.statusChipText,
											statusFilter === "all" && styles.statusChipTextActive,
										]}
									>
										Todas
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										statusFilter === "active" && styles.statusChipActive,
									]}
									onPress={() => setStatusFilter("active")}
								>
									<Clock
										size={18}
										color={
											statusFilter === "active"
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											statusFilter === "active" && styles.statusChipTextActive,
										]}
									>
										Activas
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										statusFilter === "completed" && styles.statusChipActive,
									]}
									onPress={() => setStatusFilter("completed")}
								>
									<Check
										size={18}
										color={
											statusFilter === "completed"
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											statusFilter === "completed" &&
											styles.statusChipTextActive,
										]}
									>
										Completadas
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
						{filteredAssignations.length}{" "}
						{filteredAssignations.length === 1 ? "asignación" : "asignaciones"}
					</Text>
				</View>
			</View>

			{/* Results List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{filteredAssignations.length === 0 ? (
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<Text style={styles.emptyText}>
							{searchQuery
								? "No se encontraron asignaciones"
								: "No hay asignaciones que coincidan con los filtros"}
						</Text>
					</Card>
				) : (
					filteredAssignations.map((assignation) => (
						<Accordion
							key={assignation.id}
							title={assignation.status}
							subtitle={`${formatDateToDisplay(assignation.startDate)}${assignation.endDate
								? ` - ${formatDateToDisplay(assignation.endDate)}`
								: " (En curso)"
								}`}
						>
							<View style={styles.accordionContent}>
								<View style={styles.cardContent}>
									<InfoRow
										label="Estado"
										labelFlex={2}
										valueFlex={3}
										value={assignation.status}
									/>
									<View style={styles.separator} />
									<InfoRow
										label="Inicio"
										labelFlex={2}
										valueFlex={3}
										value={formatDateToDisplay(assignation.startDate)}
									/>
									{assignation.endDate && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Fin"
												labelFlex={2}
												valueFlex={3}
												value={formatDateToDisplay(assignation.endDate)}
											/>
										</>
									)}
									{assignation.startMileage !== undefined && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Km inicio"
												labelFlex={2}
												valueFlex={3}
												value={assignation.startMileage.toLocaleString()}
											/>
										</>
									)}
									{assignation.endMileage !== undefined && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Km fin"
												labelFlex={2}
												valueFlex={3}
												value={assignation.endMileage.toLocaleString()}
											/>
										</>
									)}
									{assignation.notes && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Notas"
												labelFlex={2}
												valueFlex={3}
												value={assignation.notes}
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

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	headerWrapper: {
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
		color: theme.colors.onSurface,
	},
	subtitle: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		color: theme.colors.onSurfaceVariant,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.colors.surface,
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
		color: theme.colors.onSurface,
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
		backgroundColor: theme.colors.surface,
	},
	filterToggleCardPressed: {
		opacity: 0.9,
	},
	filterToggleText: {
		fontSize: typography.bodyMedium,
		fontWeight: "600",
		color: theme.colors.onSurface,
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
		color: theme.colors.onSurface,
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
		borderColor: theme.colors.outline,
		backgroundColor: theme.colors.background,
	},
	statusChipActive: {
		backgroundColor: theme.colors.secondaryContainer,
		borderColor: theme.colors.primary,
	},
	statusChipText: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		flex: 1,
		color: theme.colors.onSurface,
	},
	statusChipTextActive: {
		fontWeight: "600",
		color: theme.colors.onSecondaryContainer,
	},
	resultsInfo: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	resultsText: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
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
		backgroundColor: theme.colors.surface,
		borderBottomLeftRadius: roundness.sm,
		borderBottomRightRadius: roundness.sm,
	},
	cardContent: {
		gap: spacing.sm,
	},
	separator: {
		height: 1,
		backgroundColor: theme.colors.outline,
		opacity: 0.5,
	},
	emptyText: {
		fontSize: typography.bodyMedium,
		fontWeight: "500",
		fontStyle: "italic",
		color: theme.colors.onSurfaceVariant,
		textAlign: "center",
	},
	errorText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.error,
	},
});