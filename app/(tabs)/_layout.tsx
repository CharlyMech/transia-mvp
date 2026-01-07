import { BottomNavBar } from '@/components/BottomNavbar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
	const { theme, isDark } = useAppTheme();

	return (
		<>
			<StatusBar style={isDark ? "light" : "dark"} backgroundColor={theme.colors.surface} />
			<Tabs
				screenOptions={{
					headerShown: false,
				}}
				tabBar={(props) => <BottomNavBar />}
			>
				<Tabs.Screen name="reports" options={{ title: "Reportes" }} />
				<Tabs.Screen name="fleet" options={{ title: "Flota" }} />
				<Tabs.Screen name="index" options={{ title: "Inicio" }} />
				<Tabs.Screen name="drivers" options={{ title: "Conductores" }} />
				<Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
			</Tabs>
		</>
	);
}
