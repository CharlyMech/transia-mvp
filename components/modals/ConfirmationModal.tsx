import { lightTheme } from '@/constants/theme';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface ConfirmationModalProps {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
	visible,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	onConfirm,
	onCancel,
	variant = 'warning',
}: ConfirmationModalProps) {
	const getIconColor = () => {
		switch (variant) {
			case 'danger':
				return lightTheme.colors.error;
			case 'warning':
				return lightTheme.colors.warning;
			case 'info':
				return lightTheme.colors.primary;
			default:
				return lightTheme.colors.primary;
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onCancel}
			statusBarTranslucent
		>
			<Pressable style={styles.backdrop} onPress={onCancel}>
				<View style={styles.modalContainer}>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<View style={styles.modal}>
							<View style={styles.iconContainer}>
								<AlertTriangle size={48} color={getIconColor()} />
							</View>

							<Text style={styles.title}>{title}</Text>
							<Text style={styles.message}>{message}</Text>

							<View style={styles.buttonsContainer}>
								<TouchableOpacity
									style={[styles.button, styles.cancelButton]}
									onPress={onCancel}
								>
									<Text style={styles.cancelButtonText}>{cancelText}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[
										styles.button,
										styles.confirmButton,
										variant === 'danger' && styles.dangerButton,
									]}
									onPress={onConfirm}
								>
									<Text style={styles.confirmButtonText}>{confirmText}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Pressable>
				</View>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: lightTheme.colors.backdrop,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '85%',
		maxWidth: 400,
	},
	modal: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: 24,
		padding: 24,
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 8,
		alignItems: 'center',
	},
	iconContainer: {
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
		marginBottom: 12,
		textAlign: 'center',
	},
	message: {
		fontSize: 15,
		color: lightTheme.colors.onSurfaceVariant,
		marginBottom: 24,
		textAlign: 'center',
		lineHeight: 22,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 12,
		width: '100%',
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		backgroundColor: lightTheme.colors.surfaceVariant,
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	confirmButton: {
		backgroundColor: lightTheme.colors.primary,
	},
	dangerButton: {
		backgroundColor: lightTheme.colors.error,
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
});