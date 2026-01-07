import { DriverStatus } from '@/constants/enums/DriverStatus';
import { VehicleStatus } from '@/constants/enums/VehicleStatus';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusType = DriverStatus | VehicleStatus | "PENDING" | "RESOLVED";

interface StatusConfig {
	label: string;
	color: string;
}

interface StatusLabelProps {
	status: StatusType;
	Icon: LucideIcon;
	iconSize?: number;
	textSize?: number;
}

export function StatusLabel({ status, Icon, iconSize = 16, textSize = typography.bodySmall }: StatusLabelProps) {
	const { theme } = useAppTheme();

	const getStatusConfig = (status: StatusType): StatusConfig => {
		switch (status) {
			// Driver statuses
			case DriverStatus.ACTIVE:
				return {
					label: "Activo",
					color: theme.colors.statusActive,
				};
			case DriverStatus.INACTIVE:
				return {
					label: "Inactivo",
					color: theme.colors.statusInactive,
				};
			case DriverStatus.SICK_LEAVE:
				return {
					label: "Baja médica",
					color: theme.colors.statusSickLeave,
				};
			case DriverStatus.HOLIDAYS:
				return {
					label: "Vacaciones",
					color: theme.colors.statusHolidays,
				};

			// Vehicle statuses
			case VehicleStatus.ACTIVE:
				return {
					label: "Activo",
					color: theme.colors.statusActive,
				};
			case VehicleStatus.INACTIVE:
				return {
					label: "Inactivo",
					color: theme.colors.statusInactive,
				};
			case VehicleStatus.BROKEN_DOWN:
				return {
					label: "Averiado",
					color: theme.colors.statusBrokenDown,
				};
			case VehicleStatus.MAINTENANCE:
				return {
					label: "Mantenimiento",
					color: theme.colors.statusMaintenance,
				};

			// Report statuses
			case "PENDING":
				return {
					label: "Pendiente",
					color: theme.colors.warning,
				};
			case "RESOLVED":
				return {
					label: "Resuelta",
					color: theme.colors.statusActive,
				};

			default:
				return {
					label: "Desconocido",
					color: theme.colors.onSurfaceVariant,
				};
		}
	};

	const config = getStatusConfig(status);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: `${config.color}15` }
			]}
		>
			<Icon size={iconSize} color={config.color} />
			<Text style={[styles.label, { color: config.color, fontSize: textSize }]}>
				{config.label}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.xs,
		flexShrink: 0,
	},
	label: {
		fontWeight: "600",
	},
});