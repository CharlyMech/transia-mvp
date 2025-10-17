import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

export function useImagePicker() {
	const [loading, setLoading] = useState(false);

	const pickImage = async (): Promise<string | null> => {
		try {
			setLoading(true);

			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status !== "granted") {
				Alert.alert(
					"Permiso denegado",
					"Necesitamos permiso para acceder a tus fotos.",
					[{ text: "OK" }]
				);
				setLoading(false);
				return null;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
				allowsMultipleSelection: false,
			});

			setLoading(false);

			if (!result.canceled && result.assets && result.assets.length > 0) {
				return result.assets[0].uri;
			}

			return null;
		} catch (error) {
			console.error("Error picking image:", error);
			setLoading(false);
			Alert.alert(
				"Error",
				"Hubo un problema al seleccionar la imagen. Por favor, intenta de nuevo.",
				[{ text: "OK" }]
			);
			return null;
		}
	};

	const takePhoto = async (): Promise<string | null> => {
		try {
			setLoading(true);

			const { status } = await ImagePicker.requestCameraPermissionsAsync();

			if (status !== "granted") {
				Alert.alert(
					"Permiso denegado",
					"Necesitamos permiso para acceder a la cámara.",
					[{ text: "OK" }]
				);
				setLoading(false);
				return null;
			}

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			setLoading(false);

			if (!result.canceled && result.assets && result.assets.length > 0) {
				return result.assets[0].uri;
			}

			return null;
		} catch (error) {
			console.error("Error taking photo:", error);
			setLoading(false);
			Alert.alert(
				"Error",
				"Hubo un problema al tomar la foto. Por favor, intenta de nuevo.",
				[{ text: "OK" }]
			);
			return null;
		}
	};

	return {
		pickImage,
		takePhoto,
		loading,
	};
}
