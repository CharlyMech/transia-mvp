import { lightTheme, roundness } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonCardProps {
	height?: number;
}

export function SkeletonCard({ height = 80 }: SkeletonCardProps) {
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
		<View style={[styles.card, { height }]}>
			<Animated.View
				style={[
					styles.shimmer,
					{ opacity },
				]}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	card: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		overflow: 'hidden',
		position: 'relative',
	},
	shimmer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: `${lightTheme.colors.shadow}30`,
	},
});