import { lightTheme, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";


type InfoRowProps = {
	label: string;
	value: string;
	labelFlex?: number;
	valueFlex?: number;
};

export function InfoRow({ label, value, labelFlex = 1, valueFlex = 1 }: InfoRowProps) {
	return (
		<View style={styles.infoRow}>
			<Text style={[styles.infoLabel, { flex: labelFlex }]}>{label}</Text>
			<Text style={[styles.infoValue, { flex: valueFlex }]}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: spacing.xs,
	},
	infoLabel: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	infoValue: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: lightTheme.colors.onSurface,
		textAlign: 'right',
	},
})