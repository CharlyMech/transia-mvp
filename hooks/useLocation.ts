import { Location } from "@/models/report";
import * as ExpoLocation from "expo-location";
import { useEffect, useState } from "react";

interface UseLocationResult {
	location: Location | null;
	loading: boolean;
	error: string | null;
	requestLocation: () => Promise<void>;
	hasPermission: boolean | null;
}

export function useLocation(): UseLocationResult {
	const [location, setLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		checkPermissions();
	}, []);

	const checkPermissions = async () => {
		const { status } = await ExpoLocation.getForegroundPermissionsAsync();
		setHasPermission(status === "granted");
	};

	const requestPermissions = async (): Promise<boolean> => {
		const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
		const granted = status === "granted";
		setHasPermission(granted);
		return granted;
	};

	const requestLocation = async () => {
		setLoading(true);
		setError(null);

		try {
			let permitted = hasPermission;
			if (!permitted) {
				permitted = await requestPermissions();
			}

			if (!permitted) {
				setError("No se otorgaron permisos de ubicación");
				setLoading(false);
				return;
			}

			const position = await ExpoLocation.getCurrentPositionAsync({
				accuracy: ExpoLocation.Accuracy.Balanced,
			});
			let address: string | undefined;
			try {
				const addresses = await ExpoLocation.reverseGeocodeAsync({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});

				if (addresses && addresses.length > 0) {
					const addr = addresses[0];
					address = [
						addr.street,
						addr.streetNumber,
						addr.postalCode,
						addr.city,
						addr.region,
						addr.country,
					]
						.filter(Boolean)
						.join(", ");
				}
			} catch (geocodeError) {
				console.warn("No se pudo obtener la dirección:", geocodeError);
			}

			const locationData: Location = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				altitude: position.coords.altitude,
				accuracy: position.coords.accuracy,
				address,
			};

			setLocation(locationData);
		} catch (err) {
			console.error("Error al obtener ubicación:", err);
			setError("No se pudo obtener la ubicación");
		} finally {
			setLoading(false);
		}
	};

	return {
		location,
		loading,
		error,
		requestLocation,
		hasPermission,
	};
}
