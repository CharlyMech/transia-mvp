import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import type { Report } from '@/models/report';
import { Check, Eye, Trash2, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface ReportActionsModalProps {
	visible: boolean;
	report: Report | null;
	onClose: () => void;
	onViewReport: (reportId: string) => void;
	onMarkAsRead: (reportId: string) => void;
	onMarkAsUnread: (reportId: string) => void;
	onDelete: (reportId: string) => void;
}

export function ReportActionsModal({
	visible,
	report,
	onClose,
	onViewReport,
	onMarkAsRead,
	onMarkAsUnread,
	onDelete,
}: ReportActionsModalProps) {
	const opacity = useSharedValue(0);
	const translateY = useSharedValue(300);

	useEffect(() => {
		if (visible) {
			opacity.value = withTiming(1, { duration: 200 });
			translateY.value = withTiming(0, { duration: 200 });
		} else {
			opacity.value = withTiming(0, { duration: 150 });
			translateY.value = withTiming(300, { duration: 150 });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	const animatedBackdropStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const animatedModalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	if (!report) return null;

	const handleAction = (action: () => void) => {
		action();
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<Animated.View style={[styles.modalContainer, animatedModalStyle]}>
					<Pressable onPress={(e) => e.stopPropagation()}>
						<View style={styles.modal}>
							<View style={styles.header}>
								<Text style={styles.title}>Acciones</Text>
								<TouchableOpacity onPress={onClose} style={styles.closeButton}>
									<X size={24} color={lightTheme.colors.onSurfaceVariant} />
								</TouchableOpacity>
							</View>

							<View style={styles.actions}>
								<TouchableOpacity
									style={styles.actionButton}
									onPress={() => handleAction(() => onViewReport(report.id))}
								>
									<Eye size={22} color={lightTheme.colors.primary} />
									<Text style={styles.actionText}>Ver reporte</Text>
								</TouchableOpacity>

								{report.read ?
									<TouchableOpacity
										style={styles.actionButton}
										onPress={() => handleAction(() => onMarkAsUnread(report.id))}
									>
										<Check size={22} color={lightTheme.colors.tertiary} />
										<Text style={styles.actionText}>Marcar como no leído</Text>
									</TouchableOpacity>
									:
									<TouchableOpacity
										style={styles.actionButton}
										onPress={() => handleAction(() => onMarkAsRead(report.id))}
									>
										<Check size={22} color={lightTheme.colors.tertiary} />
										<Text style={styles.actionText}>Marcar como leído</Text>
									</TouchableOpacity>
								}

								<TouchableOpacity
									style={[styles.actionButton, styles.dangerAction]}
									onPress={() => handleAction(() => onDelete(report.id))}
								>
									<Trash2 size={22} color={lightTheme.colors.error} />
									<Text style={[styles.actionText, styles.dangerText]}>
										Eliminar
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Pressable>
				</Animated.View>
			</Animated.View>
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
		width: '90%',
		maxWidth: 400,
	},
	modal: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.md,
		padding: spacing.md,
		shadowColor: lightTheme.colors.shadow,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: roundness.md,
		elevation: 8,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	title: {
		fontSize: typography.titleLarge,
		fontWeight: '700',
		color: lightTheme.colors.onSurface,
	},
	closeButton: {
		padding: 4,
	},
	reportInfo: {
		backgroundColor: lightTheme.colors.surfaceVariant,
		padding: spacing.md,
		borderRadius: roundness.md,
		marginBottom: spacing.md,
	},
	reportTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.md,
	},
	reportDate: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	actions: {
		gap: 8,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		borderRadius: roundness.md,
		backgroundColor: lightTheme.colors.surfaceVariant,
		gap: spacing.md,
	},
	actionText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	dangerAction: {
		backgroundColor: lightTheme.colors.errorContainer,
	},
	dangerText: {
		color: lightTheme.colors.error,
	},
});