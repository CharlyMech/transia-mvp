import { lightTheme, roundness } from '@/constants/theme';
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
	color = lightTheme.colors.secondary,
	rounded = roundness.md,
	borderWidth = 0
}: IconPlaceholderProps) {
	return (
		<View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					borderRadius: rounded,
					borderWidth,
					borderColor: color
				},
			]}
		>
			<Icon
				size={size * 0.7}
				color={color}
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