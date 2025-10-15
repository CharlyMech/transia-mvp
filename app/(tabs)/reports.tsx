import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
// import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
// import { ReportActionsModal } from '@/components/modals/ReportActionModal';
import { SkeletonList } from '@/components/skeletons';

import { lightTheme, spacing, typography } from '@/constants/theme';
// import { useReportActions } from '@/hooks/useReportAction';
import { useReportsStore } from '@/stores/useReportsStore';

import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
	const reports = useReportsStore((state) => state.reports);
	const loading = useReportsStore((state) => state.loading);

	// TODO -> Implement previous actions with zustand stores
	// const deleteReport = useReportsStore((state) => state.deleteReport);
	// const markAsRead = useReportsStore((state) => state.markAsRead);
	// const markAsUnread = useReportsStore((state) => state.markAsUnread);

	// const {
	// 	selectedReport,
	// 	modalVisible,
	// 	confirmationVisible,
	// 	navigateToReport,
	// 	openActionsModal,
	// 	closeModal,
	// 	requestDeleteReport,
	// 	confirmDelete,
	// 	cancelDelete,
	// } = useReportActions();

	// const handleDelete = async () => {
	// 	const deletedId = await confirmDelete();
	// 	if (deletedId) {
	// 		deleteReport(deletedId);
	// 	}
	// };

	// const handleMarkAsRead = async (reportId: string) => {
	// 	markAsRead(reportId);
	// };

	// const handleMarkAsUnread = async (reportId: string) => {
	// 	markAsUnread(reportId);
	// };

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<View style={styles.headerContainer}>
				<Button
					label="Nuevo"
					icon={Plus}
					onPress={() => router.push("/reports/new-report")}
				/>
			</View>

			{loading ? (
				<SkeletonList count={8} cardHeight={100} />
			) : (
				<ScrollView
					style={{ width: "100%" }}
					contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
					showsVerticalScrollIndicator={false}
				>
					{reports.map((item) => (
						<Card
							key={item.id}
							onPress={() => router.push(`/reports/${item.id}`)}
							paddingX={spacing.md}
							paddingY={spacing.sm}
							shadow='none'
							backgroundColor={lightTheme.colors.surface}
							style={{ height: 100 }}
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
			)}

			{/* <ReportActionsModal
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
			/> */}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	headerContainer: {
		width: "100%",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xs,
		backgroundColor: lightTheme.colors.background,
	},
});