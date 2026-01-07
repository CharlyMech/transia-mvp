import { roundness, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useReportsStore } from "@/stores/useReportsStore";
import { usePathname, useRouter } from "expo-router";
import {
	FileWarning,
	LayoutDashboard,
	Settings as SettingsIcon,
	SquareUserRound,
	Truck
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteCfg = {
	key: string;
	path: string;
	title: string;
	Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const ROUTES: RouteCfg[] = [
	{ key: "reports", path: "/(tabs)/reports", title: "Reportes", Icon: FileWarning },
	{ key: "fleet", path: "/(tabs)/fleet", title: "Flota", Icon: Truck },
	{ key: "home", path: "/(tabs)", title: "Inicio", Icon: LayoutDashboard },
	{ key: "drivers", path: "/(tabs)/drivers", title: "Choferes", Icon: SquareUserRound },
	{ key: "settings", path: "/(tabs)/settings", title: "Ajustes", Icon: SettingsIcon },
];

export function BottomNavBar() {
	const { theme } = useAppTheme();
	const router = useRouter();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();

	const [tabsLayout, setTabsLayout] = useState<{ x: number; w: number }[]>(
		Array(ROUTES.length).fill({ x: 0, w: 0 })
	);
	const readyRef = useRef(false);

	const pillX = useSharedValue(0);
	const pillW = useSharedValue(0);

	// Determine the active index based on the current route
	const activeIndex = useMemo(() => {
		const index = ROUTES.findIndex(route => pathname.includes(route.key));
		return index !== -1 ? index : 2;
	}, [pathname]);

	const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
		const { x, width } = e.nativeEvent.layout;
		setTabsLayout((prev) => {
			const next = [...prev];
			next[index] = { x, w: width };
			return next;
		});
	};

	// Get pending reports count from the store (active: true means pending)
	const pendingReports = useReportsStore((state) =>
		state.reports.filter((report) => report.active === true).length
	);

	useEffect(() => {
		const info = tabsLayout[activeIndex];
		if (info && (info.w > 0 || info.x > 0)) {
			const duration = readyRef.current ? 180 : 0;
			// Limit pill width to prevent it from stretching too wide on tablets
			// Use the badge/icon container width (64) + some padding, or a max of say 100
			const maxPillWidth = 80;
			const targetWidth = Math.min(info.w - 16, maxPillWidth);
			const targetX = info.x + (info.w - targetWidth) / 2;

			pillX.value = withTiming(targetX, { duration });
			pillW.value = withTiming(targetWidth, { duration });
			readyRef.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeIndex, tabsLayout, pendingReports]);

	const pillStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: pillX.value }],
		width: pillW.value,
	}));

	const onPress = (path: string) => () => {
		// Use replace instead of push to keep the screens cached
		router.replace(path as any);
	};

	const items = useMemo(
		() =>
			ROUTES.map((cfg, i) => {
				const focused = activeIndex === i;
				const color = focused
					? theme.colors.onPrimaryContainer
					: theme.colors.onSurfaceVariant;
				const IconComp = cfg.Icon;

				return (
					<TouchableOpacity
						key={cfg.key}
						onPress={onPress(cfg.path)}
						onLayout={onTabLayout(i)}
						activeOpacity={0.8}
						style={styles.tab}
					>
						<View style={styles.tabInner}>
							<View style={{ position: "relative" }}>
								<IconComp size={22} color={color} />
								{cfg.key === "reports" && pendingReports > 0 && (
									<View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
										<Text style={[styles.badgeText, { color: theme.colors.onError }]}>
											{pendingReports > 9 ? "9+" : pendingReports}
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
		[activeIndex, tabsLayout, pendingReports, theme]
	);

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
			<View style={styles.tabsRow}>
				<Animated.View style={[styles.pill, pillStyle, { backgroundColor: theme.colors.secondaryContainer }]} />
				{items}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 1,
		overflow: "hidden",
		paddingHorizontal: spacing.sm,
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
		height: 54,
		width: 64,
		borderRadius: roundness.sm,
	},
	tab: {
		flex: 1,
		paddingHorizontal: 8,
		alignItems: "center", // Center the inner content (icon+label) in the available tab width
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
		fontSize: typography.labelSmall,
		fontWeight: "600",
		letterSpacing: 0.2,
	},
	badge: {
		position: "absolute",
		top: -6,
		right: -10,
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		fontSize: typography.labelSmall,
		fontWeight: "700",
	},
});