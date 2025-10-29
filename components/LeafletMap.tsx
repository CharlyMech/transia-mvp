import { Card } from "@/components/Card";
import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { Location } from "@/models/report";
import { Ionicons } from "@expo/vector-icons";
import { Expand, MapPin } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

interface LeafletMapProps {
	location: Location;
	compact?: boolean;
	showExpandButton?: boolean;
	showAddress?: boolean;
	height?: number;
	containerStyle?: any;
	editable?: boolean;
	onLocationChange?: (location: Location) => void;
}

export function LeafletMap({
	location,
	compact = true,
	showExpandButton = true,
	showAddress = true,
	height = 320,
	containerStyle,
	editable = false,
	onLocationChange
}: LeafletMapProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [zoom, setZoom] = useState<number>(17);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Debounced handler to prevent constant updates
	const handleMapMove = useCallback((lat: number, lng: number) => {
		if (!editable) return;

		// Clear any pending timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Debounce the update to prevent constant re-renders
		timeoutRef.current = setTimeout(() => {
			const newLocation: Location = {
				latitude: lat,
				longitude: lng,
				altitude: location.altitude,
				accuracy: location.accuracy,
				address: location.address,
			};

			onLocationChange?.(newLocation);
		}, 300); // Wait 300ms after user stops moving map
	}, [editable, location.altitude, location.accuracy, location.address, onLocationChange]);

	// Generate the HTML content for the map
	const generateMapHTML = (isFullScreen: boolean) => `
		<!DOCTYPE html>
		<html>
		<head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
			<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
			<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
			<style>
				body {
					margin: 0;
					padding: 0;
					overflow: hidden;
				}
				#map {
					width: 100%;
					height: 100vh;
					z-index: 0;
				}
			</style>
		</head>
		<body>
			<div id="map"></div>
			<script>
				// Initialize map
				const map = L.map('map', {
					center: [${location.latitude}, ${location.longitude}],
					zoom: ${zoom},
					zoomControl: ${isFullScreen},
					dragging: ${editable || isFullScreen},
					scrollWheelZoom: ${editable || isFullScreen},
					doubleClickZoom: ${editable || isFullScreen},
					touchZoom: ${editable || isFullScreen}
				});

				// Add tile layer
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '© OpenStreetMap contributors',
					maxZoom: 19
				}).addTo(map);

				// Handle map move events when editable
				${editable ? `
				let moveTimeout;
				map.on('moveend', function() {
					const center = map.getCenter();
					clearTimeout(moveTimeout);
					moveTimeout = setTimeout(() => {
						window.ReactNativeWebView.postMessage(JSON.stringify({
							type: 'mapMove',
							zoom: map.getZoom(),
							lat: center.lat,
							lng: center.lng
						}));
					}, 100);
				});
				map.on('zoomend', function() {
					try {
						window.ReactNativeWebView.postMessage(JSON.stringify({
							type: 'zoom',
							zoom: map.getZoom()
						}));
					} catch (e) {}
					});
				` : ''}
			</script>
		</body>
		</html>
	`;

	const MapContent = ({ isFullScreen = false }: { isFullScreen?: boolean }) => (
		<View style={[
			isFullScreen ? styles.fullScreenContainer : { height },
			!isFullScreen && containerStyle
		]}>
			<WebView
				style={styles.webview}
				originWhitelist={['*']}
				source={{ html: generateMapHTML(isFullScreen) }}
				onMessage={(event) => {
					try {
						const data = JSON.parse(event.nativeEvent.data);
						if (data.type === 'mapMove') {
							handleMapMove(data.lat, data.lng);
							if (typeof data.zoom === 'number') setZoom(data.zoom);
						} else if (data.type === 'zoom') {
							if (typeof data.zoom === 'number') setZoom(data.zoom);
						}
					} catch (error) {
						console.error('Error parsing map message:', error);
					}
				}}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				scrollEnabled={false}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			/>

			{/* Marker */}
			<View style={styles.centerMarkerContainer} pointerEvents="none">
				<View style={styles.centerMarker}>
					<MapPin size={32} color={lightTheme.colors.error} fill={lightTheme.colors.error} />
				</View>
			</View>

			<View style={styles.topContainer}>
				<View style={styles.contentWrapper}>
					{(location.address && showAddress) && (
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
						activeOpacity={0.7}
					>
						<Expand size={20} color={lightTheme.colors.onPrimary} />
					</TouchableOpacity>
				)}
			</View>

			{editable && (
				<View style={styles.editHintContainer}>
					<Text style={styles.editHintText}>
						Mueve el mapa para ajustar la ubicación
					</Text>
				</View>
			)}
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
					presentationStyle="fullScreen"
					statusBarTranslucent
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Ubicación del reporte</Text>
							<TouchableOpacity
								onPress={() => setIsExpanded(false)}
								style={styles.closeButton}
								activeOpacity={0.7}
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
	webview: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	centerMarkerContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	centerMarker: {
		marginBottom: 32, // Offset to center the pin point
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
	editHintContainer: {
		position: "absolute",
		bottom: spacing.md,
		left: spacing.md,
		right: spacing.md,
		backgroundColor: lightTheme.colors.primaryContainer,
		padding: spacing.sm,
		borderRadius: roundness.sm,
		alignItems: "center",
		zIndex: 5,
	},
	editHintText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onPrimaryContainer,
		fontWeight: "500",
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