import { Status } from "@/constants/enums/Status";
import { lightTheme, roundness, typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function StatusBadge({ status }: { status: Status }) {
	let label = "";
	let containerColor = lightTheme.colors.surfaceVariant;
	let textColor = lightTheme.colors.onSurfaceVariant;

	switch (status) {
		case Status.ACTIVE:
			label = Status.ACTIVE;
			containerColor = lightTheme.colors.statusActiveContainer;
			textColor = lightTheme.colors.statusActive;
			break;
		case Status.INACTIVE:
			label = Status.INACTIVE;
			containerColor = lightTheme.colors.statusInactiveContainer;
			textColor = lightTheme.colors.statusInactive;
			break;
		case Status.MAINTENANCE:
			label = Status.MAINTENANCE;
			containerColor = lightTheme.colors.statusMaintenanceContainer;
			textColor = lightTheme.colors.statusMaintenance;
			break;
		case Status.BROKEN_DOWN:
			label = Status.BROKEN_DOWN;
			containerColor = lightTheme.colors.statusBrokenDownContainer;
			textColor = lightTheme.colors.statusBrokenDown;
			break;
		default:
			label = "Desconocido";
	}

	return (
		<View style={styles.statusBadgeContainer}>
			<View style={[styles.statusBadge, { backgroundColor: containerColor }]}>
				<Text style={[styles.statusText, { color: textColor }]}>{label}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	statusBadgeContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	statusBadge: {
		width: 140,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: roundness.full,
	},
	statusText: {
		fontSize: typography.bodyMedium,
		fontWeight: "700",
	},
});