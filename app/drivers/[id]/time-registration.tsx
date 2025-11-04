import { ActionsModal } from '@/components/ActionsModal';
import { Card } from '@/components/Card';
import { CircularProgress } from '@/components/CircularProgress';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { calculateCurrentMinutes, formatDateToDisplay } from '@/utils/dateUtils';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Edit2, Pause, Play, Plus, Square, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LocaleConfig, Calendar as RNCalendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Configure Spanish locale
LocaleConfig.locales['es'] = {
	monthNames: [
		'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
	],
	monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
	dayNamesShort: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
	today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function TimeRegistrationScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const user = useAuthStore((state) => state.user);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showStopModal, setShowStopModal] = useState(false);
	const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
	const [editStartTime, setEditStartTime] = useState('');
	const [editEndTime, setEditEndTime] = useState('');
	const [currentTime, setCurrentTime] = useState(new Date());

	const currentRegistration = useTimeRegistrationsStore((state) => state.currentRegistration);
	const loadingRegistration = useTimeRegistrationsStore((state) => state.loadingRegistration);
	const fetchRegistrationByDriverAndDate = useTimeRegistrationsStore((state) => state.fetchRegistrationByDriverAndDate);

	const startWork = useTimeRegistrationsStore((state) => state.startWork);
	const pauseWork = useTimeRegistrationsStore((state) => state.pauseWork);
	const resumeWork = useTimeRegistrationsStore((state) => state.resumeWork);
	const endWork = useTimeRegistrationsStore((state) => state.endWork);
	const deleteTimeRange = useTimeRegistrationsStore((state) => state.deleteTimeRange);
	const updateTimeRange = useTimeRegistrationsStore((state) => state.updateTimeRange);
	const addTimeRange = useTimeRegistrationsStore((state) => state.addTimeRange);

	// Check if the selected driver is the logged user
	const isOwnProfile = user?.id === id;

	// Update current time every second for real-time tracking
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (id) {
			fetchRegistrationByDriverAndDate(id, selectedDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, selectedDate]);

	const handlePreviousDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		setSelectedDate(newDate);
	};

	const handleNextDay = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const current = new Date(selectedDate);
		current.setHours(0, 0, 0, 0);

		if (current.getTime() < today.getTime()) {
			const newDate = new Date(selectedDate);
			newDate.setDate(newDate.getDate() + 1);
			setSelectedDate(newDate);
		}
	};

	const handleToday = () => {
		setSelectedDate(new Date());
	};

	const handleDateSelect = (day: any) => {
		const date = new Date(day.dateString);
		setSelectedDate(date);
		setShowCalendarModal(false);
	};

	const handleStartWork = async () => {
		if (!id) return;
		try {
			await startWork(id, selectedDate);
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo iniciar el trabajo');
		}
	};

	const handlePauseWork = async () => {
		if (!id) return;
		try {
			await pauseWork(id, selectedDate);
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo pausar el trabajo');
		}
	};

	const handleResumeWork = async () => {
		if (!id) return;
		try {
			await resumeWork(id, selectedDate);
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo reanudar el trabajo');
		}
	};

	const handleStopWorkRequest = () => {
		setShowStopModal(true);
	};

	const handleConfirmStop = async () => {
		if (!id) return;
		try {
			await endWork(id, selectedDate);
			setShowStopModal(false);
		} catch (error) {
			setShowStopModal(false);
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo finalizar el trabajo');
		}
	};

	const handleAddRange = () => {
		setEditStartTime('');
		setEditEndTime('');
		setShowAddModal(true);
	};

	const handleSaveNewRange = () => {
		if (!id || !editStartTime) {
			Alert.alert('Error', 'Debe ingresar al menos la hora de inicio');
			return;
		}

		// Parse times
		const [startHour, startMinute] = editStartTime.split(':').map(Number);
		const startDate = new Date(selectedDate);
		startDate.setHours(startHour, startMinute, 0, 0);

		let endDate = null;
		if (editEndTime) {
			const [endHour, endMinute] = editEndTime.split(':').map(Number);
			endDate = new Date(selectedDate);
			endDate.setHours(endHour, endMinute, 0, 0);

			if (endDate <= startDate) {
				Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
				return;
			}
		}

		addTimeRange(id, selectedDate, {
			startTime: startDate,
			endTime: endDate,
			isPaused: false,
			pausedAt: null,
		});

		setShowAddModal(false);
		setEditStartTime('');
		setEditEndTime('');
	};

	const handleEditRange = (rangeId: string) => {
		if (!currentRegistration) return;
		const range = currentRegistration.timeRanges.find(r => r.id === rangeId);
		if (!range) return;

		setSelectedRangeId(rangeId);
		setEditStartTime(formatTime(new Date(range.startTime)));
		setEditEndTime(range.endTime ? formatTime(new Date(range.endTime)) : '');
		setShowEditModal(true);
	};

	const handleSaveEdit = () => {
		if (!currentRegistration || !selectedRangeId) return;

		const range = currentRegistration.timeRanges.find(r => r.id === selectedRangeId);
		if (!range) return;

		// Parse times
		const [startHour, startMinute] = editStartTime.split(':').map(Number);
		const startDate = new Date(range.startTime);
		startDate.setHours(startHour, startMinute, 0, 0);

		let endDate = null;
		if (editEndTime) {
			const [endHour, endMinute] = editEndTime.split(':').map(Number);
			endDate = new Date(range.startTime);
			endDate.setHours(endHour, endMinute, 0, 0);

			if (endDate <= startDate) {
				Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
				return;
			}
		}

		updateTimeRange(currentRegistration.id, selectedRangeId, {
			startTime: startDate,
			endTime: endDate,
		});

		setShowEditModal(false);
		setSelectedRangeId(null);
	};

	const handleDeleteRange = (rangeId: string) => {
		setSelectedRangeId(rangeId);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (!currentRegistration || !selectedRangeId) return;
		deleteTimeRange(currentRegistration.id, selectedRangeId);
		setShowDeleteModal(false);
		setSelectedRangeId(null);
	};

	const isToday = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const current = new Date(selectedDate);
		current.setHours(0, 0, 0, 0);
		return today.getTime() === current.getTime();
	};

	const canGoNext = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const current = new Date(selectedDate);
		current.setHours(0, 0, 0, 0);
		return current.getTime() < today.getTime();
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('es-ES', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getActiveRange = () => {
		if (!currentRegistration) return null;
		return currentRegistration.timeRanges.find((range) => !range.endTime);
	};

	// Calculate current minutes including active range
	const getCurrentMinutes = () => {
		if (!currentRegistration) return 0;
		return calculateCurrentMinutes(currentRegistration.timeRanges, currentTime);
	};

	const calculateRangeDuration = (range: any) => {
		const start = new Date(range.startTime);
		const end = range.endTime ? new Date(range.endTime) : currentTime;

		const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const activeRange = getActiveRange();
	const hasActive = !!activeRange;
	const currentMinutes = getCurrentMinutes();

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} translucent={false} />

			<View style={[styles.floatingButtonsContainer, { paddingTop: insets.top + spacing.sm }]}>
				<ElevatedButton
					backgroundColor={lightTheme.colors.primary}
					icon={ArrowLeft}
					iconSize={22}
					iconColor={lightTheme.colors.onPrimary}
					paddingX={spacing.sm}
					paddingY={spacing.sm}
					rounded={roundness.full}
					shadow="large"
					onPress={() => router.back()}
				/>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.scrollViewContent, { paddingTop: insets.top + 60 }]}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.content}>
					<Text style={styles.title}>Registro horario</Text>

					{/* Date Selector */}
					<Card
						paddingX={spacing.md}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						backgroundColor={lightTheme.colors.surface}
					>
						<View style={styles.dateSelector}>
							<TouchableOpacity onPress={handlePreviousDay} style={styles.dateButton}>
								<ChevronLeft size={24} color={lightTheme.colors.onSurface} />
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setShowCalendarModal(true)}
								style={styles.dateInfo}
							>
								<Calendar size={20} color={lightTheme.colors.primary} />
								<Text style={styles.dateText}>{formatDateToDisplay(selectedDate)}</Text>
								{isToday() && <View style={styles.todayBadge}><Text style={styles.todayText}>Hoy</Text></View>}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleNextDay}
								style={[styles.dateButton, !canGoNext() && styles.dateButtonDisabled]}
								disabled={!canGoNext()}
							>
								<ChevronRight
									size={24}
									color={canGoNext() ? lightTheme.colors.onSurface : lightTheme.colors.onSurfaceVariant}
								/>
							</TouchableOpacity>
						</View>

						{!isToday() && (
							<TouchableOpacity onPress={handleToday} style={styles.todayButton}>
								<Text style={styles.todayButtonText}>Ir a hoy</Text>
							</TouchableOpacity>
						)}
					</Card>

					{loadingRegistration ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color={lightTheme.colors.primary} />
							<Text style={styles.loadingText}>Cargando registro...</Text>
						</View>
					) : (
						<>
							{/* Circular Progress Chart with Buttons - COMBINED CARD */}
							{isToday() && (
								<Card
									paddingX={spacing.sm}
									paddingY={spacing.sm}
									rounded={roundness.sm}
									shadow="small"
									backgroundColor={lightTheme.colors.surface}
								>
									<CircularProgress
										currentMinutes={currentMinutes}
										targetMinutes={480}
										size={180}
									/>

									{/* Control Buttons - Now inside the same card */}
									{isOwnProfile && (
										<View style={styles.controlsContainer}>
											{!hasActive ? (
												<ElevatedButton
													backgroundColor={lightTheme.colors.primary}
													label="Iniciar jornada"
													icon={Play}
													iconSize={20}
													iconColor={lightTheme.colors.onPrimary}
													fontSize={typography.bodyLarge}
													paddingX={spacing.lg}
													paddingY={spacing.md}
													rounded={roundness.sm}
													shadow="none"
													style={styles.controlButton}
													onPress={handleStartWork}
												/>
											) : (
												<>
													{/* TODO -> Fix colors */}
													<ElevatedButton
														backgroundColor={lightTheme.colors.warning}
														label="Pausar"
														icon={Pause}
														iconSize={20}
														iconColor={lightTheme.colors.onWarning}
														fontSize={typography.bodyLarge}
														textColor={lightTheme.colors.onWarning}
														paddingX={spacing.lg}
														paddingY={spacing.md}
														rounded={roundness.sm}
														shadow="none"
														style={styles.controlButton}
														onPress={handlePauseWork}
													/>
													<ElevatedButton
														backgroundColor={lightTheme.colors.error}
														label="Finalizar"
														icon={Square}
														iconSize={20}
														iconColor={lightTheme.colors.onError}
														fontSize={typography.bodyLarge}
														textColor={lightTheme.colors.onError}
														paddingX={spacing.lg}
														paddingY={spacing.md}
														rounded={roundness.sm}
														shadow="none"
														style={styles.controlButton}
														onPress={handleStopWorkRequest}
													/>
												</>
											)}
										</View>
									)}
								</Card>
							)}

							{/* Resume Button - Separate card when paused */}
							{!hasActive && currentRegistration && currentRegistration.timeRanges.length > 0 && isToday() && isOwnProfile && (
								<Card
									paddingX={spacing.md}
									paddingY={spacing.md}
									rounded={roundness.sm}
									shadow="none"
									backgroundColor={lightTheme.colors.surface}
								>
									<ElevatedButton
										backgroundColor={lightTheme.colors.primary}
										label="Reanudar"
										icon={Play}
										iconSize={20}
										iconColor={lightTheme.colors.onPrimary}
										fontSize={typography.bodyLarge}
										paddingX={spacing.lg}
										paddingY={spacing.md}
										rounded={roundness.sm}
										shadow="none"
										onPress={handleResumeWork}
									/>
								</Card>
							)}

							{/* Total Hours Summary */}
							{/* <Card
								paddingX={spacing.lg}
								paddingY={spacing.md}
								rounded={roundness.sm}
								shadow="none"
								backgroundColor={lightTheme.colors.primaryContainer}
							>
								<View style={styles.totalHoursContainer}>
									<Clock size={24} color={lightTheme.colors.onPrimaryContainer} />
									<Text style={styles.totalHoursLabel}>Total:</Text>
									<Text style={styles.totalHoursValue}>
										{currentRegistration ? formatHours(currentRegistration.totalHours, true) : '0h 0m'}
									</Text>
								</View>
							</Card> */}

							{/* Time Ranges List */}
							<View>
								<View style={styles.sectionHeader}>
									<Text style={styles.sectionTitle}>Rangos de tiempo</Text>
									{isOwnProfile && (
										<TouchableOpacity onPress={handleAddRange} style={styles.addButton}>
											<Plus size={20} color={lightTheme.colors.primary} />
											<Text style={styles.addButtonText}>Agregar</Text>
										</TouchableOpacity>
									)}
								</View>

								{!currentRegistration || currentRegistration.timeRanges.length === 0 ? (
									<Card
										paddingX={spacing.lg}
										paddingY={spacing.xl}
										rounded={roundness.sm}
										shadow="none"
										backgroundColor={lightTheme.colors.surface}
									>
										<Text style={styles.emptyText}>No hay rangos de tiempo registrados</Text>
									</Card>
								) : (
									currentRegistration.timeRanges.map((range, index) => (
										<Card
											key={range.id}
											paddingX={spacing.md}
											paddingY={spacing.md}
											rounded={roundness.sm}
											shadow="none"
											backgroundColor={lightTheme.colors.surface}
											style={styles.rangeCard}
										>
											<View style={styles.rangeHeader}>
												<Text style={styles.rangeNumber}>Rango {index + 1}</Text>
												<View style={styles.rangeBadges}>
													{!range.endTime && (
														<View style={styles.activeBadge}>
															<Text style={styles.activeText}>Activo</Text>
														</View>
													)}
													{range.endTime && (
														<View style={styles.completedBadge}>
															<Text style={styles.completedText}>Completado</Text>
														</View>
													)}
												</View>
											</View>

											<View style={styles.rangeContent}>
												<View style={styles.rangeTimeRow}>
													<Text style={styles.rangeLabel}>Inicio:</Text>
													<Text style={styles.rangeValue}>{formatTime(new Date(range.startTime))}</Text>
												</View>

												<View style={styles.rangeTimeRow}>
													<Text style={styles.rangeLabel}>Fin:</Text>
													<Text style={styles.rangeValue}>
														{range.endTime ? formatTime(new Date(range.endTime)) : 'En curso'}
													</Text>
												</View>

												<View style={styles.rangeSeparator} />

												<View style={styles.rangeTimeRow}>
													<Text style={styles.rangeDurationLabel}>Duración:</Text>
													<Text style={styles.rangeDurationValue}>
														{calculateRangeDuration(range)}
													</Text>
												</View>
											</View>

											{isOwnProfile && (
												<View style={styles.rangeActions}>
													<TouchableOpacity
														style={styles.actionButton}
														onPress={() => handleEditRange(range.id)}
													>
														<Edit2 size={18} color={lightTheme.colors.primary} />
														<Text style={styles.editText}>Editar</Text>
													</TouchableOpacity>

													<TouchableOpacity
														style={styles.actionButton}
														onPress={() => handleDeleteRange(range.id)}
													>
														<Trash2 size={18} color={lightTheme.colors.error} />
														<Text style={styles.deleteText}>Eliminar</Text>
													</TouchableOpacity>
												</View>
											)}
										</Card>
									))
								)}
							</View>

							{/* Notes Section */}
							{currentRegistration?.notes && (
								<Card
									paddingX={spacing.md}
									paddingY={spacing.md}
									rounded={roundness.sm}
									shadow="none"
									backgroundColor={lightTheme.colors.surface}
								>
									<Text style={styles.sectionTitle}>Notas</Text>
									<Text style={styles.notesText}>{currentRegistration.notes}</Text>
								</Card>
							)}
						</>
					)}
				</View>
			</ScrollView>

			{/* Calendar Modal */}
			<ActionsModal
				visible={showCalendarModal}
				onClose={() => setShowCalendarModal(false)}
				title="Seleccionar fecha"
			>
				<View style={styles.calendarWrapper}>
					<RNCalendar
						current={selectedDate.toISOString().split('T')[0]}
						onDayPress={handleDateSelect}
						maxDate={new Date().toISOString().split('T')[0]}
						markedDates={{
							[selectedDate.toISOString().split('T')[0]]: {
								selected: true,
								selectedColor: lightTheme.colors.primary,
							},
						}}
						theme={{
							backgroundColor: lightTheme.colors.surface,
							calendarBackground: lightTheme.colors.surface,
							textSectionTitleColor: lightTheme.colors.onSurfaceVariant,
							selectedDayBackgroundColor: lightTheme.colors.primary,
							selectedDayTextColor: lightTheme.colors.onPrimary,
							todayTextColor: lightTheme.colors.primary,
							dayTextColor: lightTheme.colors.onSurface,
							textDisabledColor: lightTheme.colors.onSurfaceVariant,
							monthTextColor: lightTheme.colors.onSurface,
							textMonthFontWeight: '600',
							textDayFontSize: typography.bodyMedium,
							textMonthFontSize: typography.titleMedium,
							textDayHeaderFontSize: typography.labelMedium,
						}}
						style={styles.calendar}
					/>
				</View>
			</ActionsModal>

			{/* Add Range Modal */}
			<ActionsModal
				visible={showAddModal}
				onClose={() => setShowAddModal(false)}
				title="Agregar rango de tiempo"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de inicio</Text>
						<TextInput
							style={styles.input}
							value={editStartTime}
							onChangeText={setEditStartTime}
							placeholder="HH:MM"
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							keyboardType="numbers-and-punctuation"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de fin (opcional)</Text>
						<TextInput
							style={styles.input}
							value={editEndTime}
							onChangeText={setEditEndTime}
							placeholder="HH:MM"
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							keyboardType="numbers-and-punctuation"
						/>
					</View>

					<ElevatedButton
						backgroundColor={lightTheme.colors.primary}
						label="Agregar rango"
						fontSize={typography.bodyLarge}
						paddingX={spacing.lg}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						onPress={handleSaveNewRange}
					/>
				</View>
			</ActionsModal>

			{/* Edit Modal */}
			<ActionsModal
				visible={showEditModal}
				onClose={() => setShowEditModal(false)}
				title="Editar rango de tiempo"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de inicio</Text>
						<TextInput
							style={styles.input}
							value={editStartTime}
							onChangeText={setEditStartTime}
							placeholder="HH:MM"
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							keyboardType="numbers-and-punctuation"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de fin</Text>
						<TextInput
							style={styles.input}
							value={editEndTime}
							onChangeText={setEditEndTime}
							placeholder="HH:MM"
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							keyboardType="numbers-and-punctuation"
						/>
					</View>

					<ElevatedButton
						backgroundColor={lightTheme.colors.primary}
						label="Guardar cambios"
						fontSize={typography.bodyLarge}
						paddingX={spacing.lg}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						onPress={handleSaveEdit}
					/>
				</View>
			</ActionsModal>

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				visible={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDelete}
				title="Eliminar rango"
				message="¿Estás seguro de que quieres eliminar este rango de tiempo? Esta acción no se puede deshacer."
				confirmText="Eliminar"
				cancelText="Cancelar"
			/>

			{/* Stop Work Confirmation Modal */}
			<ConfirmationModal
				visible={showStopModal}
				onClose={() => setShowStopModal(false)}
				onConfirm={handleConfirmStop}
				title="Finalizar jornada"
				message="¿Estás seguro de que quieres finalizar la jornada laboral? Podrás editar los rangos manualmente después."
				confirmText="Finalizar"
				cancelText="Cancelar"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	floatingButtonsContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: spacing.md,
		zIndex: 1000,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	title: {
		fontSize: typography.headlineLarge,
		fontWeight: '700',
		color: lightTheme.colors.onBackground,
	},
	dateSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	dateButton: {
		padding: spacing.sm,
	},
	dateButtonDisabled: {
		opacity: 0.3,
	},
	dateInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
	},
	dateText: {
		fontSize: typography.titleLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	todayBadge: {
		backgroundColor: lightTheme.colors.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.xs,
	},
	todayText: {
		fontSize: typography.labelSmall,
		fontWeight: '600',
		color: lightTheme.colors.onPrimary,
	},
	todayButton: {
		marginTop: spacing.sm,
		paddingVertical: spacing.sm,
		alignItems: 'center',
	},
	todayButtonText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.xs,
		marginTop: spacing.md,
		marginBottom: spacing.sm,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	statusText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	controlsContainer: {
		flexDirection: 'row',
		gap: spacing.sm,
		flexWrap: 'wrap',
		marginTop: spacing.md,
	},
	controlButton: {
		flex: 1,
		minWidth: 140,
	},
	loadingContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: spacing.xl,
		gap: spacing.md,
	},
	loadingText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
	},
	totalHoursContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		justifyContent: 'center',
	},
	totalHoursLabel: {
		fontSize: typography.bodyLarge,
		fontWeight: '500',
		color: lightTheme.colors.onPrimaryContainer,
	},
	totalHoursValue: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
		color: lightTheme.colors.onPrimaryContainer,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	sectionTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
	},
	addButtonText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	emptyText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
		fontStyle: 'italic',
	},
	rangeCard: {
		marginBottom: spacing.sm,
	},
	rangeHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: spacing.sm,
	},
	rangeNumber: {
		fontSize: typography.titleSmall,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	rangeBadges: {
		flexDirection: 'row',
		gap: spacing.xs,
	},
	activeBadge: {
		backgroundColor: lightTheme.colors.primaryContainer,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.xs,
	},
	activeText: {
		fontSize: typography.labelSmall,
		fontWeight: '600',
		color: lightTheme.colors.onPrimaryContainer,
	},
	completedBadge: {
		backgroundColor: lightTheme.colors.outline,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: roundness.xs,
	},
	completedText: {
		fontSize: typography.labelSmall,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	rangeContent: {
		gap: spacing.sm,
	},
	rangeTimeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rangeLabel: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
	},
	rangeValue: {
		fontSize: typography.bodyLarge,
		fontWeight: '500',
		color: lightTheme.colors.onSurface,
	},
	rangeSeparator: {
		height: 1,
		backgroundColor: lightTheme.colors.outline,
		opacity: 0.5,
		marginVertical: spacing.xs,
	},
	rangeDurationLabel: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	rangeDurationValue: {
		fontSize: typography.titleMedium,
		fontWeight: '700',
		color: lightTheme.colors.primary,
	},
	rangeActions: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: lightTheme.colors.outline,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.xs,
		paddingVertical: spacing.sm,
	},
	editText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.primary,
	},
	deleteText: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.error,
	},
	notesText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
		lineHeight: 22,
		marginTop: spacing.xs,
	},
	editModalContent: {
		gap: spacing.md,
	},
	inputGroup: {
		gap: spacing.xs,
	},
	inputLabel: {
		fontSize: typography.bodyMedium,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
	},
	input: {
		backgroundColor: lightTheme.colors.background,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		borderRadius: roundness.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
	},
	calendarWrapper: {
		paddingVertical: spacing.xs,
	},
	calendar: {
		borderRadius: roundness.sm,
	},
});