import { BottomNavBar } from '@/components/BottomNavbar';
import { lightTheme } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
	return (
		<>
			<StatusBar style="dark" backgroundColor={lightTheme.colors.surface} />
			<Tabs
				screenOptions={{
					headerShown: true,
					headerStyle: {
						backgroundColor: lightTheme.colors.surface,
					},
					headerTintColor: lightTheme.colors.onSurface,
					headerTitleAlign: 'center',
				}}
				tabBar={(props) => <BottomNavBar {...props} />}
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
