import { lightTheme, spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonCard } from './SkeletonCard';

interface SkeletonListProps {
	count?: number;
	cardHeight?: number;
}

export function SkeletonList({
	count = 8,
	cardHeight = 100
}: SkeletonListProps) {
	return (
		<View style={styles.container}>
			<View
				style={styles.view}
			>
				{Array.from({ length: count }).map((_, index) => (
					<SkeletonCard
						key={index}
						height={cardHeight}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		width: "100%",
		padding: spacing.sm
	},
	view: {
		flex: 1,
		gap: spacing.sm,
		width: "100%",
	},
});