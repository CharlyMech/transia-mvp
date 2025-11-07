import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ElevatedButton } from './ElevatedButton';

type AndroidTimePickerProps = {
	visible: boolean;
	value: Date;
	onChange: (d: Date) => void;
	onConfirm: () => void;
	onCancel: () => void;
};

export function AndroidTimePicker({ visible, value, onChange, onConfirm, onCancel }: AndroidTimePickerProps) {
	const [workingDate, setWorkingDate] = useState<Date>(new Date(value));

	useEffect(() => {
		setWorkingDate(new Date(value));
	}, [value]);

	if (!visible) return null;

	const incHour = (delta = 1) => {
		const d = new Date(workingDate);
		d.setHours((d.getHours() + delta + 24) % 24);
		setWorkingDate(d);
		onChange(d);
	};

	const incMinute = (delta = 1) => {
		const d = new Date(workingDate);
		const newMinutes = d.getMinutes() + delta;
		d.setHours((d.getHours() + Math.floor(newMinutes / 60)) % 24);
		d.setMinutes(((newMinutes % 60) + 60) % 60);
		setWorkingDate(d);
		onChange(d);
	};

	const setHour = (h: number) => {
		const d = new Date(workingDate);
		d.setHours(((h % 24) + 24) % 24);
		setWorkingDate(d);
		onChange(d);
	};

	const setMinute = (m: number) => {
		const d = new Date(workingDate);
		d.setMinutes(((m % 60) + 60) % 60);
		setWorkingDate(d);
		onChange(d);
	};

	const two = (n: number) => n.toString().padStart(2, '0');

	return (
		<View style={styles.wrapper}>

			<View style={styles.pickerRow}>
				<View style={styles.segment}>
					<ElevatedButton
						style={styles.smallBtn}
						shadow="none"
						backgroundColor={lightTheme.colors.background}
						paddingX={spacing.xs}
						paddingY={spacing.xs}
						rounded={roundness.sm}
						icon={ChevronUp}
						iconColor={lightTheme.colors.onSurface}
						iconSize={24}
						onPress={() => incHour(1)}
					/>

					<TouchableOpacity style={styles.valueBox} onPress={() => setHour((workingDate.getHours() + 1) % 24)}>
						<Text style={styles.valueText}>{two(workingDate.getHours())}</Text>
					</TouchableOpacity>

					<ElevatedButton
						style={styles.smallBtn}
						shadow="none"
						backgroundColor={lightTheme.colors.background}
						paddingX={spacing.xs}
						paddingY={spacing.xs}
						rounded={roundness.sm}
						icon={ChevronDown}
						iconColor={lightTheme.colors.onSurface}
						iconSize={24}
						onPress={() => incHour(-1)}
					/>
				</View>

				<Text style={styles.colon}>:</Text>

				<View style={styles.segment}>
					<ElevatedButton
						style={styles.smallBtn}
						shadow="none"
						backgroundColor={lightTheme.colors.background}
						paddingX={spacing.xs}
						paddingY={spacing.xs}
						rounded={roundness.sm}
						icon={ChevronUp}
						iconColor={lightTheme.colors.onSurface}
						iconSize={24}
						onPress={() => incMinute(1)}
					/>

					<TouchableOpacity style={styles.valueBox} onPress={() => setMinute((workingDate.getMinutes() + 1) % 60)}>
						<Text style={styles.valueText}>{two(workingDate.getMinutes())}</Text>
					</TouchableOpacity>

					<ElevatedButton
						style={styles.smallBtn}
						shadow="none"
						backgroundColor={lightTheme.colors.background}
						paddingX={spacing.xs}
						paddingY={spacing.xs}
						rounded={roundness.sm}
						icon={ChevronDown}
						iconColor={lightTheme.colors.onSurface}
						iconSize={24}
						onPress={() => incMinute(-1)}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: 'transparent',
	},
	pickerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.lg,
	},
	segment: {
		alignItems: 'center',
		gap: spacing.xs,
	},
	smallBtn: {
		width: '50%',
	},
	smallBtnText: {
		fontSize: 16,
		color: lightTheme.colors.onSurface,
		fontWeight: '700',
	},
	valueBox: {
		marginVertical: 4,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		minWidth: 72,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: roundness.sm,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		backgroundColor: lightTheme.colors.surface,
	},
	valueText: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
	},
	colon: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
	},
});
