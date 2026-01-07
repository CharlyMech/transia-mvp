import { roundness } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonCardProps {
	height?: number;
	backgroundColor?: string;
	shimmerColor?: string;
	borderRadius?: number;
}

export function SkeletonCard({
	height = 80,
	backgroundColor,
	shimmerColor,
	borderRadius = roundness.sm,
}: SkeletonCardProps) {
	const { theme } = useAppTheme();
	const bgColor = backgroundColor || theme.colors.surface;
	const animationColor = shimmerColor || (theme.dark || theme.colors.surface === "#151A15" ? `${theme.colors.onSurface}20` : `${theme.colors.shadow}30`);

	const pulseAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const pulse = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		);
		pulse.start();

		return () => pulse.stop();
	}, [pulseAnim]);

	const opacity = pulseAnim.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0.5, 0.8, 0.5],
	});

	return (
		<View style={[styles.card, { height, backgroundColor: bgColor, borderRadius }]}>
			<Animated.View
				style={[
					styles.shimmer,
					{
						opacity,
						backgroundColor: animationColor,
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		overflow: 'hidden',
		position: 'relative',
	},
	shimmer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});