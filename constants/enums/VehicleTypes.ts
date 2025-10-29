export enum VehicleTypes {
	TRAILER_TRUCK = "Camión tráiler",
	RIGID_TRUCK = "Camión rígido",
	TRUCK = "Camión de 3500kg",
	SMALL_VAN = "Furgoneta pequeña",
	MEDIUM_VAN = "Furgoneta mediana",
	LARGE_VAN = "Furgoneta grande",
}

export const vehicleTypeList: string[] = Object.values(VehicleTypes);
