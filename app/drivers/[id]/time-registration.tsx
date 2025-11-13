import { ActionsModal } from '@/components/ActionsModal';
import { AndroidTimePicker } from '@/components/AndroidTimePicker';
import { Card } from '@/components/Card';
import { CircularProgress } from '@/components/CircularProgress';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { ElevatedButton } from '@/components/ElevatedButton';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTimeRegistrationsStore } from '@/stores/useTimeRegistrationStore';
import { calculateCurrentMinutes, formatDateToDisplay, formatHours, getTotalDayTimeColor } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, Edit2, MessageSquare, Pause, Play, Plus, Square, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
	const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
	const user = useAuthStore((state) => state.user);

	// Initialize selectedDate from URL param if provided, otherwise use today
	const [selectedDate, setSelectedDate] = useState(() => {
		if (date) {
			// Handle YYYY-MM-DD format to avoid timezone issues
			const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
			if (isoDatePattern.test(date)) {
				const [year, month, day] = date.split('-').map(Number);
				return new Date(year, month - 1, day);
			}
			// Fallback to standard parsing
			const parsedDate = new Date(date);
			if (!isNaN(parsedDate.getTime())) {
				return parsedDate;
			}
		}
		return new Date();
	});
	const [showCalendarModal, setShowCalendarModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showStopModal, setShowStopModal] = useState(false);
	const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
	const [editStartTime, setEditStartTime] = useState('');
	const [editEndTime, setEditEndTime] = useState('');
	const [currentTime, setCurrentTime] = useState(new Date());

	// Time picker states
	const [showStartTimePicker, setShowStartTimePicker] = useState(false);
	const [showEndTimePicker, setShowEndTimePicker] = useState(false);
	const [startTimeDate, setStartTimeDate] = useState(new Date());
	const [endTimeDate, setEndTimeDate] = useState(new Date());

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
	const addNote = useTimeRegistrationsStore((state) => state.addNote);
	const updateNote = useTimeRegistrationsStore((state) => state.updateNote);
	const deleteNote = useTimeRegistrationsStore((state) => state.deleteNote);

	// Note modal states
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);
	const [showEditNoteModal, setShowEditNoteModal] = useState(false);
	const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [noteText, setNoteText] = useState('');

	// Check if the selected driver is the logged user
	const isOwnProfile = user?.id === id;

	// Update selectedDate when date param changes
	useEffect(() => {
		if (date) {
			const parsedDate = new Date(date);
			if (!isNaN(parsedDate.getTime())) {
				setSelectedDate(parsedDate);
			}
		}
	}, [date]);

	// Update current time every second
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
		const now = new Date();
		setStartTimeDate(now);
		setEndTimeDate(now);
		setEditStartTime(formatTime(now));
		setEditEndTime('');
		setShowAddModal(true);
		setShowStartTimePicker(true);
	};

	const handleStartTimeChange = (event: any, selectedTime?: Date) => {
		// Determine if user dismissed (Android/IOS)
		const action = event?.type ?? event?.nativeEvent?.action;
		const dismissed = action === 'dismissed' || action === 'dismiss';

		if (dismissed) {
			setShowStartTimePicker(false);
			return;
		}

		// Get selected time or timestamp
		let picked: Date | undefined = selectedTime;
		if (!picked && event?.nativeEvent?.timestamp) {
			picked = new Date(event.nativeEvent.timestamp);
		}

		if (picked) {
			setStartTimeDate(picked);
			setEditStartTime(formatTime(picked));
		}

		// Close picker only when action is 'set' (OK). Keep open (spinner) on iOS.
		if (Platform.OS === 'android' && (action === 'set' || action === 'dateSetAction')) {
			setShowStartTimePicker(false);
		}
	};

	const handleEndTimeChange = (event: any, selectedTime?: Date) => {
		const action = event?.type ?? event?.nativeEvent?.action;
		const dismissed = action === 'dismissed' || action === 'dismiss';

		if (dismissed) {
			setShowEndTimePicker(false);
			return;
		}

		let picked: Date | undefined = selectedTime;
		if (!picked && event?.nativeEvent?.timestamp) {
			picked = new Date(event.nativeEvent.timestamp);
		}

		if (picked) {
			setEndTimeDate(picked);
			setEditEndTime(formatTime(picked));
		}

		if (Platform.OS === 'android' && (action === 'set' || action === 'dateSetAction')) {
			setShowEndTimePicker(false);
		}
	};

	const openStartTimePicker = () => {
		if (showEndTimePicker) {
			setShowEndTimePicker(false);
		}
		setShowStartTimePicker(true);
	};

	const openEndTimePicker = () => {
		if (showStartTimePicker) {
			setShowStartTimePicker(false);
		}
		setShowEndTimePicker(true);
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

		const now = new Date();
		if (startDate > now) {
			Alert.alert('Error', 'La hora de inicio no puede ser mayor a la hora actual');
			return;
		}

		let endDate = null;
		if (editEndTime) {
			const [endHour, endMinute] = editEndTime.split(':').map(Number);
			endDate = new Date(selectedDate);
			endDate.setHours(endHour, endMinute, 0, 0);

			if (endDate <= startDate) {
				Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
				return;
			}

			if (endDate > now) {
				Alert.alert('Error', 'La hora de fin no puede ser mayor a la hora actual');
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
		setShowStartTimePicker(false);
		setShowEndTimePicker(false);
		setEditStartTime('');
		setEditEndTime('');
	};

	const handleEditRange = (rangeId: string) => {
		if (!currentRegistration) return;
		const range = currentRegistration.timeRanges.find(r => r.id === rangeId);
		if (!range) return;

		setSelectedRangeId(rangeId);
		const startDate = new Date(range.startTime);
		const endDate = range.endTime ? new Date(range.endTime) : new Date();

		setStartTimeDate(startDate);
		setEndTimeDate(endDate);
		setEditStartTime(formatTime(startDate));
		setEditEndTime(range.endTime ? formatTime(endDate) : '');
		setShowEditModal(true);
		// iOS: Open start time picker by default after a small delay to ensure modal is rendered
		if (Platform.OS === 'ios') {
			setTimeout(() => {
				setShowStartTimePicker(true);
			}, 100);
		}
	};

	const handleSaveEdit = () => {
		if (!currentRegistration || !selectedRangeId) return;

		const range = currentRegistration.timeRanges.find(r => r.id === selectedRangeId);
		if (!range) return;

		// Parse times
		const [startHour, startMinute] = editStartTime.split(':').map(Number);
		const startDate = new Date(range.startTime);
		startDate.setHours(startHour, startMinute, 0, 0);

		const now = new Date();
		if (startDate > now) {
			Alert.alert('Error', 'La hora de inicio no puede ser mayor a la hora actual');
			return;
		}

		let endDate = null;
		if (editEndTime) {
			const [endHour, endMinute] = editEndTime.split(':').map(Number);
			endDate = new Date(range.startTime);
			endDate.setHours(endHour, endMinute, 0, 0);

			if (endDate <= startDate) {
				Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
				return;
			}

			if (endDate > now) {
				Alert.alert('Error', 'La hora de fin no puede ser mayor a la hora actual');
				return;
			}
		}

		updateTimeRange(currentRegistration.id, selectedRangeId, {
			startTime: startDate,
			endTime: endDate,
		});

		setShowEditModal(false);
		setShowStartTimePicker(false);
		setShowEndTimePicker(false);
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

	const handleAddNote = () => {
		console.log('=== handleAddNote called ===');
		console.log('currentRegistration:', currentRegistration ? 'exists' : 'null');
		console.log('noteText:', noteText);

		if (!currentRegistration) {
			console.log('ERROR: No current registration');
			Alert.alert('Error', 'No hay un registro de tiempo seleccionado');
			return;
		}

		const trimmedText = noteText.trim();
		console.log('trimmedText:', trimmedText);
		console.log('trimmedText.length:', trimmedText.length);

		if (!trimmedText) {
			console.log('ERROR: Empty text');
			Alert.alert('Error', 'El texto de la nota no puede estar vacío');
			return;
		}

		if (trimmedText.length > 500) {
			console.log('ERROR: Text too long');
			Alert.alert('Error', 'El texto de la nota no puede superar los 500 caracteres');
			return;
		}

		try {
			console.log('Calling addNote with:', currentRegistration.id, trimmedText);
			addNote(currentRegistration.id, trimmedText);
			console.log('Note added successfully');
			setNoteText('');
			setShowAddNoteModal(false);
			Alert.alert('Éxito', 'Nota agregada correctamente');
		} catch (error) {
			console.error('ERROR adding note:', error);
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo añadir la nota');
		}
	};

	const handleEditNote = () => {
		if (!currentRegistration) {
			Alert.alert('Error', 'No hay un registro de tiempo seleccionado');
			return;
		}

		if (!selectedNoteId) {
			Alert.alert('Error', 'No hay ninguna nota seleccionada');
			return;
		}

		const trimmedText = noteText.trim();
		if (!trimmedText) {
			Alert.alert('Error', 'El texto de la nota no puede estar vacío');
			return;
		}

		if (trimmedText.length > 500) {
			Alert.alert('Error', 'El texto de la nota no puede superar los 500 caracteres');
			return;
		}

		try {
			updateNote(currentRegistration.id, selectedNoteId, trimmedText);
			setNoteText('');
			setSelectedNoteId(null);
			setShowEditNoteModal(false);
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo actualizar la nota');
		}
	};

	const handleDeleteNote = () => {
		if (!currentRegistration) {
			Alert.alert('Error', 'No hay un registro de tiempo seleccionado');
			return;
		}

		if (!selectedNoteId) {
			Alert.alert('Error', 'No hay ninguna nota seleccionada');
			return;
		}

		try {
			deleteNote(currentRegistration.id, selectedNoteId);
			setSelectedNoteId(null);
			setShowDeleteNoteModal(false);
		} catch (error) {
			Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo eliminar la nota');
		}
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
	// FIXED: Only use currentTime for calculations if it's today
	const getCurrentMinutes = () => {
		if (!currentRegistration) return 0;

		// If selected date is not today, use the registration's totalHours
		// This prevents miscalculation for past days with active ranges
		if (!isToday()) {
			return Math.floor(currentRegistration.totalHours * 60);
		}

		// Only use real-time calculation for today
		return calculateCurrentMinutes(currentRegistration.timeRanges, currentTime);
	};

	const calculateRangeDuration = (range: any) => {
		const start = new Date(range.startTime);
		let end: Date;

		if (range.endTime) {
			// If range has an end time, use it
			end = new Date(range.endTime);
		} else {
			// Range is open (no endTime)
			if (isToday()) {
				// For today, use current time
				end = currentTime;
			} else {
				// For past days, use 23:59 of that day
				const dayEnd = new Date(selectedDate);
				dayEnd.setHours(23, 59, 59, 999);
				end = dayEnd;
			}
		}

		const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const getRangeEndDisplay = (range: any) => {
		if (range.endTime) {
			return formatTime(new Date(range.endTime));
		}

		// Range is open (no endTime)
		if (isToday()) {
			return 'En curso';
		}

		// For past days, show 23:59
		const dayEnd = new Date(selectedDate);
		dayEnd.setHours(23, 59, 0, 0);
		return formatTime(dayEnd);
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
							<Card
								paddingX={spacing.sm}
								paddingY={spacing.sm}
								rounded={roundness.sm}
								shadow="small"
								backgroundColor={lightTheme.colors.surface}
							>
								{
									currentRegistration?.isActive ? (
										<CircularProgress
											currentMinutes={currentMinutes}
											targetMinutes={480}
											size={180}
											circleColor={hasActive ? lightTheme.colors.primary : lightTheme.colors.statusInactive}
										/>
									) : (
										<CircularProgress
											currentMinutes={currentMinutes}
											targetMinutes={480}
											size={180}
											circleColor={getTotalDayTimeColor(currentMinutes).container}
										/>
									)
								}

								{isToday() && (
									<>
										{isOwnProfile && currentRegistration?.isActive && (
											<View style={styles.controlsContainer}>
												{!hasActive ? (
													<>
														<ElevatedButton
															backgroundColor={lightTheme.colors.statusInactive}
															label="Reanudar"
															icon={Play}
															iconSize={20}
															iconColor={lightTheme.colors.onStatusInactive}
															fontSize={typography.bodyLarge}
															textColor={lightTheme.colors.onStatusInactive}
															paddingX={spacing.lg}
															paddingY={spacing.md}
															rounded={roundness.sm}
															shadow="none"
															style={styles.controlButton}
															onPress={handleResumeWork}
														/>
														<ElevatedButton
															backgroundColor={lightTheme.colors.statusBrokenDown}
															label="Finalizar"
															icon={Square}
															iconSize={20}
															iconColor={lightTheme.colors.onStatusBrokenDown}
															fontSize={typography.bodyLarge}
															textColor={lightTheme.colors.onStatusBrokenDown}
															paddingX={spacing.lg}
															paddingY={spacing.md}
															rounded={roundness.sm}
															shadow="none"
															style={styles.controlButton}
															onPress={handleStopWorkRequest}
														/>
													</>
												) : (
													<>
														<ElevatedButton
															backgroundColor={lightTheme.colors.warning}
															label="Pausar"
															icon={Pause}
															iconSize={20}
															iconColor={lightTheme.colors.onStatusInactive}
															fontSize={typography.bodyLarge}
															textColor={lightTheme.colors.onStatusInactive}
															paddingX={spacing.lg}
															paddingY={spacing.md}
															rounded={roundness.sm}
															shadow="none"
															style={styles.controlButton}
															onPress={handlePauseWork}
														/>
														<ElevatedButton
															backgroundColor={lightTheme.colors.statusBrokenDown}
															label="Finalizar"
															icon={Square}
															iconSize={20}
															iconColor={lightTheme.colors.onStatusBrokenDown}
															fontSize={typography.bodyLarge}
															textColor={lightTheme.colors.onStatusBrokenDown}
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

										{isOwnProfile && (!currentRegistration || currentRegistration.timeRanges.length === 0) && (
											<View style={styles.controlsContainer}>
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
											</View>
										)}
									</>
								)}
							</Card>

							{(!isToday() || (isToday() && currentRegistration && !currentRegistration.isActive)) && (
								(() => {
									const totalMinutes = currentRegistration
										? Math.floor(currentRegistration.totalHours * 60)
										: 0;
									const colors = getTotalDayTimeColor(totalMinutes);
									return (
										<Card
											paddingX={spacing.lg}
											paddingY={spacing.md}
											rounded={roundness.sm}
											shadow="none"
											backgroundColor={colors.container}
										>
											<View style={styles.totalHoursContainer}>
												<Clock size={24} color={colors.text} />
												<Text style={[styles.totalHoursLabel, { color: colors.text }]}>Total:</Text>
												<Text style={[styles.totalHoursValue, { color: colors.text }]}>
													{currentRegistration ? formatHours(currentRegistration.totalHours, true) : '0h 0m'}
												</Text>
											</View>
										</Card>
									)
								})()
							)}

							<View>
								<View style={styles.sectionHeader}>
									<View style={styles.sectionHeaderTitle}>
										<Clock size={18} color={lightTheme.colors.onSurfaceVariant} />
										<Text style={styles.sectionTitle}>Rangos de tiempo</Text>
									</View>
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
											<View style={styles.rangeContent}>
												<View style={styles.rangeTimeRow}>
													<Text style={styles.rangeLabel}>Inicio:</Text>
													<Text style={styles.rangeValue}>{formatTime(new Date(range.startTime))}</Text>
												</View>

												<View style={styles.rangeTimeRow}>
													<Text style={styles.rangeLabel}>Fin:</Text>
													<Text style={[styles.rangeValue, range.endTime ? {} : styles.rangeValueActive]}>
														{getRangeEndDisplay(range)}
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

							<View>
								<View style={styles.sectionHeader}>
									<View style={styles.sectionHeaderTitle}>
										<MessageSquare size={18} color={lightTheme.colors.onSurfaceVariant} />
										<Text style={styles.sectionTitle}>Notas</Text>
									</View>
									{isOwnProfile && currentRegistration && (
										<TouchableOpacity onPress={() => {
											setNoteText('');
											setShowAddNoteModal(true);
										}} style={styles.addButton}>
											<Plus size={20} color={lightTheme.colors.primary} />
											<Text style={styles.addButtonText}>Agregar</Text>
										</TouchableOpacity>
									)}
								</View>

								{!currentRegistration || currentRegistration.notes.length === 0 ? (
									<Card
										paddingX={spacing.lg}
										paddingY={spacing.xl}
										rounded={roundness.sm}
										shadow="none"
										backgroundColor={lightTheme.colors.surface}
									>
										<Text style={styles.emptyText}>No hay notas registradas</Text>
									</Card>
								) : (
									currentRegistration.notes.map((note) => (
										<Card
											key={note.id}
											paddingX={spacing.md}
											paddingY={spacing.md}
											rounded={roundness.sm}
											shadow="none"
											backgroundColor={lightTheme.colors.surface}
											style={styles.rangeCard}
										>
											<View style={styles.noteContent}>
												<View style={styles.noteHeader}>
													<Text style={styles.noteDate}>
														{new Date(note.createdAt).toLocaleDateString('es-ES', {
															day: '2-digit',
															month: 'short',
															year: 'numeric',
															hour: '2-digit',
															minute: '2-digit'
														})}
													</Text>
													{note.updatedAt && (
														<Text style={styles.noteUpdated}>(editada)</Text>
													)}
												</View>
												<Text style={styles.noteText}>{note.text}</Text>

												{isOwnProfile && (
													<View style={styles.rangeActions}>
														<TouchableOpacity
															style={styles.actionButton}
															onPress={() => {
																setSelectedNoteId(note.id);
																setNoteText(note.text);
																setShowEditNoteModal(true);
															}}
														>
															<Edit2 size={18} color={lightTheme.colors.primary} />
															<Text style={styles.editText}>Editar</Text>
														</TouchableOpacity>

														<TouchableOpacity
															style={styles.actionButton}
															onPress={() => {
																setSelectedNoteId(note.id);
																setShowDeleteNoteModal(true);
															}}
														>
															<Trash2 size={18} color={lightTheme.colors.error} />
															<Text style={styles.deleteText}>Eliminar</Text>
														</TouchableOpacity>
													</View>
												)}
											</View>
										</Card>
									))
								)}
							</View>
						</>
					)}
				</View>
			</ScrollView>

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

			<ActionsModal
				visible={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					setShowStartTimePicker(false);
					setShowEndTimePicker(false);
					setEditStartTime('');
					setEditEndTime('');
				}}
				title="Agregar rango de tiempo"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de inicio</Text>
						<TouchableOpacity
							style={styles.timePickerButton}
							onPress={openStartTimePicker}
						>
							<Clock size={20} color={lightTheme.colors.onSurfaceVariant} />
							<Text style={styles.timePickerText}>
								{editStartTime || 'Seleccionar hora'}
							</Text>
						</TouchableOpacity>
						{showStartTimePicker && (
							Platform.OS === 'ios' ? (
								<DateTimePicker
									value={startTimeDate}
									mode="time"
									is24Hour={true}
									display="spinner"
									onChange={handleStartTimeChange}
									accentColor={lightTheme.colors.primary}
									themeVariant="light"
								/>
							) : (
								<AndroidTimePicker
									visible={true}
									value={startTimeDate}
									onChange={(d) => {
										setStartTimeDate(d);
										setEditStartTime(formatTime(d));
									}}
									onConfirm={() => {
										setShowStartTimePicker(false);
									}}
									onCancel={() => {
										setShowStartTimePicker(false);
									}}
								/>
							)
						)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de fin (opcional)</Text>
						<TouchableOpacity
							style={styles.timePickerButton}
							onPress={openEndTimePicker}
						>
							<Clock size={20} color={lightTheme.colors.onSurfaceVariant} />
							<Text style={styles.timePickerText}>
								{editEndTime || 'Seleccionar hora'}
							</Text>
						</TouchableOpacity>
						{showEndTimePicker && (
							Platform.OS === 'ios' ? (
								<DateTimePicker
									value={endTimeDate}
									mode="time"
									is24Hour={true}
									display="spinner"
									onChange={handleEndTimeChange}
									accentColor={lightTheme.colors.primary}
									themeVariant="light"
								/>
							) : (
								<AndroidTimePicker
									visible={true}
									value={endTimeDate}
									onChange={(d) => {
										setEndTimeDate(d);
										setEditEndTime(formatTime(d));
									}}
									onConfirm={() => {
										setShowEndTimePicker(false);
									}}
									onCancel={() => {
										setShowEndTimePicker(false);
									}}
								/>
							)
						)}
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

			<ActionsModal
				visible={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setShowStartTimePicker(false);
					setShowEndTimePicker(false);
					setSelectedRangeId(null);
				}}
				title="Editar rango de tiempo"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de inicio</Text>
						<TouchableOpacity
							style={styles.timePickerButton}
							onPress={openStartTimePicker}
						>
							<Clock size={20} color={lightTheme.colors.onSurfaceVariant} />
							<Text style={styles.timePickerText}>
								{editStartTime || 'Seleccionar hora'}
							</Text>
						</TouchableOpacity>
						{showStartTimePicker && (
							Platform.OS === 'ios' ? (
								<DateTimePicker
									value={startTimeDate}
									mode="time"
									is24Hour={true}
									display="spinner"
									onChange={handleStartTimeChange}
									accentColor={lightTheme.colors.primary}
									themeVariant="light"
								/>
							) : (
								<AndroidTimePicker
									visible={true}
									value={startTimeDate}
									onChange={(d) => {
										setStartTimeDate(d);
										setEditStartTime(formatTime(d));
									}}
									onConfirm={() => {
										setShowStartTimePicker(false);
									}}
									onCancel={() => {
										setShowStartTimePicker(false);
									}}
								/>
							)
						)}
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Hora de fin</Text>
						<TouchableOpacity
							style={styles.timePickerButton}
							onPress={openEndTimePicker}
						>
							<Clock size={20} color={lightTheme.colors.onSurfaceVariant} />
							<Text style={styles.timePickerText}>
								{editEndTime || 'Seleccionar hora'}
							</Text>
						</TouchableOpacity>
						{showEndTimePicker && (
							Platform.OS === 'ios' ? (
								<DateTimePicker
									value={endTimeDate}
									mode="time"
									is24Hour={true}
									display="spinner"
									onChange={handleEndTimeChange}
									accentColor={lightTheme.colors.primary}
									themeVariant="light"
								/>
							) : (
								<AndroidTimePicker
									visible={true}
									value={endTimeDate}
									onChange={(d) => {
										setEndTimeDate(d);
										setEditEndTime(formatTime(d));
									}}
									onConfirm={() => {
										setShowEndTimePicker(false);
									}}
									onCancel={() => {
										setShowEndTimePicker(false);
									}}
								/>
							)
						)}
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

			<ConfirmationModal
				visible={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDelete}
				title="Eliminar rango"
				message="¿Estás seguro de que quieres eliminar este rango de tiempo? Esta acción no se puede deshacer."
				confirmText="Eliminar"
				cancelText="Cancelar"
			/>

			<ConfirmationModal
				visible={showStopModal}
				onClose={() => setShowStopModal(false)}
				onConfirm={handleConfirmStop}
				title="Finalizar jornada"
				message="¿Estás seguro de que quieres finalizar la jornada laboral? Podrás editar los rangos manualmente después."
				confirmText="Finalizar"
				cancelText="Cancelar"
			/>

			<ActionsModal
				visible={showAddNoteModal}
				onClose={() => {
					setShowAddNoteModal(false);
					setNoteText('');
				}}
				title="Agregar nota"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={styles.inputLabel}>Texto de la nota</Text>
							<Text style={[
								styles.inputLabel,
								{ fontSize: typography.labelMedium, color: noteText.length > 500 ? lightTheme.colors.error : lightTheme.colors.onSurfaceVariant }
							]}>
								{noteText.length}/500
							</Text>
						</View>
						<TextInput
							style={[styles.input, styles.noteInput]}
							value={noteText}
							onChangeText={setNoteText}
							placeholder="Escribe aquí tu nota..."
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							maxLength={500}
						/>
					</View>

					<ElevatedButton
						backgroundColor={lightTheme.colors.primary}
						label="Agregar"
						fontSize={typography.bodyLarge}
						paddingX={spacing.lg}
						paddingY={spacing.md}
						rounded={roundness.sm}
						shadow="none"
						onPress={handleAddNote}
					/>
				</View>
			</ActionsModal>

			<ActionsModal
				visible={showEditNoteModal}
				onClose={() => {
					setShowEditNoteModal(false);
					setNoteText('');
					setSelectedNoteId(null);
				}}
				title="Editar nota"
			>
				<View style={styles.editModalContent}>
					<View style={styles.inputGroup}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text style={styles.inputLabel}>Texto de la nota</Text>
							<Text style={[
								styles.inputLabel,
								{ fontSize: typography.labelMedium, color: noteText.length > 500 ? lightTheme.colors.error : lightTheme.colors.onSurfaceVariant }
							]}>
								{noteText.length}/500
							</Text>
						</View>
						<TextInput
							style={[styles.input, styles.noteInput]}
							value={noteText}
							onChangeText={setNoteText}
							placeholder="Escribe aquí tu nota..."
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							maxLength={500}
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
						onPress={handleEditNote}
					/>
				</View>
			</ActionsModal>

			<ConfirmationModal
				visible={showDeleteNoteModal}
				onClose={() => {
					setShowDeleteNoteModal(false);
					setSelectedNoteId(null);
				}}
				onConfirm={handleDeleteNote}
				title="Eliminar nota"
				message="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
				confirmText="Eliminar"
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
	},
	totalHoursValue: {
		fontSize: typography.headlineSmall,
		fontWeight: '700',
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.sm,
	},
	sectionHeaderTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
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
	rangeValueActive: {
		fontWeight: '700',
		color: lightTheme.colors.primary,
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
	noteContent: {
		gap: spacing.sm,
	},
	noteHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		marginBottom: spacing.xs,
	},
	noteDate: {
		fontSize: typography.labelMedium,
		color: lightTheme.colors.onSurfaceVariant,
		flex: 1,
	},
	noteUpdated: {
		fontSize: typography.labelSmall,
		color: lightTheme.colors.onSurfaceVariant,
		fontStyle: 'italic',
	},
	noteText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
		lineHeight: 22,
	},
	noteInput: {
		minHeight: 100,
		paddingTop: spacing.sm,
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
	timePickerButton: {
		backgroundColor: lightTheme.colors.surface,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
		borderRadius: roundness.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		marginBottom: spacing.sm,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	timePickerText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	calendarWrapper: {
		paddingVertical: spacing.xs,
	},
	calendar: {
		borderRadius: roundness.sm,
	},
});