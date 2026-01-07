import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';

interface CarouselProps {
	data: any[];
	renderItem: (item: any, index: number) => React.ReactNode;
	itemWidth?: number;
	height?: number;
	gap?: number;
	showArrows?: boolean;
	arrowColor?: string;
	arrowSize?: number;
	showCounter?: boolean;
	containerStyle?: ViewStyle;
	onItemPress?: (item: any, index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function Carousel({
	data,
	renderItem,
	itemWidth = SCREEN_WIDTH - spacing.md * 2,
	height = 280,
	gap = spacing.md,
	showArrows = true,
	arrowColor,
	arrowSize = 24,
	showCounter = true,
	containerStyle,
	onItemPress,
}: CarouselProps) {
	const { theme } = useAppTheme();
	const styles = createStyles(theme);
	const effectiveArrowColor = arrowColor || theme.colors.onSurface;

	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);

	const isScrollEnabled = data.length > 1;
	const totalWidth = itemWidth + gap;

	const scrollToIndex = (index: number) => {
		if (scrollViewRef.current && index >= 0 && index < data.length) {
			scrollViewRef.current.scrollTo({
				x: index * totalWidth,
				animated: true,
			});
			setCurrentIndex(index);
		}
	};

	const handleScrollEnd = (event: any) => {
		const contentOffset = event.nativeEvent.contentOffset.x;
		const index = Math.round(contentOffset / totalWidth);
		setCurrentIndex(index);
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			scrollToIndex(currentIndex - 1);
		}
	};

	const handleNext = () => {
		if (currentIndex < data.length - 1) {
			scrollToIndex(currentIndex + 1);
		}
	};

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={[styles.carouselWrapper, { height }]}>
				{/* ScrollView */}
				<ScrollView
					ref={scrollViewRef}
					horizontal
					pagingEnabled={false}
					showsHorizontalScrollIndicator={false}
					scrollEnabled={isScrollEnabled}
					onMomentumScrollEnd={handleScrollEnd}
					snapToInterval={totalWidth}
					decelerationRate="fast"
					contentContainerStyle={styles.scrollContent}
				>
					{data.map((item, index) => (
						<Pressable
							key={index}
							style={[
								styles.itemContainer,
								{
									width: itemWidth,
									height: height,
									marginRight: index === data.length - 1 ? 0 : gap,
								},
							]}
							onPress={() => onItemPress?.(item, index)}
							disabled={!onItemPress}
						>
							{renderItem(item, index)}
						</Pressable>
					))}
				</ScrollView>

				{/* Counter Label */}
				{showCounter && data.length > 1 && (
					<View style={styles.counterContainer}>
						<Text style={styles.counterText}>
							{currentIndex + 1}/{data.length}
						</Text>
					</View>
				)}

				{/* Left Arrow */}
				{showArrows && isScrollEnabled && currentIndex > 0 && (
					<Pressable
						style={[styles.arrowButton, styles.leftArrow]}
						onPress={handlePrevious}
					>
						<ChevronLeft size={arrowSize} color={effectiveArrowColor} />
					</Pressable>
				)}

				{/* Right Arrow */}
				{showArrows && isScrollEnabled && currentIndex < data.length - 1 && (
					<Pressable
						style={[styles.arrowButton, styles.rightArrow]}
						onPress={handleNext}
					>
						<ChevronRight size={arrowSize} color={effectiveArrowColor} />
					</Pressable>
				)}
			</View>
		</View>
	);
}

const createStyles = (theme: any) => StyleSheet.create({
	container: {
		width: '100%',
	},
	carouselWrapper: {
		position: 'relative',
		width: '100%',
	},
	scrollContent: {
		alignItems: 'center',
	},
	itemContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		borderRadius: roundness.md,
	},
	arrowButton: {
		position: 'absolute',
		top: '50%',
		transform: [{ translateY: -20 }],
		zIndex: 10,
		backgroundColor: theme.colors.surface,
		borderRadius: 20,
		padding: spacing.sm,
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	leftArrow: {
		left: spacing.xs,
	},
	rightArrow: {
		right: spacing.xs,
	},
	counterContainer: {
		position: 'absolute',
		top: spacing.sm,
		right: spacing.sm,
		backgroundColor: theme.colors.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.sm,
		zIndex: 15,
	},
	counterText: {
		color: theme.colors.onPrimary,
		fontSize: typography.bodySmall,
		fontWeight: '600',
	},
});