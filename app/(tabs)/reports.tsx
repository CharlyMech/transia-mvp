import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { ReportActionsModal } from '@/components/modals/ReportActionModal';
import { lightTheme, spacing, typography } from '@/constants/theme';
import { useReportActions } from '@/hooks/useReportAction';
import type { Report } from '@/models/report';
import { listReports } from '@/services/data/mock/reports';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
	const [reports, setReports] = useState<Report[]>([]);
	const {
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
	} = useReportActions();

	useEffect(() => {
		listReports().then(setReports).catch(console.error);
	}, []);

	const handleDelete = async () => {
		const deletedId = await confirmDelete();
		if (deletedId) {
			const updatedReports = reports.filter(report => report.id !== deletedId);
			setReports(updatedReports);
		}
	};

	const handleMarkAsRead = async (reportId: string) => {
		await markAsRead(reportId);
		setReports(reports.map(report =>
			report.id === reportId ? { ...report, read: true } : report
		));
	};

	const handleMarkAsUnread = async (reportId: string) => {
		await markAsUnread(reportId);
		setReports(reports.map(report =>
			report.id === reportId ? { ...report, read: false } : report
		));
	};

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={{ width: "100%" }}
				contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
				showsVerticalScrollIndicator={false}
			>
				<View style={{
					width: "100%",
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
					marginBottom: spacing.sm
				}}>
					<Button
						label="Nuevo"
						icon={Plus}
						onPress={() => router.push("/reports/new-report")}
					/>
				</View>

				{reports.map((item) => (
					<Card
						key={item.id}
						onPress={() => router.push(`/reports/${item.id}`)}
						onLongPress={() => openActionsModal(item)}
						paddingX={spacing.md}
						paddingY={spacing.sm}
						shadow='none'
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={{ gap: spacing.xs }}>
							<Text style={{ fontSize: typography.bodyLarge, fontWeight: "700" }}>
								{item.title}
							</Text>
							<Text style={{ opacity: 0.7 }}>
								{new Date(item.createdAt).toLocaleDateString()}
							</Text>
							<Text style={{
								color: item.read ? "green" : "red",
								fontWeight: "600",
								fontSize: typography.bodyMedium
							}}>
								{item.read ? "Leído" : "Sin leer"}
							</Text>
						</View>
					</Card>
				))}
			</ScrollView>

			<ReportActionsModal
				visible={modalVisible}
				report={selectedReport}
				onClose={closeModal}
				onViewReport={navigateToReport}
				onMarkAsRead={handleMarkAsRead}
				onMarkAsUnread={handleMarkAsUnread}
				onDelete={requestDeleteReport}
			/>

			<ConfirmationModal
				visible={confirmationVisible}
				title="¿Eliminar reporte?"
				message="Esta acción no se puede deshacer. El reporte será eliminado permanentemente."
				confirmText="Eliminar"
				cancelText="Cancelar"
				variant="danger"
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
});