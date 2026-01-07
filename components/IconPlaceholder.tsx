import { roundness } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface IconPlaceholderProps {
	icon: LucideIcon;
	size: number;
	color?: string;
	rounded?: number;
	borderWidth?: number;
}

export function IconPlaceholder({
	icon: Icon,
	size,
	color,
	rounded = roundness.md,
	borderWidth = 0
}: IconPlaceholderProps) {
	const { theme } = useAppTheme();
	const iconColor = color || theme.colors.secondary;
	return (
		<View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					borderRadius: rounded,
					borderWidth,
					borderColor: iconColor
				},
			]}
		>
			<Icon
				size={size * 0.7}
				color={iconColor}
				strokeWidth={1.5}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "transparent",
	},
});