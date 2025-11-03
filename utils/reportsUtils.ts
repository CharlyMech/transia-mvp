import { ReportsTypes } from "@/constants/enums/ReportsTypes";
import {
	AlertTriangle,
	BellDot,
	CalendarClock,
	CheckCheck,
	ClipboardList,
	FileClock,
	HelpCircle,
	MapPin,
	MapPinOff,
	Wrench,
} from "lucide-react-native";

export function getReportTypeIcon(type: ReportsTypes) {
	switch (type) {
		case ReportsTypes.ACCIDENT:
			return AlertTriangle;
		case ReportsTypes.MAINTENANCE:
			return Wrench;
		case ReportsTypes.CHECK:
			return ClipboardList;
		case ReportsTypes.ITV:
			return CalendarClock;
		case ReportsTypes.OTHER:
			return HelpCircle;
		default:
			return HelpCircle;
	}
}

export function getReportReadStatusIcon(read: boolean) {
	return read ? CheckCheck : BellDot;
}

export function getReportActiveStatusIcon(active: boolean) {
	return active ? FileClock : CheckCheck;
}

export function getLocationIcon(hasLocation: boolean) {
	return hasLocation ? MapPin : MapPinOff;
}
