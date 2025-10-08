import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
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
	const buttonStyles = [
		styles.button,
		variant === 'primary' && { backgroundColor: lightTheme.colors.primary },
		variant === 'secondary' && { backgroundColor: lightTheme.colors.secondary },
		variant === 'outline' && {
			backgroundColor: 'transparent',
			borderWidth: 1,
			borderColor: lightTheme.colors.outline,
		},
		disabled && { backgroundColor: lightTheme.colors.surfaceDisabled },
	];

	const textColor = disabled
		? lightTheme.colors.onSurfaceDisabled
		: variant === 'primary'
			? lightTheme.colors.onPrimary
			: variant === 'secondary'
				? lightTheme.colors.onSecondary
				: lightTheme.colors.primary;

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