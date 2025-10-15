import { lightTheme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Settings screen</Text>
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


// import { lightTheme } from '@/constants/theme';
// import React from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function SettingsScreen() {
// 	return (
// 		<ScrollView
// 			style={styles.container}
// 			contentContainerStyle={styles.contentContainer}
// 		>
// 			<View style={styles.section}>
// 				<Text style={styles.sectionTitle}>General</Text>

// 				<TouchableOpacity style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Perfil</Text>
// 					<Text style={styles.settingValue}>›</Text>
// 				</TouchableOpacity>

// 				<TouchableOpacity style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Notificaciones</Text>
// 					<Text style={styles.settingValue}>›</Text>
// 				</TouchableOpacity>

// 				<TouchableOpacity style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Idioma</Text>
// 					<Text style={styles.settingValue}>Español ›</Text>
// 				</TouchableOpacity>
// 			</View>

// 			<View style={styles.section}>
// 				<Text style={styles.sectionTitle}>Datos</Text>

// 				<TouchableOpacity style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Sincronización</Text>
// 					<Text style={styles.settingValue}>›</Text>
// 				</TouchableOpacity>

// 				<TouchableOpacity style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Modo de Operación</Text>
// 					<Text style={styles.settingValue}>Test ›</Text>
// 				</TouchableOpacity>
// 			</View>

// 			<View style={styles.section}>
// 				<Text style={styles.sectionTitle}>Acerca de</Text>

// 				<View style={styles.settingItem}>
// 					<Text style={styles.settingLabel}>Versión</Text>
// 					<Text style={styles.settingValue}>1.0.0</Text>
// 				</View>
// 			</View>
// 		</ScrollView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: lightTheme.colors.background,
// 	},
// 	contentContainer: {
// 		padding: 16,
// 	},
// 	section: {
// 		marginBottom: 32,
// 	},
// 	sectionTitle: {
// 		fontSize: 14,
// 		fontWeight: '600',
// 		color: lightTheme.colors.onSurfaceVariant,
// 		textTransform: 'uppercase',
// 		marginBottom: 12,
// 		paddingHorizontal: 4,
// 	},
// 	settingItem: {
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 		backgroundColor: lightTheme.colors.surface,
// 		padding: 16,
// 		borderRadius: 12,
// 		marginBottom: 8,
// 		shadowColor: '#000',
// 		shadowOffset: { width: 0, height: 1 },
// 		shadowOpacity: 0.05,
// 		shadowRadius: 2,
// 		elevation: 2,
// 	},
// 	settingLabel: {
// 		fontSize: 16,
// 		color: lightTheme.colors.onSurface,
// 	},
// 	settingValue: {
// 		fontSize: 16,
// 		color: lightTheme.colors.onSurfaceVariant,
// 	},
// });