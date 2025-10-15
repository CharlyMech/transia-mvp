import { lightTheme, roundness, spacing, typography } from "@/constants/theme";
import { AlertTriangle, X } from "lucide-react-native";
import {
	Modal,
	ModalProps,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { Card } from "./Card";

type ConfirmationModalProps = Omit<ModalProps, 'visible'> & {
	visible: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
};

export function ConfirmationModal({
	visible,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
	...props
}: ConfirmationModalProps) {

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			statusBarTranslucent
			onRequestClose={onClose}
			{...props}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
					<Card
						shadow="medium"
						backgroundColor={lightTheme.colors.surface}
						paddingX={0}
						paddingY={0}
					>
						<Pressable style={styles.closeButton} onPress={onClose}>
							<X size={24} color={lightTheme.colors.onSurface} />
						</Pressable>

						<View style={styles.body}>
							<View style={styles.iconContainer}>
								<AlertTriangle size={56} color={lightTheme.colors.error} />
							</View>

							<Text style={styles.title}>{title}</Text>

							<Text style={styles.message}>{message}</Text>

							<View style={styles.buttonsContainer}>
								<TouchableOpacity
									style={[styles.button, styles.cancelButton]}
									onPress={onClose}
								>
									<Text style={styles.cancelButtonText}>{cancelText}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.button, styles.confirmButton]}
									onPress={onConfirm}
								>
									<Text style={styles.confirmButtonText}>{confirmText}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Card>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: lightTheme.colors.backdrop,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.md,
	},
	content: {
		width: "100%",
	},
	closeButton: {
		position: "absolute",
		top: spacing.sm,
		right: spacing.sm,
		zIndex: 1,
		padding: spacing.xs,
	},
	body: {
		padding: spacing.lg,
		paddingTop: spacing.xl,
		gap: spacing.md,
		alignItems: 'center',
	},
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: typography.headlineSmall,
		fontWeight: "700",
		color: lightTheme.colors.onSurface,
		textAlign: 'center',
	},
	message: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
		lineHeight: 22,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: spacing.sm,
		width: "100%",
		marginTop: spacing.sm,
	},
	button: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.sm,
		borderRadius: roundness.sm,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		backgroundColor: lightTheme.colors.background,
	},
	cancelButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onBackground,
	},
	confirmButton: {
		backgroundColor: lightTheme.colors.error,
	},
	confirmButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onError,
	},
});