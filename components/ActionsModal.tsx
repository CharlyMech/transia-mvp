import { Card } from "@/components/Card";
import { lightTheme, spacing, typography } from "@/constants/theme";
import { X } from "lucide-react-native";
import {
	Modal,
	ModalProps,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";

type SimpleModalProps = Omit<ModalProps, 'visible'> & {
	visible: boolean;
	onClose: () => void;
	title?: string;
	animationType?: 'fade' | 'slide' | 'none';
	children: React.ReactNode;
};

export function ActionsModal({ visible, onClose, title, animationType = 'fade', children, ...props }: SimpleModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType={animationType}
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
						<View>
							{title && (
								<View style={styles.titleContainer}>
									<Text style={styles.title}>{title}</Text>
								</View>
							)}
							<Pressable style={styles.closeButton} onPress={onClose}>
								<X size={28} color={lightTheme.colors.onSurface} />
							</Pressable>
						</View>


						<View style={styles.childrenContainer}>
							{children}
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
	},
	content: {
		width: "100%",
		padding: spacing.md
	},
	closeButton: {
		position: "absolute",
		top: spacing.sm,
		right: spacing.sm,
		zIndex: 1,
		padding: spacing.xs,
	},
	titleContainer: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.sm,
	},
	title: {
		fontSize: typography.headlineSmall,
		fontWeight: "600",
	},
	childrenContainer: {
		padding: spacing.lg,
	},
});