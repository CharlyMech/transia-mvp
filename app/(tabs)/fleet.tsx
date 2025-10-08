import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { lightTheme, spacing, typography } from "@/constants/theme";
import type { Vehicle } from "@/models/vehicle";
import { listFleet } from "@/services/data/mock/fleet";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FleetScreen() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);

	useEffect(() => {
		listFleet().then(setVehicles).catch(console.error);
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={{ width: "100%" }}
				contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
				showsVerticalScrollIndicator={false}
			>
				<View style={{
					width: "100%",
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
					marginBottom: spacing.sm
				}}>
					<Button
						label="Nuevo"
						icon={Plus}
						onPress={() => router.push("/fleet/new-vehicle")}
					/>
				</View>

				{vehicles.map((item) => (
					<Card
						key={item.id}
						onPress={() => router.push(`/fleet/${item.id}`)}
						paddingX={spacing.md}
						paddingY={spacing.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={{ gap: spacing.xs }}>
							<Text style={{ fontSize: typography.bodyLarge, fontWeight: "700" }}>
								{item.vehicleBrand} {item.vehicleModel} ({item.year})
							</Text>
							<Text style={{ opacity: 0.7 }}>
								{item.vehicleType} • {item.plateNumber}
							</Text>
							<Text style={{
								color: item.active ? "green" : "red",
								fontWeight: "600",
								fontSize: typography.bodyMedium
							}}>
								{item.active ? "Activo" : "Inactivo"}
							</Text>
						</View>
					</Card>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});