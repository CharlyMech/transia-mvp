import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@transia_onboarding_completed";

export const OnboardingStorage = {
	/**
	 * Check if user has completed onboarding
	 */
	async hasCompletedOnboarding(): Promise<boolean> {
		try {
			const value = await AsyncStorage.getItem(ONBOARDING_KEY);
			return value === "true";
		} catch (error) {
			console.error("Error checking onboarding status:", error);
			return false;
		}
	},

	/**
	 * Mark onboarding as completed
	 */
	async setOnboardingCompleted(): Promise<void> {
		try {
			await AsyncStorage.setItem(ONBOARDING_KEY, "true");
			console.log("✅ Onboarding marked as completed");
		} catch (error) {
			console.error("Error setting onboarding status:", error);
			throw error;
		}
	},

	/**
	 * Reset onboarding status (for testing)
	 */
	async resetOnboarding(): Promise<void> {
		try {
			await AsyncStorage.removeItem(ONBOARDING_KEY);
			console.log("✅ Onboarding status reset");
		} catch (error) {
			console.error("Error resetting onboarding status:", error);
			throw error;
		}
	},
};
