import { lightTheme, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Text as SvgText } from 'react-native-svg';


export function CircularProgress({
	currentMinutes,
	targetMinutes = 480, // 8 hours = 480 minutes
	size = 160
}: {
	currentMinutes: number;
	targetMinutes?: number;
	size?: number;
}) {
	const strokeWidth = 20;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const progress = Math.min(currentMinutes / targetMinutes, 1);
	const strokeDashoffset = circumference - progress * circumference;

	const hours = Math.floor(currentMinutes / 60);
	const minutes = currentMinutes % 60;
	const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

	return (
		<View style={styles.circularProgressContainer}>
			<Svg width={size} height={size}>
				{/* Background circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={`${lightTheme.colors.outline}50`}
					strokeWidth={strokeWidth}
					fill="none"
				/>

				{/* Progress circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={lightTheme.colors.primary}
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
					fill={lightTheme.colors.onSurface}
				>
					{formattedTime}
				</SvgText>

				{/* Remaining time text */}
				<SvgText
					x={size / 2}
					y={size / 2 + 20}
					textAnchor="middle"
					fontSize="14"
					fill={lightTheme.colors.onSurfaceVariant}
				>
					{targetMinutes - currentMinutes > 0
						? `Quedan ${Math.floor((targetMinutes - currentMinutes) / 60)}:${((targetMinutes - currentMinutes) % 60).toString().padStart(2, '0')}`
						: 'Completado'}
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
