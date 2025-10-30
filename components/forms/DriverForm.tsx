import { ActionsModal } from '@/components/ActionsModal';
import { Card } from '@/components/Card';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { IOSDatePickerModal } from '@/components/IOSDatePickerModal';
import { DriverStatus } from '@/constants/enums/DriverStatus';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { useImagePicker } from '@/hooks/useImagePicker';
import type { DriverFormData } from '@/models/driver';
import { DriverFormSchema } from '@/models/driver';
import { formatDateToDisplay, formatDateToISO, parseDate } from '@/utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Camera, Image as ImageIcon, ImagePlus } from 'lucide-react-native';
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

type DriverFormProps = {
	initialData?: Partial<DriverFormData> & { imageUrl?: string | null };
	onSubmit: (data: DriverFormData & { imageUrl?: string | null }) => void;
	onFormChange?: (hasChanges: boolean) => void;
	submitLabel?: string;
	loading?: boolean;
};

type FormDataWithImage = DriverFormData & { imageUrl?: string | null };

export function DriverForm({
	initialData,
	onSubmit,
	onFormChange,
	submitLabel = 'Guardar',
	loading = false
}: DriverFormProps) {
	const { pickImage, takePhoto, loading: imageLoading } = useImagePicker();

	const initialFormData: FormDataWithImage = {
		name: initialData?.name || '',
		surnames: initialData?.surnames || '',
		personId: initialData?.personId || '',
		completeAddress: initialData?.completeAddress || '',
		birthDate: initialData?.birthDate || '',
		phone: initialData?.phone || '',
		email: initialData?.email || '',
		licenseNumber: initialData?.licenseNumber || '',
		status: initialData?.status || DriverStatus.ACTIVE,
		imageUrl: initialData?.imageUrl || null,
	};

	const [formData, setFormData] = useState<FormDataWithImage>(initialFormData);
	const [errors, setErrors] = useState<Partial<Record<keyof DriverFormData, string>>>({});
	const [showImageOptions, setShowImageOptions] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [tempDate, setTempDate] = useState<Date>(parseDate(initialData?.birthDate));

	// Check if form has changes
	const checkForChanges = (newData: FormDataWithImage) => {
		const hasChanges = (Object.keys(newData) as (keyof FormDataWithImage)[]).some(key => {
			return newData[key] !== initialFormData[key];
		});
		onFormChange?.(hasChanges);
	};

	const handleChange = (field: keyof DriverFormData, value: string) => {
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

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === 'android') {
			setShowDatePicker(false);
			if (selectedDate && event.type === 'set') {
				const dateString = formatDateToISO(selectedDate);
				const newData = { ...formData, birthDate: dateString };
				setFormData(newData);
				checkForChanges(newData);

				if (errors.birthDate) {
					setErrors(prev => {
						const newErrors = { ...prev };
						delete newErrors.birthDate;
						return newErrors;
					});
				}
			}
		} else {
			if (selectedDate) {
				setTempDate(selectedDate);
			}
		}
	};

	const handleIOSDateConfirm = () => {
		const dateString = formatDateToISO(tempDate);
		const newData = { ...formData, birthDate: dateString };
		setFormData(newData);
		checkForChanges(newData);
		setShowDatePicker(false);

		if (errors.birthDate) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.birthDate;
				return newErrors;
			});
		}
	};

	const handleIOSDateCancel = () => {
		setShowDatePicker(false);
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

	const handleSubmit = () => {
		try {
			const { imageUrl, ...dataToValidate } = formData;
			const validatedData = DriverFormSchema.parse(dataToValidate);
			setErrors({});
			onSubmit({ ...validatedData, imageUrl: formData.imageUrl });
		} catch (error) {
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as any;
				const newErrors: Partial<Record<keyof DriverFormData, string>> = {};
				zodError.errors?.forEach((err: any) => {
					const field = err.path[0] as keyof DriverFormData;
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
							style={styles.driverImage}
						/>
					) : (
						<Card
							paddingX={0}
							paddingY={0}
							rounded={roundness.sm}
							shadow='none'
							backgroundColor={`${lightTheme.colors.primary}CC`}
							style={styles.driverImage}
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

			{/* Información Personal */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Información Personal</Text>

				{/* Nombre */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Nombre *</Text>
					<TextInput
						style={[styles.input, errors.name && styles.inputError]}
						value={formData.name}
						onChangeText={(value) => handleChange('name', value)}
						placeholder="Ej: Juan"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="words"
					/>
					{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
				</View>

				{/* Apellidos */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Apellidos *</Text>
					<TextInput
						style={[styles.input, errors.surnames && styles.inputError]}
						value={formData.surnames}
						onChangeText={(value) => handleChange('surnames', value)}
						placeholder="Ej: García López"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="words"
					/>
					{errors.surnames && <Text style={styles.errorText}>{errors.surnames}</Text>}
				</View>

				{/* DNI/NIE */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>DNI/NIE *</Text>
					<TextInput
						style={[styles.input, errors.personId && styles.inputError]}
						value={formData.personId}
						onChangeText={(value) => handleChange('personId', value)}
						placeholder="Ej: 12345678A"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="characters"
						maxLength={9}
					/>
					{errors.personId && <Text style={styles.errorText}>{errors.personId}</Text>}
				</View>

				{/* Fecha de Nacimiento */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Fecha de nacimiento *</Text>
					<TouchableOpacity
						style={[styles.input, styles.dateInput, errors.birthDate && styles.inputError]}
						onPress={() => {
							setTempDate(parseDate(formData.birthDate));
							setShowDatePicker(true);
						}}
					>
						<Text style={[
							styles.dateText,
							!formData.birthDate && styles.placeholderText
						]}>
							{formData.birthDate
								? formatDateToDisplay(formData.birthDate)
								: 'Selecciona una fecha'}
						</Text>
						<Calendar size={20} color={lightTheme.colors.onSurfaceVariant} />
					</TouchableOpacity>
					{errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
				</View>
			</View>

			{/* Date Picker Modal for iOS */}
			{Platform.OS === 'ios' && (
				<IOSDatePickerModal
					visible={showDatePicker}
					value={tempDate}
					onChange={handleDateChange}
					onConfirm={handleIOSDateConfirm}
					onCancel={handleIOSDateCancel}
					minimumDate={new Date(1900, 0, 1)}
					maximumDate={new Date()}
					title="Seleccionar Fecha"
				/>
			)}

			{/* Date Picker for Android */}
			{Platform.OS === 'android' && showDatePicker && (
				<DateTimePicker
					value={parseDate(formData.birthDate)}
					mode="date"
					locale="es-ES" // force Spanish
					display="default"
					onChange={handleDateChange}
					maximumDate={new Date()}
					minimumDate={new Date(1900, 0, 1)}
				/>
			)}

			{/* Información de Contacto */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Información de Contacto</Text>

				{/* Teléfono */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Teléfono</Text>
					<TextInput
						style={[styles.input, errors.phone && styles.inputError]}
						value={formData.phone}
						onChangeText={(value) => handleChange('phone', value)}
						placeholder="Ej: 612345678"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						keyboardType="phone-pad"
						maxLength={9}
					/>
					{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
				</View>

				{/* Email */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={[styles.input, errors.email && styles.inputError]}
						value={formData.email}
						onChangeText={(value) => handleChange('email', value)}
						placeholder="Ej: conductor@ejemplo.com"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
				</View>

				{/* Dirección */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Dirección *</Text>
					<TextInput
						style={[styles.input, errors.completeAddress && styles.inputError]}
						value={formData.completeAddress}
						onChangeText={(value) => handleChange('completeAddress', value)}
						placeholder="Ej: Calle Principal 123"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="words"
					/>
					{errors.completeAddress && <Text style={styles.errorText}>{errors.completeAddress}</Text>}
				</View>
			</View>

			{/* Información Profesional */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Información Profesional</Text>

				{/* Número de Licencia */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Número de licencia</Text>
					<TextInput
						style={[styles.input, errors.licenseNumber && styles.inputError]}
						value={formData.licenseNumber}
						onChangeText={(value) => handleChange('licenseNumber', value)}
						placeholder="Ej: 12345678AB"
						placeholderTextColor={lightTheme.colors.onSurfaceVariant}
						autoCapitalize="characters"
					/>
					{errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
				</View>
			</View>
			{/* Submit Button */}
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
	driverImage: {
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
	imageOptionDivider: {
		height: 1,
		backgroundColor: lightTheme.colors.outline,
		opacity: 0.3,
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