import { lightTheme, roundness, spacing } from '@/constants/theme';
import React from 'react';
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	Text,
	TextStyle,
	ViewStyle
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

interface ElevatedButtonProps {
	icon?: React.ComponentType<{ size?: number; color?: string }>;
	label?: string;
	onPress?: (event: GestureResponderEvent) => void;
	paddingX?: number;
	paddingY?: number;
	rounded?: number;
	fontSize?: number;
	fontWeight?: TextStyle['fontWeight'];
	iconSize?: number;
	iconColor?: string;
	textColor?: string;
	backgroundColor?: string;
	shadow?: 'none' | 'small' | 'medium' | 'large';
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ElevatedButton({
	icon: Icon,
	label,
	onPress,
	paddingX = spacing.lg,
	paddingY = spacing.md,
	rounded = roundness.md,
	fontSize = 16,
	fontWeight = '600',
	iconSize = 20,
	iconColor,
	textColor = lightTheme.colors.onPrimary,
	backgroundColor = lightTheme.colors.primary,
	shadow = 'small',
	style,
	textStyle,
	disabled = false,
}: ElevatedButtonProps) {
	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);

	// Material Design 3 elevation effect using scale and translateY
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }, { translateY: translateY.value }],
	}));

	const handlePressIn = () => {
		if (disabled) return;
		scale.value = withSpring(0.98, {
			damping: 15,
			stiffness: 300,
		});
		translateY.value = withTiming(0, { duration: 100 });
	};

	const handlePressOut = () => {
		if (disabled) return;
		scale.value = withSpring(1, {
			damping: 15,
			stiffness: 300,
		});
		translateY.value = withTiming(-2, { duration: 150 });
	};

	const getShadowStyle = () => {
		switch (shadow) {
			case 'none':
				return {};
			case 'small':
				return {
					shadowColor: lightTheme.colors.shadow,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 2,
				};
			case 'medium':
				return {
					shadowColor: lightTheme.colors.shadow,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.15,
					shadowRadius: 8,
					elevation: 4,
				};
			case 'large':
				return {
					shadowColor: lightTheme.colors.shadow,
					shadowOffset: { width: 0, height: 6 },
					shadowOpacity: 0.2,
					shadowRadius: 12,
					elevation: 6,
				};
			default:
				return {};
		}
	};

	const buttonStyle: ViewStyle = {
		backgroundColor,
		borderRadius: rounded,
		paddingHorizontal: paddingX,
		paddingVertical: paddingY,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: Icon && label ? 8 : 0,
		opacity: disabled ? 0.5 : 1,
		...getShadowStyle(),
	};

	const baseTextStyle: TextStyle = {
		color: textColor,
		fontSize,
		fontWeight,
	};

	return (
		<AnimatedPressable
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			style={[buttonStyle, animatedStyle, style]}
		>
			{Icon && (
				<Icon size={iconSize} color={iconColor || textColor} />
			)}
			{label && <Text style={[baseTextStyle, textStyle]}>{label}</Text>}
		</AnimatedPressable>
	);
}