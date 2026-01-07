import { roundness, spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import React from 'react';
import {
	GestureResponderEvent,
	Pressable,
	View,
	ViewStyle,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

interface CardProps {
	children: React.ReactNode;
	onPress?: (event: GestureResponderEvent) => void;
	onLongPress?: (event: GestureResponderEvent) => void;
	paddingX?: number;
	paddingY?: number;
	rounded?: number;
	border?: boolean;
	borderWidth?: number;
	borderColor?: string;
	shadow?: 'none' | 'small' | 'medium' | 'large';
	backgroundColor?: string;
	style?: ViewStyle;
	disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
	children,
	onPress,
	onLongPress,
	paddingX = spacing.md,
	paddingY = spacing.md,
	rounded = roundness.sm,
	border = false,
	borderWidth = 1,
	borderColor,
	shadow = 'small',
	backgroundColor,
	style,
	disabled = false,
}: CardProps) {
	const { theme } = useAppTheme();
	const scale = useSharedValue(1);
	const opacity = useSharedValue(1);

	// Default values derived from theme
	const finalBackgroundColor = backgroundColor || theme.colors.surface;
	const finalBorderColor = borderColor || theme.colors.outline;

	const isInteractive = !disabled && (onPress || onLongPress);

	// Material Design 3 ripple effect using scale and opacity
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: opacity.value,
	}));

	const handlePressIn = () => {
		if (!isInteractive) return;
		scale.value = withSpring(0.98, {
			damping: 15,
			stiffness: 300,
		});
		opacity.value = withTiming(0.8, { duration: 100 });
	};

	const handlePressOut = () => {
		if (!isInteractive) return;
		scale.value = withSpring(1, {
			damping: 15,
			stiffness: 300,
		});
		opacity.value = withTiming(1, { duration: 150 });
	};

	const getShadowStyle = () => {
		switch (shadow) {
			case 'none':
				return {};
			case 'small':
				return {
					shadowColor: theme.colors.shadow,
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.08,
					shadowRadius: 2,
					elevation: 1,
				};
			case 'medium':
				return {
					shadowColor: theme.colors.shadow,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.12,
					shadowRadius: 4,
					elevation: 3,
				};
			case 'large':
				return {
					shadowColor: theme.colors.shadow,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.16,
					shadowRadius: 8,
					elevation: 6,
				};
			default:
				return {};
		}
	};

	const cardStyle: ViewStyle = {
		backgroundColor: finalBackgroundColor,
		borderRadius: rounded,
		paddingHorizontal: paddingX,
		paddingVertical: paddingY,
		width: '100%',
		...(border && {
			borderWidth,
			borderColor: finalBorderColor,
		}),
		...getShadowStyle(),
	};

	if (isInteractive) {
		return (
			<AnimatedPressable
				onPress={onPress}
				onLongPress={onLongPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={disabled}
				style={[cardStyle, animatedStyle, style]}
			>
				{children}
			</AnimatedPressable>
		);
	}

	return <View style={[cardStyle, style]}>{children}</View>;
}