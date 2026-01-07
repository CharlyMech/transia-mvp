import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
	label: string;
	icon?: LucideIcon;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'outline';
	width?: string;
	disabled?: boolean;
}

export function Button({
	label,
	icon: Icon,
	onPress,
	variant = 'primary',
	// width = "100%",
	disabled = false,
}: ButtonProps) {
	const { theme } = useAppTheme();

	const buttonStyles = [
		styles.button,
		variant === 'primary' && { backgroundColor: theme.colors.primary },
		variant === 'secondary' && { backgroundColor: theme.colors.secondary },
		variant === 'outline' && {
			backgroundColor: 'transparent',
			borderWidth: 1,
			borderColor: theme.colors.outline,
		},
		disabled && { backgroundColor: theme.colors.surfaceDisabled },
	];

	const textColor = disabled
		? theme.colors.onSurfaceDisabled
		: variant === 'primary'
			? theme.colors.onPrimary
			: variant === 'secondary'
				? theme.colors.onSecondary
				: theme.colors.primary;

	return (
		<TouchableOpacity
			style={[buttonStyles]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
		>
			{Icon && <Icon size={20} color={textColor} />}
			<Text style={[styles.text, { color: textColor }]}>{label}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		borderRadius: roundness.sm,
		gap: spacing.sm,
		alignSelf: 'flex-start',
	},
	text: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
	},
});