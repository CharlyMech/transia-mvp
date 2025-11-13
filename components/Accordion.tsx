import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';
import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface AccordionProps {
	title: string;
	subtitle?: string;
	rightContent?: React.ReactNode;
	headerStyle?: ViewStyle;
	contentStyle?: ViewStyle;
	titleStyle?: any;
	subtitleStyle?: any;
	isExpanded?: boolean;
	onToggle?: (isExpanded: boolean) => void;
	duration?: number;
}

export function Accordion({
	children,
	title,
	subtitle,
	rightContent,
	headerStyle,
	contentStyle,
	titleStyle,
	subtitleStyle,
	isExpanded: controlledIsExpanded,
	onToggle,
	duration = 300,
}: PropsWithChildren<AccordionProps>) {
	const isControlled = controlledIsExpanded !== undefined;
	const [internalIsExpanded, setInternalIsExpanded] = React.useState(false);

	const isExpanded = isControlled ? controlledIsExpanded : internalIsExpanded;

	const height = useSharedValue(0);
	const progress = useDerivedValue(() =>
		isExpanded ? withTiming(1, { duration }) : withTiming(0, { duration })
	);

	const handlePress = () => {
		if (isControlled) {
			onToggle?.(!isExpanded);
		} else {
			setInternalIsExpanded(!isExpanded);
			onToggle?.(!isExpanded);
		}
	};

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const isFullyExpanded = progress.value === 1;
		return {
			borderBottomLeftRadius: isFullyExpanded ? 0 : roundness.sm,
			borderBottomRightRadius: isFullyExpanded ? 0 : roundness.sm,
		};
	});

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		height: height.value * progress.value,
		opacity: progress.value,
	}));

	const chevronAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${progress.value * 180}deg` }],
	}));

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.header, headerStyle, headerAnimatedStyle]}>
				<Pressable
					onPress={handlePress}
					style={({ pressed }) => [
						styles.headerPressable,
						pressed && styles.headerPressed,
					]}
				>
					<View style={styles.headerLeft}>
						<Text style={[styles.title, titleStyle]}>{title}</Text>
						{subtitle && (
							<Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
						)}
					</View>

					<View style={styles.headerRight}>
						{rightContent}
						<Animated.View style={chevronAnimatedStyle}>
							<ChevronDown size={24} color={lightTheme.colors.onSurface} />
						</Animated.View>
					</View>
				</Pressable>
			</Animated.View>

			<Animated.View style={[styles.content, contentStyle, contentAnimatedStyle]}>
				<View
					onLayout={(event) => {
						height.value = event.nativeEvent.layout.height;
					}}
					style={styles.contentInner}
				>
					{children}
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
	header: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
	},
	headerPressable: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: spacing.md,
	},
	headerPressed: {
		opacity: 0.8,
	},
	headerLeft: {
		flex: 1,
		marginRight: spacing.xs,
	},
	title: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	headerRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	content: {
		overflow: 'hidden',
	},
	contentInner: {
		position: 'absolute',
		width: '100%',
	},
});