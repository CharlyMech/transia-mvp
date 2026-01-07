import { roundness, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import React, { useMemo } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonCard } from './SkeletonCard';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 44;
const HEADER_HEIGHT = 250;

export function SkeletonDetail() {
	const { theme } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.topSpacer} />

			<View style={[styles.content, { padding: spacing.md, marginBottom: spacing.md }]}>
				{/* Checkbox skeleton */}
				<View style={styles.section}>
					<View style={styles.checkboxContainer}>
						<SkeletonCard height={24} />
					</View>
				</View>

				{/* Info Card Skeleton */}
				<View style={styles.section}>
					<SkeletonCard height={20} />
					<SkeletonCard height={140} />
				</View>

				{/* Description Skeleton */}
				<View style={styles.section}>
					<SkeletonCard height={20} />
					<SkeletonCard height={100} />
				</View>

				{/* Images Skeleton */}
				<View style={styles.section}>
					<SkeletonCard height={20} />
					<SkeletonCard height={280} />
				</View>
			</View>
		</SafeAreaView>
	);
}

export function SkeletonHeaderDetail() {
	const { theme, isDark } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	return (
		<View style={styles.headerContainer}>
			<StatusBar
				barStyle={isDark ? "light-content" : "dark-content"}
				backgroundColor="transparent"
				translucent={true}
			/>

			{/* Header */}
			<View style={styles.header}>
				<View style={styles.imageContainer}>
					<View style={styles.imageWrapper}>
						<SkeletonCard
							height={180}
							backgroundColor={`${theme.colors.onPrimary}80`}
							shimmerColor={`${theme.colors.onPrimary}B0`}
							borderRadius={roundness.md}
						/>
					</View>
				</View>
			</View>

			{/* Overlay to simulate status bar */}
			<View style={styles.backgroundOverlay} />

			{/* Main content */}
			<View style={styles.scrollContent}>
				<View style={[styles.headerSpacer, { height: HEADER_HEIGHT + STATUS_BAR_HEIGHT }]} />

				<View style={styles.contentWithPadding}>
					<View style={styles.statusBadgeContainer}>
						<SkeletonCard height={32} />
					</View>

					<View style={styles.nameSection}>
						<SkeletonCard height={36} />
					</View>

					<View style={styles.section}>
						<SkeletonCard height={20} />
						<SkeletonCard height={140} />
					</View>

					<View style={styles.section}>
						<SkeletonCard height={20} />
						<SkeletonCard height={180} />
					</View>

					<View style={styles.section}>
						<SkeletonCard height={20} />
						<SkeletonCard height={100} />
					</View>
				</View>
			</View>
		</View>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	topSpacer: {
		width: '100%',
		height: 30,
		backgroundColor: theme.colors.background,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingTop: spacing.md,
		gap: spacing.md,
	},
	checkboxContainer: {
		width: 120,
		flex: 1,
		alignSelf: 'flex-end',
		marginBottom: spacing.md,
	},
	section: {
		gap: spacing.md,
	},

	headerContainer: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: HEADER_HEIGHT + STATUS_BAR_HEIGHT,
		zIndex: 1000,
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: STATUS_BAR_HEIGHT,
	},
	backgroundOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: STATUS_BAR_HEIGHT + 55,
		zIndex: 1001,
		backgroundColor: theme.colors.background,
		opacity: 0,
	},
	imageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageWrapper: {
		width: 180,
		height: 180,
		borderRadius: roundness.md,
		overflow: 'hidden',
	},
	scrollContent: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	headerSpacer: {
		backgroundColor: 'transparent',
	},
	contentWithPadding: {
		flex: 1,
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: spacing.md,
		borderTopRightRadius: spacing.md,
		paddingHorizontal: spacing.md,
		paddingTop: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	statusBadgeContainer: {
		width: 100,
		alignSelf: 'flex-end',
		marginBottom: spacing.xs,
	},
	nameSection: {
		width: '70%',
		marginBottom: spacing.xs,
	},
});