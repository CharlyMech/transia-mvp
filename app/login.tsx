import { Card } from '@/components/Card';
import { DebugPanel } from '@/components/DebugPanel';
import { lightTheme, roundness, spacing, typography } from '@/constants/theme';
import { LoginCredentialsSchema } from '@/models/auth';
import { DEBUG_PANEL_ENABLED } from '@/services/env';
import { useAuthStore } from '@/stores/useAuthStore';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
	const [hasScrolledToForm, setHasScrolledToForm] = useState(false);

	const scrollViewRef = useRef<ScrollView>(null);
	const identifierInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const login = useAuthStore((state) => state.login);
	const isLoading = useAuthStore((state) => state.isLoading);
	const error = useAuthStore((state) => state.error);
	const clearError = useAuthStore((state) => state.clearError);

	// Clear error when user starts typing
	useEffect(() => {
		if (error) {
			clearError();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [identifier, password]);

	// Reset scroll flag when keyboard is dismissed
	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setHasScrolledToForm(false);
			}
		);

		return () => {
			keyboardDidHideListener.remove();
		};
	}, []);

	const handleInputFocus = (inputY: number, isFirstInput: boolean) => {
		setTimeout(() => {
			if (Platform.OS === 'android') {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			} else {
				if (isFirstInput && !hasScrolledToForm) {
					const formAreaOffset = inputY - 250;
					scrollViewRef.current?.scrollTo({
						y: Math.max(0, formAreaOffset),
						animated: true,
					});
					setHasScrolledToForm(true);
				} else if (!isFirstInput && hasScrolledToForm) {
					const formAreaOffset = inputY - 100;
					scrollViewRef.current?.scrollTo({
						y: Math.max(0, formAreaOffset),
						animated: true,
					});
				}
			}
		}, Platform.OS === 'android' ? 300 : 150);
	};

	const handleLogin = async () => {
		// Dismiss keyboard
		Keyboard.dismiss();

		// Clear previous errors
		setErrors({});
		clearError();

		// Validate inputs
		const validation = LoginCredentialsSchema.safeParse({
			identifier,
			password,
		});

		if (!validation.success) {
			const newErrors: { identifier?: string; password?: string } = {};
			validation.error.errors.forEach((err) => {
				const field = err.path[0] as 'identifier' | 'password';
				newErrors[field] = err.message;
			});
			setErrors(newErrors);
			return;
		}

		try {
			await login(validation.data);
			// Navigation will be handled by _layout.tsx
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={0}
			>
				<TouchableWithoutFeedback onPress={dismissKeyboard}>
					<ScrollView
						ref={scrollViewRef}
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>

						{DEBUG_PANEL_ENABLED && (
							<DebugPanel
								onOperationComplete={(operation) => {
									console.log(`✅ Operation completed: ${operation}`);
								}}
							/>
						)}

						<View style={styles.header}>
							<Image
								source={require('@/assets/images/splash-icon.png')}
								style={styles.logo}
								resizeMode="contain"
							/>
							<View style={styles.headerTextContainer}>
								<Text style={styles.title}>Transia</Text>
								<Text style={styles.subtitle}>Gestión de flota de vehículos a tu alcance</Text>
							</View>
						</View>

						<View style={styles.formSection}>
							<Text style={styles.welcomeText}>Bienvenido de nuevo</Text>

							{error && (
								<Card
									paddingX={spacing.md}
									paddingY={spacing.md}
									rounded={roundness.sm}
									shadow="none"
									backgroundColor={lightTheme.colors.errorContainer}
									style={styles.errorCard}
								>
									<View style={styles.errorContent}>
										<AlertTriangle
											size={20}
											color={lightTheme.colors.error}
										/>
										<Text style={styles.errorText}>{error}</Text>
									</View>
								</Card>
							)}

							<View
								style={styles.inputContainer}
								onLayout={(event) => {
									const layout = event.nativeEvent.layout;
									identifierInputRef.current?.setNativeProps({
										layoutY: layout.y,
									});
								}}
							>
								<Text style={styles.label}>Teléfono o Email</Text>
								<View style={styles.inputWrapper}>
									<TextInput
										ref={identifierInputRef}
										style={[
											styles.input,
											errors.identifier && styles.inputError,
										]}
										value={identifier}
										onChangeText={setIdentifier}
										placeholder="Ej: 612345678 o correo@ejemplo.com"
										placeholderTextColor={lightTheme.colors.onSurfaceVariant}
										autoCapitalize="none"
										autoCorrect={false}
										editable={!isLoading}
										returnKeyType="next"
										onSubmitEditing={() => passwordInputRef.current?.focus()}
										blurOnSubmit={false}
										onFocus={(e) => {
											e.target.measure((x, y, width, height, pageX, pageY) => {
												handleInputFocus(pageY, true);
											});
										}}
									/>
								</View>
								{errors.identifier && (
									<Text style={styles.fieldErrorText}>{errors.identifier}</Text>
								)}
							</View>

							<View
								style={styles.inputContainer}
								onLayout={(event) => {
									const layout = event.nativeEvent.layout;
									passwordInputRef.current?.setNativeProps({
										layoutY: layout.y,
									});
								}}
							>
								<Text style={styles.label}>Contraseña</Text>
								<View style={styles.inputWrapper}>
									<TextInput
										ref={passwordInputRef}
										style={[
											styles.input,
											errors.password && styles.inputError,
										]}
										value={password}
										onChangeText={setPassword}
										placeholder="Ingresa tu contraseña"
										placeholderTextColor={lightTheme.colors.onSurfaceVariant}
										secureTextEntry={!showPassword}
										autoCapitalize="none"
										autoCorrect={false}
										editable={!isLoading}
										returnKeyType="done"
										onSubmitEditing={handleLogin}
										onFocus={(e) => {
											e.target.measure((x, y, width, height, pageX, pageY) => {
												handleInputFocus(pageY, false);
											});
										}}
									/>
									<Pressable
										onPress={() => setShowPassword(!showPassword)}
										style={styles.eyeIcon}
										disabled={isLoading}
									>
										{showPassword ? (
											<EyeOff
												size={20}
												color={lightTheme.colors.onSurfaceVariant}
											/>
										) : (
											<Eye
												size={20}
												color={lightTheme.colors.onSurfaceVariant}
											/>
										)}
									</Pressable>
								</View>
								{errors.password && (
									<Text style={styles.fieldErrorText}>{errors.password}</Text>
								)}
							</View>

							<TouchableOpacity
								style={[
									styles.loginButton,
									isLoading && styles.loginButtonDisabled,
								]}
								onPress={handleLogin}
								disabled={isLoading}
								activeOpacity={0.8}
							>
								{isLoading ? (
									<ActivityIndicator
										size="small"
										color={lightTheme.colors.onPrimary}
									/>
								) : (
									<Text style={styles.loginButtonText}>Iniciar Sesión</Text>
								)}
							</TouchableOpacity>

							<View style={styles.helperContainer}>
								<Text style={styles.helperText}>
									¿Problemas para iniciar sesión?
								</Text>
								<Text style={styles.helperTextBold}>
									Contacta a tu administrador
								</Text>
							</View>
						</View>

						<View style={styles.footer}>
							<Text style={styles.footerText}>
								Transia (MVP)
							</Text>
							<Text style={styles.footerTextSmall}>
								© 2025 Todos los derechos reservados
							</Text>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>

			{isLoading && (
				<View style={styles.loadingOverlay}>
					<View style={styles.loadingContent}>
						<ActivityIndicator
							size="large"
							color={lightTheme.colors.primary}
						/>
						<Text style={styles.loadingText}>Iniciando sesión...</Text>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.xl,
		paddingBottom: Platform.OS === 'android' ? spacing.xl * 4 : spacing.xl,
	},
	header: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.md,
		marginBottom: spacing.xxl,
	},
	logo: {
		width: '100%',
		height: 120,
		objectFit: 'contain',
	},
	headerTextContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: typography.displayMedium,
		fontWeight: '700',
		color: lightTheme.colors.primary,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		opacity: 0.8,
	},
	formSection: {
		flex: 1,
		marginBottom: spacing.xl,
	},
	welcomeText: {
		fontSize: typography.titleMedium,
		fontWeight: '600',
		color: lightTheme.colors.onBackground,
		marginBottom: spacing.lg,
	},
	errorCard: {
		marginBottom: spacing.md,
	},
	errorContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	errorText: {
		flex: 1,
		fontSize: typography.bodyMedium,
		color: lightTheme.colors.error,
		fontWeight: '500',
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
	inputWrapper: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		flex: 1,
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.md,
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	eyeIcon: {
		position: 'absolute',
		right: spacing.md,
		padding: spacing.xs,
	},
	inputError: {
		borderColor: lightTheme.colors.error,
	},
	fieldErrorText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.error,
		marginTop: spacing.xs,
	},
	loginButton: {
		backgroundColor: lightTheme.colors.primary,
		borderRadius: roundness.sm,
		padding: spacing.md,
		alignItems: 'center',
		marginTop: spacing.md,
		minHeight: 48,
		justifyContent: 'center',
	},
	loginButtonDisabled: {
		opacity: 0.6,
	},
	loginButtonText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: lightTheme.colors.onPrimary,
	},
	helperContainer: {
		alignItems: 'center',
		marginTop: spacing.lg,
		gap: spacing.xs,
	},
	helperText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	helperTextBold: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.primary,
		fontWeight: '600',
		textAlign: 'center',
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		alignItems: 'center',
		gap: spacing.xs,
		marginTop: 'auto',
		paddingTop: spacing.lg,
		paddingBottom: spacing.xl,
	},
	footerText: {
		fontSize: typography.bodySmall,
		color: lightTheme.colors.onSurfaceVariant,
		fontWeight: '500',
	},
	footerTextSmall: {
		fontSize: typography.labelSmall,
		color: lightTheme.colors.onSurfaceVariant,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: lightTheme.colors.backdrop,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	loadingContent: {
		backgroundColor: lightTheme.colors.surface,
		borderRadius: roundness.sm,
		padding: spacing.xl,
		alignItems: 'center',
		gap: spacing.md,
		minWidth: 200,
	},
	loadingText: {
		fontSize: typography.bodyLarge,
		color: lightTheme.colors.onSurface,
		fontWeight: '500',
	},
});