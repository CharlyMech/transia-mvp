import { DriverStatus } from "@/constants/enums/DriverStatus";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { lightTheme, roundness, typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Status = DriverStatus | VehicleStatus;

export function StatusBadge({ status }: { status: Status }) {
	let label = "";
	let containerColor = lightTheme.colors.surfaceVariant;
	let textColor = lightTheme.colors.onSurfaceVariant;

	switch (status) {
		case DriverStatus.ACTIVE:
		case VehicleStatus.ACTIVE:
			label = "Activo";
			containerColor = lightTheme.colors.statusActiveContainer;
			textColor = lightTheme.colors.statusActive;
			break;

		case DriverStatus.INACTIVE:
		case VehicleStatus.INACTIVE:
			label = "Inactivo";
			containerColor = lightTheme.colors.statusInactiveContainer;
			textColor = lightTheme.colors.statusInactive;
			break;

		case VehicleStatus.MAINTENANCE:
			label = "Mantenimiento";
			containerColor = lightTheme.colors.statusMaintenanceContainer;
			textColor = lightTheme.colors.statusMaintenance;
			break;

		case VehicleStatus.BROKEN_DOWN:
			label = "Averiado";
			containerColor = lightTheme.colors.statusBrokenDownContainer;
			textColor = lightTheme.colors.statusBrokenDown;
			break;

		case DriverStatus.SICK_LEAVE:
			label = "Baja médica";
			containerColor = lightTheme.colors.statusSickLeaveContainer;
			textColor = lightTheme.colors.statusSickLeave;
			break;

		case DriverStatus.HOLIDAYS:
			label = "Vacaciones";
			containerColor = lightTheme.colors.statusHolidaysContainer;
			textColor = lightTheme.colors.statusHolidays;
			break;

		default:
			label = "Desconocido";
	}

	return (
		<View style={styles.statusBadgeContainer}>
			<View style={[styles.statusBadge, { backgroundColor: containerColor }]}>
				<Text style={[styles.statusText, { color: textColor }]}>● {label}</Text>
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