import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DriverDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	return (
		<View style={{ flex: 1, padding: 16 }}>
			<Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
				Conductor #{id}
			</Text>
			<Text>…aquí tu contenido, fetch por ID, etc.</Text>
		</View>
	);
}