import { lightTheme } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SkeletonBox({
	width,
	height,
	style
}: {
	width?: number | string;
	height?: number;
	style?: any;
}) {
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const shimmer = Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnim, {
					toValue: 1,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnim, {
					toValue: 0,
					duration: 1500,
					useNativeDriver: true,
				}),
			])
		);
		shimmer.start();

		return () => shimmer.stop();
	}, [shimmerAnim]);

	const translateX = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-200, 200],
	});

	const opacity = shimmerAnim.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0.3, 0.5, 0.3],
	});

	return (
		<View
			style={[
				{
					width,
					height,
					backgroundColor: lightTheme.colors.surface,
					borderRadius: 12,
					overflow: 'hidden',
					position: 'relative',
				},
				style,
			]}
		>
			<Animated.View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: lightTheme.colors.surfaceVariant,
					opacity,
					transform: [{ translateX }],
				}}
			/>
		</View>
	);
}

export function SkeletonHome() {
	return (
		<SafeAreaView
			style={styles.container}
		// contentContainerStyle={styles.contentContainer}
		// showsVerticalScrollIndicator={false}
		>
			{/* Header Section */}
			<View style={styles.headerSection}>
				<SkeletonBox height={32} width="60%" style={styles.headerTitle} />
				<SkeletonBox height={16} width="40%" style={styles.headerSubtitle} />
			</View>

			{/* Stats Cards Section */}
			<View style={styles.statsSection}>
				<View style={styles.statsRow}>
					<SkeletonBox height={120} style={styles.statCard} />
					<SkeletonBox height={120} style={styles.statCard} />
				</View>

				<View style={styles.statsRow}>
					<SkeletonBox height={120} style={styles.statCard} />
					<SkeletonBox height={120} style={styles.statCard} />
				</View>
			</View>

			{/* Recent Activity Section */}
			<View style={styles.section}>
				<SkeletonBox height={20} width="50%" style={styles.sectionTitle} />
				<SkeletonBox height={120} style={styles.activityCard} />
				<SkeletonBox height={120} style={styles.activityCard} />
			</View>

			{/* Quick Actions Section */}
			<View style={styles.section}>
				<SkeletonBox height={20} width="40%" style={styles.sectionTitle} />
				<View style={styles.actionsRow}>
					<SkeletonBox height={56} style={styles.actionButton} />
					<SkeletonBox height={56} style={styles.actionButton} />
					<SkeletonBox height={56} style={styles.actionButton} />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	contentContainer: {
		padding: 16,
	},
	headerSection: {
		marginBottom: 24,
	},
	headerTitle: {
		marginBottom: 8,
	},
	headerSubtitle: {
		marginBottom: 4,
	},
	statsSection: {
		marginBottom: 24,
	},
	statsRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 12,
	},
	statCard: {
		flex: 1,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		marginBottom: 12,
	},
	activityCard: {
		marginBottom: 12,
	},
	actionsRow: {
		flexDirection: 'row',
		gap: 12,
	},
	actionButton: {
		flex: 1,
	},
});