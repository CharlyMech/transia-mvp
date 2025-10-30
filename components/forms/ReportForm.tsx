import { ActionsModal } from '@/components/ActionsModal';
import { ReportsTypes } from '@/constants/enums/ReportsTypes';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useLocation } from '@/hooks/useLocation';
import type { Location, ReportFormData } from '@/models/report';
import { ReportFormSchema } from '@/models/report';
import { useAuthStore } from '@/stores/useAuthStore';
import { Camera, ChevronDown, Image as ImageIcon, MapPinOff, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import { LeafletMap } from '../LeafletMap';

type ReportFormProps = {
	initialData?: Partial<ReportFormData> & { images?: string[] };
	driverId: string; // ID del conductor que crea/edita el reporte
	vehicleInfo?: string; // Información del camión (ej: "Volvo FH16 - ABC123")
	driverName?: string; // Nombre del conductor para mostrar
	onSubmit: (data: ReportFormData & { images: string[] }) => void;
	onFormChange?: (hasChanges: boolean) => void;
	submitLabel?: string;
	loading?: boolean;
	isEditMode?: boolean; // Flag para indicar si estamos editando
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
	const { user } = useAuthStore();


	const { pickImage, takePhoto, loading: imageLoading } = useImagePicker();
	const { location: currentLocation, loading: locationLoading, requestLocation } = useLocation();

	const initialFormData: FormDataWithImages = {
		title: initialData?.title || ReportsTypes.OTHER,
		description: initialData?.description || '',
		vehicleId: initialData?.vehicleId || '',
		driverId: driverId,
		reporterComment: initialData?.reporterComment || '',
		images: initialData?.images || [],
		location: initialData?.location || null,
	};

	const [formData, setFormData] = useState<FormDataWithImages>(initialFormData);
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
	const checkForChanges = (newData: FormDataWithImages) => {
		const hasChanges = (Object.keys(newData) as (keyof FormDataWithImages)[]).some(key => {
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

	const handleSubmit = () => {
		try {
			const dataToValidate = {
				...formData,
				location: includeLocation ? formData.location : null,
			};
			const validatedData = ReportFormSchema.parse(dataToValidate);
			setErrors({});
			onSubmit({ ...validatedData, images: formData.images });
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
				<Text style={styles.sectionTitle}>Tipo de Reporte</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Tipo *</Text>
					<TouchableOpacity
						style={[styles.input, styles.dateInput, errors.title && styles.inputError]}
						onPress={() => setShowReportTypePicker(true)}
					>
						<Text style={styles.dateText}>
							{formData.title}
						</Text>
						<ChevronDown size={20} color={lightTheme.colors.onSurfaceVariant} />
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
				<ScrollView style={styles.reportTypePickerContent}>
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
				</ScrollView>
			</ActionsModal>

			{isEditMode && (driverName || vehicleInfo) && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Información del Reporte</Text>

					<View style={styles.infoDisplayContainer}>
						{driverName && (
							<View style={styles.infoRow}>
								<User size={20} color={lightTheme.colors.primary} />
								<View style={styles.infoContent}>
									<Text style={styles.infoLabel}>Conductor</Text>
									<Text style={styles.infoValue}>{driverName}</Text>
								</View>
							</View>
						)}

						{vehicleInfo && (
							<View style={styles.infoRow}>
								<Text style={styles.truckIcon}>🚛</Text>
								<View style={styles.infoContent}>
									<Text style={styles.infoLabel}>Vehículo</Text>
									<Text style={styles.infoValue}>{vehicleInfo}</Text>
								</View>
							</View>
						)}
					</View>
				</View>
			)}

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Descripción</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Descripción *</Text>
					<TextInput
						style={[styles.textArea, errors.description && styles.inputError]}
						value={formData.description}
						onChangeText={(value) => handleChange('description', value)}
						placeholder="Describe la incidencia con el mayor detalle posible..."
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						multiline
						numberOfLines={6}
						textAlignVertical="top"
					/>
					{errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
				</View>

				{user?.role === 'admin' && (
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Respuesta de la incidencia</Text>
						<TextInput
							style={[styles.textArea, errors.reporterComment && styles.inputError]}
							value={formData.reporterComment}
							onChangeText={(value) => handleChange('reporterComment', value)}
							placeholder="Añade cualquier comentario adicional..."
							placeholderTextColor={lightTheme.colors.onSurfaceVariant}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
						{errors.reporterComment && <Text style={styles.errorText}>{errors.reporterComment}</Text>}
					</View>
				)}
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
									<X size={16} color={lightTheme.colors.onPrimary} />
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
						<ActivityIndicator color={lightTheme.colors.primary} />
					) : (
						<>
							<Camera size={24} color={lightTheme.colors.primary} />
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
						<Camera size={24} color={lightTheme.colors.onSurface} />
						<Text style={styles.imageOptionText}>Tomar foto</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.imageOption}
						onPress={() => handleImageSelect('gallery')}
					>
						<ImageIcon size={24} color={lightTheme.colors.onSurface} />
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
								<ActivityIndicator size="large" color={lightTheme.colors.primary} />
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
								<MapPinOff size={24} color={lightTheme.colors.primary} />
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
					<ActivityIndicator color={lightTheme.colors.onPrimary} />
				) : (
					<Text style={styles.submitButtonText}>{submitLabel}</Text>
				)}
			</TouchableOpacity>

			<View style={styles.bottomSpacer} />
		</View>
	);
}

const styles = StyleSheet.create({
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
		color: lightTheme.colors.onBackground,
		marginBottom: spacing.md,
	},
	inputContainer: {
		marginBottom: spacing.md,
	},
	label: {
		fontSize: typography.bodyMedium,
		fontWeight: '500',
		color: lightTheme.colors.onSurface,
		marginBottom: spacing.xs,
	},
	input: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	inputError: {
		borderColor: lightTheme.colors.error,
	},
	textArea: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
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
		color: lightTheme.colors.onSurface,
	},
	placeholderText: {
		color: lightTheme.colors.onSurfaceVariant,
	},
	errorText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.error,
		marginTop: spacing.xs,
	},
	reportTypePickerContent: {
		maxHeight: 300,
	},
	reportTypeOption: {
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.background,
		marginBottom: spacing.xs,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
	},
	reportTypeOptionActive: {
		backgroundColor: lightTheme.colors.primaryContainer,
		borderColor: lightTheme.colors.primary,
	},
	reportTypeOptionText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	reportTypeOptionTextActive: {
		color: lightTheme.colors.onPrimaryContainer,
		fontWeight: '600',
	},
	infoDisplayContainer: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
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
		color: lightTheme.colors.onSurfaceVariant,
		marginBottom: spacing.xs / 2,
	},
	infoValue: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onSurface,
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
		backgroundColor: lightTheme.colors.error,
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
		borderColor: lightTheme.colors.primary,
		borderStyle: 'dashed',
		backgroundColor: lightTheme.colors.surface,
	},
	addImageText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.primary,
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
		backgroundColor: lightTheme.colors.background,
	},
	imageOptionText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
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
		borderColor: lightTheme.colors.primary,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkboxChecked: {
		backgroundColor: lightTheme.colors.primary,
		borderColor: lightTheme.colors.primary,
	},
	checkmark: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	checkboxLabel: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	locationContainer: {
		gap: spacing.md,
	},
	locationLoadingContainer: {
		padding: spacing.xl,
		alignItems: 'center',
		gap: spacing.md,
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
	},
	locationLoadingText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurfaceVariant,
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
		color: lightTheme.colors.onSurface,
		lineHeight: 20,
	},
	requestLocationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		padding: spacing.lg,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.surface,
		borderWidth: 2,
		borderColor: lightTheme.colors.primary,
		borderStyle: 'dashed',
	},
	requestLocationText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.primary,
		fontWeight: '500',
	},
	submitButton: {
		backgroundColor: lightTheme.colors.primary,
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
		color: lightTheme.colors.onPrimary,
	},
	bottomSpacer: {
		height: spacing.xl,
	},
});