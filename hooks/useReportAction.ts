import type { Report } from "@/models/report";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useReportActions() {
	const router = useRouter();
	const [selectedReport, setSelectedReport] = useState<Report | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	const navigateToReport = (reportId: string) => {
		router.push(`/reports/${reportId}`);
		setModalVisible(false);
	};

	const openActionsModal = (report: Report) => {
		setSelectedReport(report);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
		setSelectedReport(null);
	};

	const markAsRead = async (reportId: string) => {
		try {
			// TODO: Implementar servicio para marcar como leído
			console.log("Marcando como leído:", reportId);
		} catch (error) {
			console.error("Error al marcar como leído:", error);
		}
	};

	const deleteReport = async (reportId: string) => {
		try {
			// TODO: Implementar servicio para eliminar
			console.log("Eliminando reporte:", reportId);
			closeModal();
		} catch (error) {
			console.error("Error al eliminar reporte:", error);
		}
	};

	return {
		selectedReport,
		modalVisible,
		navigateToReport,
		openActionsModal,
		closeModal,
		markAsRead,
		deleteReport,
	};
}
