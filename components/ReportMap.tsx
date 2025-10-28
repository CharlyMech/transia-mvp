import { Card } from "@/components/Card";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { Location } from "@/models/report";
import { Ionicons } from "@expo/vector-icons";
import { Expand, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface ReportMapProps {
	location: Location;
	compact?: boolean; // Si es true, muestra el mapa pequeño
	showExpandButton?: boolean; // Si es true, muestra el botón para expandir
	height?: number; // Altura personalizada del mapa
	containerStyle?: any; // Estilos personalizados del contenedor
}

export function ReportMap({
	location,
	compact = true,
	showExpandButton = true,
	height = 320,
	containerStyle
}: ReportMapProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const mapRegion = {
		latitude: location.latitude,
		longitude: location.longitude,
		latitudeDelta: 0.005, // Zoom más cercano
		longitudeDelta: 0.005,
	};

	const MapContent = ({ isFullScreen = false }: { isFullScreen?: boolean }) => (
		<View style={[
			isFullScreen ? styles.fullScreenContainer : { height },
			!isFullScreen && containerStyle
		]}>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				initialRegion={mapRegion}
				showsUserLocation={false}
				showsMyLocationButton={true}
				showsCompass={true}
				scrollEnabled={isFullScreen}
				zoomEnabled={isFullScreen}
				pitchEnabled={isFullScreen}
				rotateEnabled={isFullScreen}
			>
				<Marker
					coordinate={{
						latitude: location.latitude,
						longitude: location.longitude,
					}}
					title="Ubicación de la incidencia"
				/>
			</MapView>

			<View style={styles.topContainer}>
				<View style={styles.contentWrapper}>
					{location.address && (
						<Card
							paddingX={spacing.sm}
							paddingY={spacing.sm}
							rounded={roundness.sm}
							shadow="small"
							backgroundColor={lightTheme.colors.surface}
							style={styles.addressContainer}
						>
							<View style={styles.addressContent}>
								<MapPin size={16} color={lightTheme.colors.onSurface} />
								<Text style={styles.addressText} numberOfLines={2}>
									{location.address}
								</Text>
							</View>
						</Card>
					)}
				</View>

				{showExpandButton && !isFullScreen && compact && (
					<TouchableOpacity
						style={styles.expandButton}
						onPress={() => setIsExpanded(true)}
					>
						<Expand size={20} color={lightTheme.colors.onPrimary} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);

	if (compact) {
		return (
			<>
				<MapContent />
				<Modal
					visible={isExpanded}
					animationType="slide"
					onRequestClose={() => setIsExpanded(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Ubicación del reporte</Text>
							<TouchableOpacity
								onPress={() => setIsExpanded(false)}
								style={styles.closeButton}
							>
								<Ionicons name="close" size={28} color={lightTheme.colors.onSurface} />
							</TouchableOpacity>
						</View>
						<MapContent isFullScreen />
					</View>
				</Modal>
			</>
		);
	}

	return <MapContent isFullScreen />;
}

const styles = StyleSheet.create({
	fullScreenContainer: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	topContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		padding: spacing.sm,
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		zIndex: 10,
	},
	contentWrapper: {
		flex: 1,
	},
	addressContainer: {
		width: '100%',
	},
	addressContent: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	addressText: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
		lineHeight: 20,
	},
	expandButton: {
		backgroundColor: lightTheme.colors.primary,
		width: 36,
		height: 36,
		borderRadius: roundness.full,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: roundness.sm,
		elevation: 5,
	},
	modalContainer: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: spacing.md,
		paddingTop: 60,
		backgroundColor: lightTheme.colors.background,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.outline,
	},
	modalTitle: {
		fontSize: typography.titleMedium,
		fontWeight: "600",
		color: lightTheme.colors.onSurface,
	},
	closeButton: {
		padding: 4,
	},
});