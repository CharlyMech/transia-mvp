import { Card } from '@/components/Card';
import { lightTheme } from '@/constants/theme';
import type { Driver } from "@/models/driver";
import { listDrivers } from '@/services/data/mock/drivers';
import { router } from 'expo-router';
import { CirclePlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function DriversScreen() {
	const [drivers, setDrivers] = useState<Driver[]>([]);

	useEffect(() => {
		listDrivers()
			.then(setDrivers)
			.catch((err) => console.error("Error cargando drivers:", err));
	}, []);

	return (
		<View style={styles.container}>
			<View>
				<Pressable onPress={() => console.log("Adding a new driver...")}>
					<CirclePlus style={{ backgroundColor: lightTheme.colors.primary, borderRadius: "100%", }} size={24} />
				</Pressable>
			</View>
			<FlatList
				contentContainerStyle={{ padding: 10, gap: 12 }}
				style={{ width: "100%" }}
				data={drivers}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card
						onPress={() => router.push(`/drivers/${item.id}`)}
						paddingX={16}
						paddingY={12}
						border={true}
						borderColor={lightTheme.colors.outline}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={{ gap: 4 }}>
							<Text style={{ fontSize: 16, fontWeight: "700" }}>
								{item.name} {item.surnames ? `(${item.surnames.split(" ")[0]})` : ""}
							</Text>
							<Text style={{ opacity: 0.7 }}>{item.phone}</Text>
							<Text style={{ color: item.active ? "green" : "red", fontWeight: "600" }}>
								{item.active ? "Activo" : "Inactivo"}
							</Text>
						</View>
					</Card>
				)}
			/>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: lightTheme.colors.background,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
