import { Card } from '@/components/Card';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
	Modal,
	ModalProps,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

type IOSDatePickerModalProps = Omit<ModalProps, 'visible'> & {
	visible: boolean;
	value: Date;
	onChange: (event: any, date?: Date) => void;
	onConfirm: () => void;
	onCancel: () => void;
	minimumDate?: Date;
	maximumDate?: Date;
	title?: string;
};

export function IOSDatePickerModal({
	visible,
	value,
	onChange,
	onConfirm,
	onCancel,
	minimumDate,
	maximumDate,
	title = 'Seleccionar Fecha',
	...props
}: IOSDatePickerModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
			{...props}
		>
			<Pressable style={styles.overlay} onPress={onCancel}>
				<View style={styles.centered}>
					<Pressable
						style={styles.content}
						onPress={(e) => e.stopPropagation()}
					>
						<Card
							shadow="medium"
							backgroundColor={lightTheme.colors.surface}
							paddingX={0}
							paddingY={0}
							rounded={roundness.md}
							style={styles.card}
						>
							<View style={styles.header}>
								<TouchableOpacity onPress={onCancel}>
									<Text style={styles.cancelText}>Cancelar</Text>
								</TouchableOpacity>
								<Text style={styles.title}>{title}</Text>
								<TouchableOpacity onPress={onConfirm}>
									<Text style={styles.confirmText}>Confirmar</Text>
								</TouchableOpacity>
							</View>
							<DateTimePicker
								value={value}
								mode="date"
								display="spinner"
								locale="es-ES" // force Spanish
								onChange={onChange}
								maximumDate={maximumDate}
								minimumDate={minimumDate}
								textColor={lightTheme.colors.onSurface}
								style={styles.picker}
							/>
						</Card>
					</Pressable>
				</View>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: lightTheme.colors.backdrop,
		justifyContent: 'center',
		alignItems: 'center',
	},
	centered: {
		width: '100%',
		maxWidth: 400,
		paddingHorizontal: spacing.lg,
	},
	content: {
		width: '100%',
	},
	card: {
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: lightTheme.colors.outline,
	},
	title: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	cancelText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
	},
	confirmText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	picker: {
		height: 200,
		backgroundColor: lightTheme.colors.surface,
	},
});