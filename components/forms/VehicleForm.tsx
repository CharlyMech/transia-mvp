import { ActionsModal } from '@/components/ActionsModal';
import { Card } from '@/components/Card';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { IOSDatePickerModal } from '@/components/IOSDatePickerModal';
import { VehicleStatus } from '@/constants/enums/VehicleStatus';
import { VehicleTypes } from '@/constants/enums/VehicleTypes';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useImagePicker } from '@/hooks/useImagePicker';
import type { VehicleFormData } from '@/models';
import { VehicleFormSchema } from '@/models';
import { formatDateToDisplay, formatDateToISO, parseDate } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Camera, ChevronDown, Image as ImageIcon, ImagePlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

type VehicleFormProps = {
	initialData?: Partial<VehicleFormData> & { imageUrl?: string | null };
	onSubmit: (data: VehicleFormData & { imageUrl?: string | null }) => void;
	onFormChange?: (hasChanges: boolean) => void;
	submitLabel?: string;
	loading?: boolean;
};

type FormDataWithImage = VehicleFormData & { imageUrl?: string | null };

export function VehicleForm({
	initialData,
	onSubmit,
	onFormChange,
	submitLabel = 'Guardar',
	loading = false
}: VehicleFormProps) {
	const { pickImage, takePhoto, loading: imageLoading } = useImagePicker();

	const initialFormData: FormDataWithImage = {
		vehicleBrand: initialData?.vehicleBrand || '',
		vehicleModel: initialData?.vehicleModel || '',
		vehicleType: initialData?.vehicleType || VehicleTypes.SMALL_VAN,
		year: initialData?.year || new Date().getFullYear(),
		plateNumber: initialData?.plateNumber || '',
		registrationDate: initialData?.registrationDate || '',
		purchaseDate: initialData?.purchaseDate || '',
		status: initialData?.status || VehicleStatus.ACTIVE,
		imageUrl: initialData?.imageUrl || null,
	};

	const [formData, setFormData] = useState<FormDataWithImage>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});
	const [showImageOptions, setShowImageOptions] = useState(false);
	const [showVehicleTypePicker, setShowVehicleTypePicker] = useState(false);
	const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
	const [tempPurchaseDate, setTempPurchaseDate] = useState<Date>(parseDate(initialData?.purchaseDate));

	// Check if form has changes
	const checkForChanges = (newData: FormDataWithImage) => {
		const hasChanges = (Object.keys(newData) as (keyof FormDataWithImage)[]).some(key => {
			return newData[key] !== initialFormData[key];
		});
		onFormChange?.(hasChanges);
	};

	const handleChange = (field: keyof VehicleFormData, value: string | number | VehicleTypes) => {
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

	const handlePurchaseDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === 'android') {
			setShowPurchaseDatePicker(false);
			if (selectedDate && event.type === 'set') {
				const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
				const dateString = formatDateToISO(localDate);
				const newData = { ...formData, purchaseDate: dateString };
				setFormData(newData);
				checkForChanges(newData);

				if (errors.purchaseDate) {
					setErrors(prev => {
						const newErrors = { ...prev };
						delete newErrors.purchaseDate;
						return newErrors;
					});
				}
			}
		} else {
			if (selectedDate) {
				setTempPurchaseDate(selectedDate);
			}
		}
	};

	const handleIOSPurchaseDateConfirm = () => {
		const localDate = new Date(tempPurchaseDate.getFullYear(), tempPurchaseDate.getMonth(), tempPurchaseDate.getDate());
		const dateString = formatDateToISO(localDate);
		const newData = { ...formData, purchaseDate: dateString };
		setFormData(newData);
		checkForChanges(newData);
		setShowPurchaseDatePicker(false);

		if (errors.purchaseDate) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.purchaseDate;
				return newErrors;
			});
		}
	};

	const handleImageSelect = async (type: 'camera' | 'gallery') => {
		setShowImageOptions(false);
		const uri = type === 'camera' ? await takePhoto() : await pickImage();
		if (uri) {
			const newData = { ...formData, imageUrl: uri };
			setFormData(newData);
			checkForChanges(newData);
		}
	};

	const handleVehicleTypeSelect = (type: VehicleTypes) => {
		handleChange('vehicleType', type);
		setShowVehicleTypePicker(false);
	};

	const handleSubmit = () => {
		try {
			// Prepare data with automatic registration date if not in edit mode
			const { imageUrl, ...dataToValidate } = formData;

			// If registrationDate is empty, set it to current date (for new vehicles)
			const dataWithRegistration = {
				...dataToValidate,
				registrationDate: dataToValidate.registrationDate || formatDateToISO(new Date()),
				year: Number(dataToValidate.year), // Ensure year is a number
			};

			const validatedData = VehicleFormSchema.parse(dataWithRegistration);
			setErrors({});
			onSubmit({ ...validatedData, imageUrl: formData.imageUrl });
		} catch (error) {
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as any;
				const newErrors: Partial<Record<keyof VehicleFormData, string>> = {};
				zodError.errors?.forEach((err: any) => {
					const field = err.path[0] as keyof VehicleFormData;
					newErrors[field] = err.message;
				});
				setErrors(newErrors);
			}
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageSection}>
				<Pressable
					onPress={() => setShowImageOptions(true)}
					disabled={imageLoading}
					style={{ alignItems: 'center', justifyContent: 'center' }}
				>
					{imageLoading ? (
						<View style={styles.imageContainer}>
							<ActivityIndicator size="large" color={lightTheme.colors.primary} />
						</View>
					) : formData.imageUrl ? (
						<Image
							source={{ uri: formData.imageUrl }}
							style={styles.vehicleImage}
						/>
					) : (
						<Card
							paddingX={0}
							paddingY={0}
							rounded={roundness.sm}
							shadow='none'
							backgroundColor={`${lightTheme.colors.primary}CC`}
							style={styles.vehicleImage}
						>
							<IconPlaceholder
								color={lightTheme.colors.onPrimary}
								icon={ImagePlus}
								size={150}
							/>
						</Card>
					)}
					<Text style={styles.imageHint}>Toca para cambiar foto</Text>
				</Pressable>
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

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Información del Vehículo</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Marca *</Text>
					<TextInput
						style={[styles.input, errors.vehicleBrand && styles.inputError]}
						value={formData.vehicleBrand}
						onChangeText={(value) => handleChange('vehicleBrand', value)}
						placeholder="Ej: Mercedes-Benz"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="words"
					/>
					{errors.vehicleBrand && <Text style={styles.errorText}>{errors.vehicleBrand}</Text>}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Modelo *</Text>
					<TextInput
						style={[styles.input, errors.vehicleModel && styles.inputError]}
						value={formData.vehicleModel}
						onChangeText={(value) => handleChange('vehicleModel', value)}
						placeholder="Ej: Actros 1845"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="words"
					/>
					{errors.vehicleModel && <Text style={styles.errorText}>{errors.vehicleModel}</Text>}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Tipo de vehículo *</Text>
					<TouchableOpacity
						style={[styles.input, styles.dateInput, errors.vehicleType && styles.inputError]}
						onPress={() => setShowVehicleTypePicker(true)}
					>
						<Text style={styles.dateText}>
							{formData.vehicleType}
						</Text>
						<ChevronDown size={20} color={lightTheme.colors.onSurfaceVariant} />
					</TouchableOpacity>
					{errors.vehicleType && <Text style={styles.errorText}>{errors.vehicleType}</Text>}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Año *</Text>
					<TextInput
						style={[styles.input, errors.year && styles.inputError]}
						value={formData.year.toString()}
						onChangeText={(value) => handleChange('year', value)}
						placeholder="Ej: 2020"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						keyboardType="numeric"
						maxLength={4}
					/>
					{errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Matrícula *</Text>
					<TextInput
						style={[styles.input, errors.plateNumber && styles.inputError]}
						value={formData.plateNumber}
						onChangeText={(value) => handleChange('plateNumber', value)}
						placeholder="Ej: 1234ABC"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="characters"
						maxLength={10}
					/>
					{errors.plateNumber && <Text style={styles.errorText}>{errors.plateNumber}</Text>}
				</View>
			</View>

			<ActionsModal
				visible={showVehicleTypePicker}
				onClose={() => setShowVehicleTypePicker(false)}
				title="Seleccionar tipo de vehículo"
				animationType="fade"
			>
				<View style={styles.vehicleTypePickerContent}>
					{Object.values(VehicleTypes).map((type) => (
						<TouchableOpacity
							key={type}
							style={[
								styles.vehicleTypeOption,
								formData.vehicleType === type && styles.vehicleTypeOptionActive
							]}
							onPress={() => handleVehicleTypeSelect(type)}
						>
							<Text style={[
								styles.vehicleTypeOptionText,
								formData.vehicleType === type && styles.vehicleTypeOptionTextActive
							]}>
								{type}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ActionsModal>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Fechas</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Fecha de compra</Text>
					<TouchableOpacity
						style={[styles.input, styles.dateInput, errors.purchaseDate && styles.inputError]}
						onPress={() => {
							setTempPurchaseDate(parseDate(formData.purchaseDate));
							setShowPurchaseDatePicker(true);
						}}
					>
						<Text style={[
							styles.dateText,
							!formData.purchaseDate && styles.placeholderText
						]}>
							{formData.purchaseDate
								? formatDateToDisplay(formData.purchaseDate)
								: 'Selecciona una fecha'}
						</Text>
						<Calendar size={20} color={lightTheme.colors.onSurfaceVariant} />
					</TouchableOpacity>
					{errors.purchaseDate && <Text style={styles.errorText}>{errors.purchaseDate}</Text>}
				</View>
			</View>


			{Platform.OS === 'ios' && (
				<IOSDatePickerModal
					visible={showPurchaseDatePicker}
					value={tempPurchaseDate}
					onChange={handlePurchaseDateChange}
					onConfirm={handleIOSPurchaseDateConfirm}
					onCancel={() => setShowPurchaseDatePicker(false)}
					minimumDate={new Date(1900, 0, 1)}
					maximumDate={new Date()}
					title="Fecha de Compra"
				/>
			)}

			{Platform.OS === 'android' && showPurchaseDatePicker && (
				<DateTimePicker
					value={parseDate(formData.purchaseDate)}
					mode="date"
					locale="es-ES"
					display="default"
					onChange={handlePurchaseDateChange}
					maximumDate={new Date()}
					minimumDate={new Date(1900, 0, 1)}
					accentColor={lightTheme.colors.primary}
					textColor={lightTheme.colors.onSurface}
				/>
			)}

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
		backgroundColor: lightTheme.colors.background,
	},
	content: {
		padding: spacing.md,
	},
	imageSection: {
		backgroundColor: lightTheme.colors.surface,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.xl,
		marginHorizontal: spacing.xxxl,
		padding: spacing.md,
		borderRadius: roundness.sm,
		borderWidth: 2,
		borderColor: lightTheme.colors.primary,
		borderStyle: 'dashed',
	},
	imageContainer: {
		width: 150,
		height: 150,
		borderRadius: roundness.sm,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: lightTheme.colors.surface,
	},
	vehicleImage: {
		width: 150,
		height: 150,
		borderRadius: roundness.sm,
	},
	imageHint: {
		marginTop: spacing.sm,
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
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
	vehicleTypePickerContent: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	vehicleTypeOption: {
		width: '100%',
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.background,
	},
	vehicleTypeOptionActive: {
		backgroundColor: lightTheme.colors.primaryContainer,
	},
	vehicleTypeOptionText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	vehicleTypeOptionTextActive: {
		fontWeight: '600',
	},
	yearPickerContent: {
		maxHeight: 300,
	},
	yearOption: {
		padding: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.background,
		marginBottom: spacing.xs,
		borderWidth: 1,
		borderColor: lightTheme.colors.outline,
	},
	yearOptionActive: {
		backgroundColor: lightTheme.colors.primaryContainer,
		borderColor: lightTheme.colors.primary,
	},
	yearOptionText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
		textAlign: 'center',
	},
	yearOptionTextActive: {
		color: lightTheme.colors.onPrimaryContainer,
		fontWeight: '600',
	},
	statusContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	statusOption: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderRadius: roundness.sm,
		backgroundColor: lightTheme.colors.surface,
		borderWidth: 2,
		borderColor: lightTheme.colors.outline,
	},
	statusOptionActive: {
		backgroundColor: lightTheme.colors.primaryContainer,
		borderColor: lightTheme.colors.primary,
	},
	statusOptionText: {
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
	statusOptionTextActive: {
		color: lightTheme.colors.onPrimaryContainer,
		fontWeight: '600',
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