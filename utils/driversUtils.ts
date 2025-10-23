import { DriverStatus } from "@/constants/enums/DriverStatus";
import {
	CalendarClock,
	Check,
	Pause,
	Stethoscope,
	UserRound,
} from "lucide-react-native";

export function getDriverStatusIcon(status: DriverStatus) {
	switch (status) {
		case DriverStatus.ACTIVE:
			return Check;
		case DriverStatus.INACTIVE:
			return Pause;
		case DriverStatus.SICK_LEAVE:
			return Stethoscope;
		case DriverStatus.HOLIDAYS:
			return CalendarClock;
		default:
			return UserRound;
	}
}
