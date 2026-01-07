import { Accordion } from "@/components/Accordion";
import { Card } from "@/components/Card";
import { ElevatedButton } from "@/components/ElevatedButton";
import { InfoRow } from "@/components/InfoRow";
import { SkeletonDetail } from "@/components/skeletons";
import { ReportsTypes } from "@/constants/enums/ReportsTypes";
import { roundness, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { Report } from "@/models/report";
import { reports } from "@/services/data";
import { useFleetStore } from "@/stores/useFleetStore";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { router, useLocalSearchParams } from "expo-router";
import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Check,
	ChevronDown,
	ClipboardCheck,
	Clock,
	Search,
	Wrench,
	X,
} from "lucide-react-native";
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

type StatusFilter = "all" | "pending" | "resolved";
type SortOrder = "asc" | "desc";

export default function VehicleReportsHistoryScreen() {
	const { theme } = useAppTheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const styles = useMemo(() => getStyles(theme), [theme]);

	// Get vehicle info from store - it's already loaded from previous screen
	const vehicles = useFleetStore((state) => state.vehicles);
	const currentVehicle = vehicles.find((v) => v.id === id);

	const [reportsList, setReportsList] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [typeFilter, setTypeFilter] = useState<ReportsTypes | "all">("all");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [filterHeight] = useState(new Animated.Value(0));

	useEffect(() => {
		if (id) {
			loadReports(id as string);
		}
	}, [id]);

	const loadReports = async (vehicleId: string) => {
		try {
			setLoading(true);
			const allReports = await reports.listReports();
			const vehicleReports = allReports.filter(
				(r) => r.vehicleId === vehicleId
			);
			setReportsList(vehicleReports);
		} catch (err) {
			setError("Error al cargar el historial de reportes");
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

	const filteredReports = useMemo(() => {
		let filtered = [...reportsList];

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((report) => {
				const title = report.title?.toLowerCase() || "";
				const description = report.description?.toLowerCase() || "";
				const location = report.location?.address?.toLowerCase() || "";
				const createdDate = formatDateToDisplay(report.createdAt).toLowerCase();

				return (
					title.includes(query) ||
					description.includes(query) ||
					location.includes(query) ||
					createdDate.includes(query)
				);
			});
		}

		// Filter by status
		if (statusFilter !== "all") {
			filtered = filtered.filter((r) => {
				if (statusFilter === "pending") {
					return r.active && !r.closedAt;
				} else {
					return !r.active || !!r.closedAt;
				}
			});
		}

		// Filter by type
		if (typeFilter !== "all") {
			filtered = filtered.filter((r) => r.title === typeFilter);
		}

		// Sort by date
		filtered.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
		});

		return filtered;
	}, [reportsList, searchQuery, statusFilter, typeFilter, sortOrder]);

	const clearSearch = () => {
		setSearchQuery("");
	};

	const animatedMaxHeight = filterHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 900],
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
						<Text style={styles.title}>Historial de Reportes</Text>
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
						placeholder="Buscar reportes..."
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
										Todos
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										statusFilter === "pending" && styles.statusChipActive,
									]}
									onPress={() => setStatusFilter("pending")}
								>
									<Clock
										size={18}
										color={
											statusFilter === "pending"
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											statusFilter === "pending" &&
											styles.statusChipTextActive,
										]}
									>
										Pendientes
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										statusFilter === "resolved" && styles.statusChipActive,
									]}
									onPress={() => setStatusFilter("resolved")}
								>
									<Check
										size={18}
										color={
											statusFilter === "resolved"
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											statusFilter === "resolved" &&
											styles.statusChipTextActive,
										]}
									>
										Resueltos
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
										typeFilter === ReportsTypes.ACCIDENT &&
										styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(ReportsTypes.ACCIDENT)}
								>
									<AlertCircle
										size={18}
										color={
											typeFilter === ReportsTypes.ACCIDENT
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === ReportsTypes.ACCIDENT &&
											styles.statusChipTextActive,
										]}
									>
										Accidente
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === ReportsTypes.MAINTENANCE &&
										styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(ReportsTypes.MAINTENANCE)}
								>
									<Wrench
										size={18}
										color={
											typeFilter === ReportsTypes.MAINTENANCE
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === ReportsTypes.MAINTENANCE &&
											styles.statusChipTextActive,
										]}
									>
										Mantenimiento
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === ReportsTypes.CHECK && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(ReportsTypes.CHECK)}
								>
									<ClipboardCheck
										size={18}
										color={
											typeFilter === ReportsTypes.CHECK
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === ReportsTypes.CHECK &&
											styles.statusChipTextActive,
										]}
									>
										Revisión
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === ReportsTypes.ITV && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(ReportsTypes.ITV)}
								>
									<AlertTriangle
										size={18}
										color={
											typeFilter === ReportsTypes.ITV
												? theme.colors.onSecondaryContainer
												: theme.colors.onSurface
										}
									/>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === ReportsTypes.ITV &&
											styles.statusChipTextActive,
										]}
									>
										ITV
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.statusChip,
										typeFilter === ReportsTypes.OTHER && styles.statusChipActive,
									]}
									onPress={() => setTypeFilter(ReportsTypes.OTHER)}
								>
									<Text
										style={[
											styles.statusChipText,
											typeFilter === ReportsTypes.OTHER &&
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
						{filteredReports.length}{" "}
						{filteredReports.length === 1 ? "reporte" : "reportes"}
					</Text>
				</View>
			</View>

			{/* Results List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{filteredReports.length === 0 ? (
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={theme.colors.surface}
					>
						<Text style={styles.emptyText}>
							{searchQuery
								? "No se encontraron reportes"
								: "No hay reportes que coincidan con los filtros"}
						</Text>
					</Card>
				) : (
					filteredReports.map((report) => (
						<Accordion
							key={report.id}
							title={report.title}
							subtitle={`${formatDateToDisplay(report.createdAt)} • ${report.active && !report.closedAt ? "Pendiente" : "Resuelto"
								}`}
						>
							<View style={styles.accordionContent}>
								<View style={styles.cardContent}>
									<InfoRow
										label="Tipo"
										labelFlex={2}
										valueFlex={3}
										value={report.title}
									/>
									<View style={styles.separator} />
									<InfoRow
										label="Estado"
										labelFlex={2}
										valueFlex={3}
										value={
											report.active && !report.closedAt
												? "Pendiente"
												: "Resuelto"
										}
									/>
									<View style={styles.separator} />
									<InfoRow
										label="Fecha creación"
										labelFlex={2}
										valueFlex={3}
										value={formatDateToDisplay(report.createdAt)}
									/>
									{report.closedAt && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Fecha cierre"
												labelFlex={2}
												valueFlex={3}
												value={formatDateToDisplay(report.closedAt)}
											/>
										</>
									)}
									{report.description && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Descripción"
												labelFlex={2}
												valueFlex={3}
												value={report.description}
											/>
										</>
									)}
									{report.location?.address && (
										<>
											<View style={styles.separator} />
											<InfoRow
												label="Ubicación"
												labelFlex={2}
												valueFlex={3}
												value={report.location.address}
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