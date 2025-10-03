import {
	useIsFocused,
	useNavigationState,
	useRoute,
	type NavigationState,
	type PartialState,
} from "@react-navigation/native";
import React, { useEffect, useMemo, useRef } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type NavRoute = {
	key: string;
	state?: NavigationState | PartialState<NavigationState>;
};

type Props = ViewProps & {
	duration?: number;
	distance?: number;
};

function findTopTabIndex(state: NavigationState, targetKey: string): number | null {
	function dfs(s: NavigationState, topIndex: number | null): number | null {
		for (let i = 0; i < s.routes.length; i++) {
			const r = s.routes[i] as NavRoute;
			if (r.key === targetKey) {
				return topIndex ?? i;
			}
			if (r.state) {
				const nextTop = topIndex ?? i;
				const found = dfs(r.state as NavigationState, nextTop);
				if (found !== null) return found;
			}
		}
		return null;
	}
	return dfs(state, null);
}

export default function AnimatedTabTransition({
	children,
	duration = 200,
	distance = 40,
	style,
	...rest
}: Props) {
	const isFocused = useIsFocused();
	const route = useRoute();
	const navState = useNavigationState((s) => s);

	const currentTabIndex = useMemo(() => {
		if (!navState) return 0;
		const idx = findTopTabIndex(navState, route.key);
		return typeof idx === "number" ? idx : 0;
	}, [navState, route.key]);

	const lastTabIndexRef = useRef<number>(currentTabIndex);

	const opacity = useSharedValue(0);
	const translateX = useSharedValue(0);

	useEffect(() => {
		if (isFocused) {
			const last = lastTabIndexRef.current ?? currentTabIndex;
			const direction = currentTabIndex > last ? 1 : currentTabIndex < last ? -1 : 0;

			translateX.value = direction === 0 ? 0 : direction * distance;
			opacity.value = 0;

			translateX.value = withTiming(0, { duration });
			opacity.value = withTiming(1, { duration });

			lastTabIndexRef.current = currentTabIndex;
		} else {
			opacity.value = withTiming(0, { duration });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocused, currentTabIndex, distance, duration]);

	const rStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateX: translateX.value }],
	}));

	return (
		<View style={[{ flex: 1 }, style]} {...rest}>
			<Animated.View style={[{ flex: 1 }, rStyle]}>{children}</Animated.View>
		</View>
	);
}