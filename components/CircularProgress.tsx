import { lightTheme, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface CircularProgressProps {
	currentMinutes: number;
	targetMinutes?: number;
	size?: number;
	strokeWidth?: number;
	circleColor?: string;
	backgroundCircleColor?: string;
	textColor?: string;
	remainingTextColor?: string;
}

export function CircularProgress({
	currentMinutes,
	targetMinutes = 480, // 8 hours = 480 minutes
	size = 160,
	strokeWidth = 20,
	circleColor,
	backgroundCircleColor = `${lightTheme.colors.outline}50`,
	textColor = lightTheme.colors.onSurface,
	remainingTextColor = lightTheme.colors.onSurfaceVariant,
}: CircularProgressProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;

	// Allow progress to exceed 100%
	const progress = currentMinutes / targetMinutes;
	const strokeDashoffset = circumference - (Math.min(progress, 1) * circumference);

	const hours = Math.floor(currentMinutes / 60);
	const minutes = currentMinutes % 60;
	const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

	// Calculate remaining/exceeded time text
	const diff = targetMinutes - currentMinutes;
	const absDiff = Math.abs(diff);
	const diffHours = Math.floor(absDiff / 60);
	const diffMinutes = absDiff % 60;

	let remainingText = '';
	if (diff > 0) {
		remainingText = `Quedan ${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
	} else if (diff < 0) {
		remainingText = `+${diffHours}:${diffMinutes.toString().padStart(2, '0')} extras`;
	} else {
		remainingText = 'Completado';
	}

	return (
		<View style={styles.circularProgressContainer}>
			<Svg width={size} height={size}>
				{/* Background circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={backgroundCircleColor}
					strokeWidth={strokeWidth}
					fill="none"
				/>

				{/* Progress circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={circleColor}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					rotation="-90"
					origin={`${size / 2}, ${size / 2}`}
				/>

				{/* Center time text */}
				<SvgText
					x={size / 2}
					y={size / 2 - 10}
					textAnchor="middle"
					fontSize="32"
					fontWeight="700"
					fill={textColor}
				>
					{formattedTime}
				</SvgText>

				{/* Remaining time text */}
				<SvgText
					x={size / 2}
					y={size / 2 + 20}
					textAnchor="middle"
					fontSize="14"
					fill={remainingTextColor}
				>
					{remainingText}
				</SvgText>
			</Svg>
		</View>
	);
}

const styles = StyleSheet.create({
	circularProgressContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.md,
	},
});