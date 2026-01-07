import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
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
	backgroundCircleColor,
	textColor,
	remainingTextColor,
}: CircularProgressProps) {
	const { theme } = useAppTheme();

	const baseRadius = (size - strokeWidth) / 2;
	const circumference = baseRadius * 2 * Math.PI;

	// Calculate progress (can exceed 100%)
	const progress = currentMinutes / targetMinutes;

	// Use provided colors or defaults from theme
	const mainColor = circleColor || theme.colors.primary;
	const bgCircleColor = backgroundCircleColor || `${theme.colors.outline}30`;
	const mainTextColor = textColor || theme.colors.onSurface;
	const secondaryTextColor = remainingTextColor || theme.colors.onSurfaceVariant;

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

	// iOS-style overlap rendering
	const renderProgressArcs = () => {
		const arcs: any[] = [];

		if (progress <= 0) return arcs;

		// First arc (up to 100%)
		const firstArcProgress = Math.min(progress, 1);
		const firstStrokeDashoffset = circumference - (firstArcProgress * circumference);

		arcs.push(
			<Circle
				key="arc1"
				cx={size / 2}
				cy={size / 2}
				r={baseRadius}
				stroke={mainColor}
				strokeWidth={strokeWidth}
				fill="none"
				strokeDasharray={`${circumference} ${circumference}`}
				strokeDashoffset={firstStrokeDashoffset}
				strokeLinecap="round"
				rotation="-90"
				origin={`${size / 2}, ${size / 2}`}
			/>
		);

		// Overlapping arc (progress > 100%)
		if (progress > 1) {
			const overlapProgress = progress - 1;
			const overlapStrokeDashoffset = circumference - (Math.min(overlapProgress, 1) * circumference);

			// iOS effect: brighter color with reduced opacity for overlap
			arcs.push(
				<Circle
					key="arc2"
					cx={size / 2}
					cy={size / 2}
					r={baseRadius}
					stroke={mainColor}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={overlapStrokeDashoffset}
					strokeLinecap="round"
					rotation="-90"
					origin={`${size / 2}, ${size / 2}`}
					opacity={0.8}
				/>
			);

			// Additional subtle indicator for > 200%
			if (progress > 2) {
				const extraProgress = progress - 2;
				const extraStrokeDashoffset = circumference - (Math.min(extraProgress, 1) * circumference);

				arcs.push(
					<Circle
						key="arc3"
						cx={size / 2}
						cy={size / 2}
						r={baseRadius}
						stroke={mainColor}
						strokeWidth={strokeWidth}
						fill="none"
						strokeDasharray={`${circumference} ${circumference}`}
						strokeDashoffset={extraStrokeDashoffset}
						strokeLinecap="round"
						rotation="-90"
						origin={`${size / 2}, ${size / 2}`}
						opacity={0.6}
					/>
				);
			}
		}

		return arcs;
	};

	return (
		<View style={styles.circularProgressContainer}>
			<Svg width={size} height={size}>
				{/* Background circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={baseRadius}
					stroke={bgCircleColor}
					strokeWidth={strokeWidth}
					fill="none"
				/>

				{/* Progress arcs with iOS-style overlap */}
				{renderProgressArcs()}

				{/* Center time text */}
				<SvgText
					x={size / 2}
					y={size / 2 - 10}
					textAnchor="middle"
					fontSize="32"
					fontWeight="700"
					fill={mainTextColor}
				>
					{formattedTime}
				</SvgText>

				{/* Remaining time text */}
				<SvgText
					x={size / 2}
					y={size / 2 + 20}
					textAnchor="middle"
					fontSize="14"
					fill={secondaryTextColor}
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