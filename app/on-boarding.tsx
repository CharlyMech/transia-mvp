import { ElevatedButton } from '@/components/ElevatedButton';
import { roundness, spacing, typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { OnboardingStorage } from '@/utils/onBoardingStorage';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
	id: number;
	title: string;
	description: string;
	image: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
	{
		id: 1,
		title: 'Bienvenido a Transia',
		description: 'La solución completa para la gestión de flotas de vehículos. Controla tu jornada laboral, reporta incidencias y mantente conectado con tu equipo.',
		image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
	},
	{
		id: 2,
		title: 'Registro horario simplificado',
		description: 'Inicia, pausa y finaliza tu jornada con un solo toque. Visualiza tus horas trabajadas, consulta tu historial y añade notas importantes de cada día.',
		image: 'https://images.unsplash.com/photo-1563103311-860aee557af8?q=80&w=800',
	},
	{
		id: 3,
		title: 'Reporta incidencias al instante',
		description: 'Informa sobre problemas mecánicos, accidentes o cualquier incidencia. Adjunta fotos y ubicación para una comunicación clara y eficiente.',
		image: 'https://images.unsplash.com/photo-1675615833193-acf1b0dc75b9?q=80&w=800',
	},
	{
		id: 4,
		title: '¡Todo listo!',
		description: 'Estás preparado para comenzar. Inicia sesión con tus credenciales y empieza a gestionar tu jornada laboral de forma profesional.',
		image: 'https://images.unsplash.com/photo-1688619101934-a3f3e42906d4?q=80&w=800',
	},
];

export default function OnboardingScreen() {
	const [currentStep, setCurrentStep] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);
	const isScrollingProgrammatically = useRef(false);
	const insets = useSafeAreaInsets();
	const { theme, isDark } = useAppTheme();
	const styles = useMemo(() => getStyles(theme), [theme]);

	const handleNext = () => {
		if (currentStep < ONBOARDING_STEPS.length - 1) {
			const nextStep = currentStep + 1;
			isScrollingProgrammatically.current = true;
			setCurrentStep(nextStep);
			scrollViewRef.current?.scrollTo({
				x: nextStep * SCREEN_WIDTH,
				animated: true,
			});
			// Reset flag after animation completes
			setTimeout(() => {
				isScrollingProgrammatically.current = false;
			}, 400);
		}
	};

	const handleSkip = () => {
		const lastStep = ONBOARDING_STEPS.length - 1;
		isScrollingProgrammatically.current = true;
		setCurrentStep(lastStep);
		scrollViewRef.current?.scrollTo({
			x: lastStep * SCREEN_WIDTH,
			animated: true,
		});
		// Reset flag after animation completes
		setTimeout(() => {
			isScrollingProgrammatically.current = false;
		}, 400);
	};

	const handleGetStarted = async () => {
		try {
			await OnboardingStorage.setOnboardingCompleted();
			router.replace('/login' as any);
		} catch (error) {
			console.error('Error completing onboarding:', error);
		}
	};

	const handleScroll = (event: any) => {
		// Don't update state during programmatic scrolling to avoid flickering
		if (isScrollingProgrammatically.current) {
			return;
		}

		const offsetX = event.nativeEvent.contentOffset.x;
		const page = Math.round(offsetX / SCREEN_WIDTH);
		if (page !== currentStep && page >= 0 && page < ONBOARDING_STEPS.length) {
			setCurrentStep(page);
		}
	};

	const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle={isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
				translucent={false}
			/>

			{!isLastStep && (
				<ElevatedButton
					label="Saltar"
					onPress={handleSkip}
					fontSize={typography.bodyLarge}
					paddingX={spacing.xl}
					paddingY={spacing.md}
					rounded={roundness.sm}
					shadow="medium"
					style={[styles.skipButton, { top: insets.top + spacing.md }]}
				/>
			)}

			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={32}
				onScroll={handleScroll}
				onMomentumScrollEnd={handleScroll}
				style={styles.scrollView}
			>
				{ONBOARDING_STEPS.map((step) => (
					<View key={step.id} style={styles.stepContainer}>
						<View style={styles.imageContainer}>
							<Image
								source={{ uri: step.image }}
								style={styles.image}
								resizeMode="cover"
							/>
							<View style={styles.imageOverlay} />
						</View>

						<View style={styles.contentContainer}>
							<View style={styles.textContent}>
								<Text style={styles.stepTitle}>{step.title}</Text>
								<Text style={styles.stepDescription}>{step.description}</Text>
							</View>
						</View>
					</View>
				))}
			</ScrollView>

			<View style={styles.bottomSection}>
				<View style={styles.paginationContainer}>
					{ONBOARDING_STEPS.map((_, index) => (
						<Pressable
							key={index}
							style={[
								styles.dot,
								currentStep === index && styles.activeDot,
							]}
							onPress={() => {
								isScrollingProgrammatically.current = true;
								setCurrentStep(index);
								scrollViewRef.current?.scrollTo({
									x: index * SCREEN_WIDTH,
									animated: true,
								});
								// Reset flag after animation completes
								setTimeout(() => {
									isScrollingProgrammatically.current = false;
								}, 400);
							}}
						/>
					))}
				</View>

				<View style={styles.buttonContainer}>
					{isLastStep ? (
						<ElevatedButton
							backgroundColor={theme.colors.primary}
							label="Empezar a usar la aplicación"
							fontSize={typography.bodyLarge}
							paddingX={spacing.xl}
							paddingY={spacing.md}
							rounded={roundness.sm}
							shadow="medium"
							onPress={handleGetStarted}
							style={styles.button}
						/>
					) : (
						<ElevatedButton
							backgroundColor={theme.colors.primary}
							label="Siguiente"
							icon={ArrowRight}
							iconSize={20}
							iconPosition="right"
							iconColor={theme.colors.onPrimary}
							fontSize={typography.bodyLarge}
							paddingX={spacing.xl}
							paddingY={spacing.md}
							rounded={roundness.sm}
							shadow="medium"
							onPress={handleNext}
							style={styles.button}
						/>
					)}
				</View>
			</View>
		</View>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	skipButton: {
		position: 'absolute',
		top: spacing.md,
		right: spacing.lg,
		zIndex: 10,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	skipText: {
		fontSize: typography.bodyLarge,
		fontWeight: '600',
		color: theme.colors.primary,
	},
	scrollView: {
		flex: 1,
	},
	stepContainer: {
		width: SCREEN_WIDTH,
		flex: 1,
	},
	imageContainer: {
		height: '50%',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	imageOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.xl,
	},
	textContent: {
		gap: spacing.lg,
	},
	stepTitle: {
		fontSize: typography.displaySmall,
		fontWeight: '700',
		color: theme.colors.onBackground,
		textAlign: 'center',
	},
	stepDescription: {
		fontSize: typography.bodyLarge,
		lineHeight: 28,
		color: theme.colors.onSurfaceVariant,
		textAlign: 'center',
	},
	bottomSection: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.lg,
	},
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: roundness.full,
		backgroundColor: theme.colors.outline,
	},
	activeDot: {
		width: 24,
		backgroundColor: theme.colors.primary,
	},
	buttonContainer: {
		width: '100%',
	},
	button: {
		width: '100%',
	},
});