import { lightTheme, roundness } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

interface BadgeIconProps {
	Icon: LucideIcon;
	BadgeIcon: LucideIcon;
	size?: number;
	color?: string;
	badgeSize?: number;
	badgeColor?: string;
	badgeBackgroundColor?: string;
}

export function IconBadge({
	Icon,
	BadgeIcon,
	size = 22,
	color,
	badgeSize = 12,
	badgeColor,
	badgeBackgroundColor = lightTheme.colors.surface,
}: BadgeIconProps) {
	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<Icon size={size} color={color} />
			<View
				style={[
					styles.badge,
					{
						backgroundColor: badgeBackgroundColor,
						borderRadius: roundness.full,
						padding: 2,
					},
				]}
			>
				<BadgeIcon strokeWidth={3} size={badgeSize} color={badgeColor} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	badge: {
		position: 'absolute',
		bottom: -4,
		right: -4,
	},
});