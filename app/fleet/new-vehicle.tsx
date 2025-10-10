import { lightTheme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function NewReportScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Nuevo vehículo</Text>
		</View>
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