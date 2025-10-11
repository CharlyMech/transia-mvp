import type { Report } from "@/models/report";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useReportActions() {
	const router = useRouter();
	const [selectedReport, setSelectedReport] = useState<Report | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [confirmationVisible, setConfirmationVisible] = useState(false);
	const [reportToDelete, setReportToDelete] = useState<string | null>(null);

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
			// TODO: implement marks as read service
			console.log("Marcando como leído:", reportId);
		} catch (error) {
			console.error("Error al marcar como leído:", error);
		}
	};

	const markAsUnread = async (reportId: string) => {
		try {
			// TODO: implement marks as unread service
			console.log("Marcando como no leído:", reportId);
		} catch (error) {
			console.error("Error al marcar como no leído:", error);
		}
	};

	const requestDeleteReport = (reportId: string) => {
		setReportToDelete(reportId);
		setConfirmationVisible(true);
	};

	const confirmDelete = async () => {
		if (!reportToDelete) return;

		try {
			// TODO: implement delete report service
			console.log("Eliminando reporte:", reportToDelete);
			setConfirmationVisible(false);
			setReportToDelete(null);
			closeModal();
			return reportToDelete;
		} catch (error) {
			console.error("Error al eliminar reporte:", error);
			return null;
		}
	};

	const cancelDelete = () => {
		setConfirmationVisible(false);
		setReportToDelete(null);
	};

	return {
		selectedReport,
		modalVisible,
		confirmationVisible,
		navigateToReport,
		openActionsModal,
		closeModal,
		markAsRead,
		markAsUnread,
		requestDeleteReport,
		confirmDelete,
		cancelDelete,
	};
}
