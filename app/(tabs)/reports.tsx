import AnimatedTabTransition from '@/components/AnimatedTabTransition';
import { lightTheme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
	return (
		<AnimatedTabTransition>
			<View style={styles.container}>
				<Text style={styles.text}>Reports screen</Text>
			</View>
		</AnimatedTabTransition>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: lightTheme.colors.onBackground,
	},
});
