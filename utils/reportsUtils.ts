import { ReportsTypes } from "@/constants/enums/ReportsTypes";
import {
	AlertTriangle,
	CheckCheck,
	ClipboardList,
	Clock,
	FileSearch,
	HelpCircle,
	Wrench,
} from "lucide-react-native";

export function getReportTypeIcon(type: ReportsTypes) {
	switch (type) {
		case ReportsTypes.ACCIDENT:
			return AlertTriangle;
		case ReportsTypes.MAINTENANCE:
			return Wrench;
		case ReportsTypes.CHECK:
			return FileSearch;
		case ReportsTypes.ITV:
			return ClipboardList;
		case ReportsTypes.OTHER:
			return HelpCircle;
		default:
			return HelpCircle;
	}
}

export function getReportReadStatusIcon(read: boolean) {
	return read ? CheckCheck : Clock;
}

export function getReportActiveStatusIcon(active: boolean) {
	return active ? AlertTriangle : CheckCheck;
}
