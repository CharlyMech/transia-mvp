import { DriverStatus } from "@/constants/enums/DriverStatus";
import { VehicleStatus } from "@/constants/enums/VehicleStatus";
import { roundness, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Status = DriverStatus | VehicleStatus;

export function StatusBadge({ status }: { status: Status }) {
	const { theme } = useAppTheme();

	let label = "";
	let containerColor = theme.colors.surfaceVariant;
	let textColor = theme.colors.onSurfaceVariant;

	switch (status) {
		case DriverStatus.ACTIVE:
		case VehicleStatus.ACTIVE:
			label = "Activo";
			containerColor = theme.colors.statusActiveContainer;
			textColor = theme.colors.statusActive;
			break;

		case DriverStatus.INACTIVE:
		case VehicleStatus.INACTIVE:
			label = "Inactivo";
			containerColor = theme.colors.statusInactiveContainer;
			textColor = theme.colors.statusInactive;
			break;

		case VehicleStatus.MAINTENANCE:
			label = "Mantenimiento";
			containerColor = theme.colors.statusMaintenanceContainer;
			textColor = theme.colors.statusMaintenance;
			break;

		case VehicleStatus.BROKEN_DOWN:
			label = "Averiado";
			containerColor = theme.colors.statusBrokenDownContainer;
			textColor = theme.colors.statusBrokenDown;
			break;

		case DriverStatus.SICK_LEAVE:
			label = "Baja médica";
			containerColor = theme.colors.statusSickLeaveContainer;
			textColor = theme.colors.statusSickLeave;
			break;

		case DriverStatus.HOLIDAYS:
			label = "Vacaciones";
			containerColor = theme.colors.statusHolidaysContainer;
			textColor = theme.colors.statusHolidays;
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