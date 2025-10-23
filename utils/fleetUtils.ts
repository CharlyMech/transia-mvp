import {
	AlertTriangle,
	Check,
	Pause,
	Truck,
	Wrench,
} from "lucide-react-native";
import { VehicleStatus } from "../constants/enums/VehicleStatus";

export function getVehicleStatusIcon(status: VehicleStatus) {
	switch (status) {
		case VehicleStatus.ACTIVE:
			return Check;
		case VehicleStatus.INACTIVE:
			return Pause;
		case VehicleStatus.BROKEN_DOWN:
			return AlertTriangle;
		case VehicleStatus.MAINTENANCE:
			return Wrench;
		default:
			return Truck;
	}
}
