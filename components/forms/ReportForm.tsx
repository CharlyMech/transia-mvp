import { ActionsModal } from '@/components/ActionsModal';
import { ReportsTypes } from '@/constants/enums/ReportsTypes';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useLocation } from '@/hooks/useLocation';
import type { Location, ReportFormData } from '@/models/report';
import { ReportFormSchema } from '@/models/report';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriversStore } from '@/stores/useDriversStore';
import { useFleetStore } from '@/stores/useFleetStore';
import { Camera, ChevronDown, Image as ImageIcon, MapPinOff, Truck, User, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import { LeafletMap } from '../LeafletMap';

type ReportFormProps = {
	initialData?: Partial<ReportFormData> & { images?: string[]; noteText?: string };
	driverId: string;
	vehicleInfo?: string;
	driverName?: string;
	onSubmit: (data: ReportFormData & { images: string[]; noteText: string }) => void;
	onFormChange?: (hasChanges: boolean) => void;
	submitLabel?: string;
	loading?: boolean;
	isEditMode?: boolean;
};

type FormDataWithImages = ReportFormData & { images: string[] };

export function ReportForm({
	initialData,
	driverId,
	vehicleInfo,
	driverName = 'Conductor',
	onSubmit,
	onFormChange,
	submitLabel = 'Crear reporte',
	loading = false,
	isEditMode = false
}: ReportFormProps) {
	const { theme } = useAppTheme();
	const { user } = useAuthStore();
	const drivers = useDriversStore((state) => state.drivers);
	const vehicles = useFleetStore((state) => state.vehicles);

	const driver = useMemo(() =>
		drivers.find(d => d.id === driverId),
		[drivers, driverId]
	);

	const vehicle = useMemo(() =>
		vehicles.find(v => v.id === initialData?.vehicleId),
		[vehicles, initialData?.vehicleId]
	);

	const fullDriverName = useMemo(() => {
		if (driver) {
			return `${driver.name} ${driver.surnames}`.trim();
		}
		return driverName;
	}, [driver, driverName]);

	const fullVehicleInfo = useMemo(() => {
		if (vehicle) {
			return `${vehicle.plateNumber} - ${vehicle.vehicleBrand} ${vehicle.vehicleModel}`;
		}
		return vehicleInfo;
	}, [vehicle, vehicleInfo]);

	const { pickImage, takePhoto, loading: imageLoading } = useImagePicker();
	const { location: currentLocation, loading: locationLoading, requestLocation } = useLocation();

	const initialFormData: FormDataWithImages = {
		title: initialData?.title || ReportsTypes.OTHER,
		description: initialData?.description || '',
		vehicleId: initialData?.vehicleId || '',
		driverId: driverId,
		images: initialData?.images || [],
		location: initialData?.location || null,
	};

	const [formData, setFormData] = useState<FormDataWithImages>(initialFormData);
	const [noteText, setNoteText] = useState(initialData?.noteText || '');
	const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});
	const [showImageOptions, setShowImageOptions] = useState(false);
	const [showReportTypePicker, setShowReportTypePicker] = useState(false);
	const [includeLocation, setIncludeLocation] = useState(!!initialData?.location);
	const [locationSet, setLocationSet] = useState(!!initialData?.location);

	// Request location on mount if includeLocation is true
	useEffect(() => {
		if (includeLocation && !locationSet && !currentLocation) {
			requestLocation();
		}
	}, [includeLocation, locationSet, currentLocation, requestLocation]);

	// Update formData.location when currentLocation changes
	useEffect(() => {
		if (includeLocation && currentLocation && !locationSet) {
			setFormData(prev => ({ ...prev, location: currentLocation }));
			setLocationSet(true);
		}
	}, [currentLocation, includeLocation, locationSet]);

	// Check if form has changes
	const checkForChanges = (newData: FormDataWithImages, newNoteText?: string) => {
		const noteTextChanged = (newNoteText !== undefined ? newNoteText : noteText) !== (initialData?.noteText || '');
		const hasChanges = noteTextChanged || (Object.keys(newData) as (keyof FormDataWithImages)[]).some(key => {
			if (key === 'images') {
				return JSON.stringify(newData[key]) !== JSON.stringify(initialFormData[key]);
			}
			return newData[key] !== initialFormData[key];
		});
		onFormChange?.(hasChanges);
	};

	const handleChange = (field: keyof ReportFormData, value: any) => {
		const newData = { ...formData, [field]: value };
		setFormData(newData);
		checkForChanges(newData);

		if (errors[field]) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleImageSelect = async (type: 'camera' | 'gallery') => {
		setShowImageOptions(false);
		const uri = type === 'camera' ? await takePhoto() : await pickImage();
		if (uri) {
			const newImages = [...formData.images, uri];
			const newData = { ...formData, images: newImages };
			setFormData(newData);
			checkForChanges(newData);
		}
	};

	const handleRemoveImage = (index: number) => {
		const newImages = formData.images.filter((_, i) => i !== index);
		const newData = { ...formData, images: newImages };
		setFormData(newData);
		checkForChanges(newData);
	};

	const handleReportTypeSelect = (type: ReportsTypes) => {
		handleChange('title', type);
		setShowReportTypePicker(false);
	};

	const handleToggleLocation = () => {
		const newValue = !includeLocation;
		setIncludeLocation(newValue);

		if (!newValue) {
			// If disabling location, clear it
			const newData = { ...formData, location: null };
			setFormData(newData);
			checkForChanges(newData);
			setLocationSet(false);
		} else {
			// If enabling location, request it
			if (!currentLocation) {
				requestLocation();
			}
		}
	};

	const handleLocationChange = (newLocation: Location) => {
		const newData = { ...formData, location: newLocation };
		setFormData(newData);
		checkForChanges(newData);
		setLocationSet(true);
	};

	const styles = createStyles(theme);

	const handleSubmit = () => {
		try {
			// Validate noteText separately (minimum 10 characters)
			if (noteText.trim().length < 10) {
				setErrors({ ...errors, description: 'La nota debe tener al menos 10 caracteres' });
				return;
			}

			const dataToValidate = {
				...formData,
				location: includeLocation ? formData.location : null,
			};
			const validatedData = ReportFormSchema.parse(dataToValidate);
			setErrors({});
			onSubmit({ ...validatedData, images: formData.images, noteText: noteText.trim() });
		} catch (error) {
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as any;
				const newErrors: Partial<Record<keyof ReportFormData, string>> = {};
				zodError.errors?.forEach((err: any) => {
					const field = err.path[0] as keyof ReportFormData;
					newErrors[field] = err.message;
				});
				setErrors(newErrors);
			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.section}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Tipo de reporte *</Text>
					<TouchableOpacity
						style={[styles.input, styles.dateInput, errors.title && styles.inputError]}
						onPress={() => setShowReportTypePicker(true)}
					>
						<Text style={styles.dateText}>
							{formData.title}
						</Text>
						<ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
					</TouchableOpacity>
					{errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
				</View>
			</View>

			<ActionsModal
				visible={showReportTypePicker}
				onClose={() => setShowReportTypePicker(false)}
				title="Seleccionar tipo de reporte"
				animationType="fade"
			>
				<View style={styles.reportTypePickerContent}>
					{Object.values(ReportsTypes).map((type) => (
						<TouchableOpacity
							key={type}
							style={[
								styles.reportTypeOption,
								formData.title === type && styles.reportTypeOptionActive
							]}
							onPress={() => handleReportTypeSelect(type)}
						>
							<Text style={[
								styles.reportTypeOptionText,
								formData.title === type && styles.reportTypeOptionTextActive
							]}>
								{type}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ActionsModal>

			{isEditMode && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Información del Reporte</Text>

					<View style={styles.infoDisplayContainer}>
						<View style={styles.infoRow}>
							<User size={24} color={theme.colors.primary} />
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Conductor</Text>
								<Text style={styles.infoValue}>{fullDriverName}</Text>
							</View>
						</View>

						{/* TODO -> Allow to change the vehicle */}
						<View style={styles.infoRow}>
							<Truck size={24} color={theme.colors.primary} />
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Vehículo</Text>
								<Text style={styles.infoValue}>{fullVehicleInfo}</Text>
							</View>
						</View>
					</View>
				</View>
			)}

			<View style={styles.section}>
				<View style={styles.inputContainer}>
					<View style={styles.labelRow}>
						<Text style={styles.label}>Nota *</Text>
						<Text style={styles.characterCount}>
							{noteText.length}/500
						</Text>
					</View>
					<TextInput
						style={[styles.textArea, errors.description && styles.inputError]}
						value={noteText}
						onChangeText={(value) => {
							if (value.length <= 500) {
								setNoteText(value);
								checkForChanges(formData, value);
								if (errors.description) {
									setErrors(prev => {
										const newErrors = { ...prev };
										delete newErrors.description;
										return newErrors;
									});
								}
							}
						}}
						placeholder="Describe la incidencia con el mayor detalle posible..."
						placeholderTextColor={theme.colors.onSurfaceVariant}
						multiline
						numberOfLines={6}
						textAlignVertical="top"
						maxLength={500}
					/>
					{errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
				</View>
			</View>

			{/* Images */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Imágenes</Text>

				{formData.images.length > 0 && (
					<View style={styles.imagesGrid}>
						{formData.images.map((uri, index) => (
							<View key={index} style={styles.imagePreviewContainer}>
								<Image source={{ uri }} style={styles.imagePreview} />
								<Pressable
									style={styles.removeImageButton}
									onPress={() => handleRemoveImage(index)}
								>
									<X size={16} color={theme.colors.onPrimary} />
								</Pressable>
							</View>
						))}
					</View>
				)}

				<TouchableOpacity
					style={styles.addImageButton}
					onPress={() => setShowImageOptions(true)}
					disabled={imageLoading}
				>
					{imageLoading ? (
						<ActivityIndicator color={theme.colors.primary} />
					) : (
						<>
							<Camera size={24} color={theme.colors.primary} />
							<Text style={styles.addImageText}>
								{formData.images.length > 0 ? 'Añadir más imágenes' : 'Añadir imágenes'}
							</Text>
						</>
					)}
				</TouchableOpacity>
			</View>

			<ActionsModal
				visible={showImageOptions}
				onClose={() => setShowImageOptions(false)}
				title="Seleccionar imagen"
				animationType="fade"
			>
				<View style={styles.imageOptionsContent}>
					<TouchableOpacity
						style={styles.imageOption}
						onPress={() => handleImageSelect('camera')}
					>
						<Camera size={24} color={theme.colors.onSurface} />
						<Text style={styles.imageOptionText}>Tomar foto</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.imageOption}
						onPress={() => handleImageSelect('gallery')}
					>
						<ImageIcon size={24} color={theme.colors.onSurface} />
						<Text style={styles.imageOptionText}>Elegir de galería</Text>
					</TouchableOpacity>
				</View>
			</ActionsModal>

			{/* Location */}
			<View style={styles.section}>
				<View style={styles.locationHeader}>
					<Text style={styles.sectionTitle}>Ubicación</Text>
					<TouchableOpacity
						style={styles.locationToggle}
						onPress={handleToggleLocation}
						activeOpacity={0.7}
					>
						<View style={[
							styles.checkbox,
							includeLocation && styles.checkboxChecked
						]}>
							{includeLocation && (
								<Text style={styles.checkmark}>✓</Text>
							)}
						</View>
						<Text style={styles.checkboxLabel}>
							Incluir ubicación
						</Text>
					</TouchableOpacity>
				</View>

				{includeLocation && (
					<View style={styles.locationContainer}>
						{locationLoading && !formData.location ? (
							<View style={styles.locationLoadingContainer}>
								<ActivityIndicator size="large" color={theme.colors.primary} />
								<Text style={styles.locationLoadingText}>Obteniendo ubicación...</Text>
							</View>
						) : formData.location ? (
							<LeafletMap
								location={formData.location}
								onLocationChange={handleLocationChange}
								editable={true}
								showAddress={false}
								height={300}
								containerStyle={styles.mapContainer}
							/>
						) : (
							<TouchableOpacity
								style={styles.requestLocationButton}
								onPress={requestLocation}
							>
								<MapPinOff size={24} color={theme.colors.primary} />
								<Text style={styles.requestLocationText}>Solicitar ubicación</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>

			<TouchableOpacity
				style={[styles.submitButton, loading && styles.submitButtonDisabled]}
				onPress={handleSubmit}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color={theme.colors.onPrimary} />
				) : (
					<Text style={styles.submitButtonText}>{submitLabel}</Text>
				)}
			</TouchableOpacity>

			<View style={styles.bottomSpacer} />
		</View>
	);
}

const createStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	content: {
		padding: spacing.md,
	},
	section: {
		marginBottom: spacing.lg,
	},
	sectionTitle: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: theme.colors.onBackground,
		marginBottom: spacing.md,
	},
	inputContainer: {
		marginBottom: spacing.md,
	},
	label: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: theme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	labelRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.xs,
	},
	characterCount: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
	},
	input: {
		backgroundColor: theme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	inputError: {
		borderColor: theme.colors.error,
	},
	textArea: {
		backgroundColor: theme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		borderWidth: 1,
		borderColor: 'transparent',
		minHeight: 100,
	},
	dateInput: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dateText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
	},
	placeholderText: {
		color: theme.colors.onSurfaceVariant,
	},
	errorText: {
		fontSize: typography.bodySmall,
		color: theme.colors.error,
		marginTop: spacing.xs,
	},
	reportTypePickerContent: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	reportTypeOption: {
		width: '100%',
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: theme.colors.background,
	},
	reportTypeOptionActive: {
		backgroundColor: theme.colors.primaryContainer,
	},
	reportTypeOptionText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		fontWeight: '500',
	},
	reportTypeOptionTextActive: {
		fontWeight: '600',
	},
	infoDisplayContainer: {
		backgroundColor: theme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		gap: spacing.md,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	truckIcon: {
		fontSize: 20,
	},
	infoContent: {
		flex: 1,
	},
	infoLabel: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		marginBottom: spacing.xs / 2,
	},
	infoValue: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onSurface,
	},
	imagesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	imagePreviewContainer: {
		position: 'relative',
		width: 100,
		height: 100,
	},
	imagePreview: {
		width: '100%',
		height: '100%',
		borderRadius: roundness.sm,
	},
	removeImageButton: {
		position: 'absolute',
		top: -8,
		right: -8,
		backgroundColor: theme.colors.error,
		borderRadius: roundness.full,
		width: 24,
		height: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addImageButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		padding: spacing.md,
		borderRadius: roundness.sm,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		borderStyle: 'dashed',
		backgroundColor: theme.colors.surface,
	},
	addImageText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.primary,
		fontWeight: '500',
	},
	imageOptionsContent: {
		gap: spacing.sm,
	},
	imageOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
		gap: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: theme.colors.background,
	},
	imageOptionText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		fontWeight: '500',
	},
	locationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	locationToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: roundness.xs,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: theme.colors.primary,
		borderColor: theme.colors.primary,
	},
	checkmark: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	checkboxLabel: {
		fontSize: typography.bodyLarge,
		color: theme.colors.onSurface,
		fontWeight: '500',
	},
	locationContainer: {
		gap: spacing.md,
	},
	locationLoadingContainer: {
		padding: spacing.xl,
		alignItems: 'center',
		gap: spacing.md,
		backgroundColor: theme.colors.surface,
		borderRadius: roundness.sm,
	},
	locationLoadingText: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
	},
	mapContainer: {
		borderRadius: roundness.sm,
		overflow: 'hidden',
	},
	addressCard: {
		marginTop: spacing.sm,
	},
	addressRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: spacing.sm,
	},
	addressText: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurface,
		lineHeight: 20,
	},
	requestLocationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		padding: spacing.lg,
		borderRadius: roundness.sm,
		backgroundColor: theme.colors.surface,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		borderStyle: 'dashed',
	},
	requestLocationText: {
		fontSize: typography.bodyLarge,
		color: theme.colors.primary,
		fontWeight: '500',
	},
	submitButton: {
		backgroundColor: theme.colors.primary,
		borderRadius: roundness.sm,
		padding: spacing.md,
		alignItems: 'center',
		marginTop: spacing.lg,
	},
	submitButtonDisabled: {
		opacity: 0.6,
	},
	submitButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.onPrimary,
	},
	bottomSpacer: {
		height: spacing.xl,
	},
});