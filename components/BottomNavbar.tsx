import { lightTheme } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
	Home,
	MessageSquareWarning,
	Settings as SettingsIcon,
	SquareUserRound,
	Truck,
} from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteCfg = {
	key: string;
	title: string;
	Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const ROUTES: RouteCfg[] = [
	{ key: "reports", title: "Reportes", Icon: MessageSquareWarning },
	{ key: "fleet", title: "Flota", Icon: Truck },
	{ key: "index", title: "Inicio", Icon: Home },
	{ key: "drivers", title: "Choferes", Icon: SquareUserRound },
	{ key: "settings", title: "Ajustes", Icon: SettingsIcon },
];

//! Temporary reports number hard coded
const reports: number = 4;

export function BottomNavBar({ state, navigation }: BottomTabBarProps) {
	const insets = useSafeAreaInsets();

	const [tabsLayout, setTabsLayout] = useState<{ x: number; w: number }[]>(
		Array(ROUTES.length).fill({ x: 0, w: 0 })
	);
	const readyRef = useRef(false);

	const pillX = useSharedValue(0);
	const pillW = useSharedValue(0);

	const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
		const { x, width } = e.nativeEvent.layout;
		setTabsLayout((prev) => {
			const next = [...prev];
			next[index] = { x, w: width };
			return next;
		});
	};

	React.useEffect(() => {
		const idx = state.index;
		const info = tabsLayout[idx];
		if (info && (info.w > 0 || info.x > 0)) {
			const duration = readyRef.current ? 180 : 0;
			pillX.value = withTiming(info.x + 8, { duration });
			pillW.value = withTiming(Math.max(64, info.w - 16), { duration });
			readyRef.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.index, tabsLayout]);

	const pillStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: pillX.value }],
		width: pillW.value,
	}));

	const onPress = (routeKey: string, i: number) => () => {
		navigation.navigate(state.routes[i].name);
	};

	const items = useMemo(
		() =>
			ROUTES.map((cfg, i) => {
				const focused = state.index === i;
				const color = focused
					? lightTheme.colors.onPrimaryContainer
					: lightTheme.colors.onSurfaceVariant;
				const IconComp = cfg.Icon;

				return (
					<TouchableOpacity
						key={cfg.key}
						onPress={onPress(cfg.key, i)}
						onLayout={onTabLayout(i)}
						activeOpacity={0.8}
						style={styles.tab}
					>
						<View style={styles.tabInner}>
							<View style={{ position: "relative" }}>
								<IconComp size={22} color={color} />
								{cfg.key === "reports" && reports > 0 && (
									<View style={styles.badge}>
										<Text style={styles.badgeText}>
											{reports > 9 ? "9+" : reports}
										</Text>
									</View>
								)}
							</View>
							<Text style={[styles.label, { color }]} numberOfLines={1}>
								{cfg.title}
							</Text>
						</View>
					</TouchableOpacity>
				);
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[state.index, tabsLayout]
	);

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom }]}>
			<View style={styles.tabsRow}>
				<Animated.View style={[styles.pill, pillStyle]} />
				{items}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: lightTheme.colors.surface,
		borderTopWidth: 1,
		borderTopColor: lightTheme.colors.outline,
		overflow: "hidden",
		paddingHorizontal: 8,
	},
	tabsRow: {
		flexDirection: "row",
		alignItems: "stretch",
		position: "relative",
		paddingVertical: 6,
	},
	pill: {
		position: "absolute",
		top: 6,
		bottom: 6,
		left: 0,
		backgroundColor: lightTheme.colors.primaryContainer,
		height: 54,
		width: 64,
		borderRadius: 14,
	},
	tab: {
		flex: 1,
		paddingHorizontal: 8,
	},
	tabInner: {
		height: 54,
		width: 64,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
	},
	label: {
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.2,
	},
	badge: {
		position: "absolute",
		top: -6,
		right: -10,
		backgroundColor: lightTheme.colors.error,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		color: lightTheme.colors.onError,
		fontSize: 10,
		fontWeight: "700",
	},
});