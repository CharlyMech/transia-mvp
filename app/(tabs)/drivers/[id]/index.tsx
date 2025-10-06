import { lightTheme } from '@/constants/theme';
import React, { useRef } from 'react';
import {
	Animated,
	Dimensions,
	Image,
	StatusBar,
	StyleSheet,
	View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const SCROLL_DISTANCE = 250; // Complete animation distance

export default function DriverProfileScreen() {
	const scrollY = useRef(new Animated.Value(0)).current;

	// Animation for header height - completely disappears
	const headerHeight = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE],
		outputRange: [HEADER_HEIGHT, 0],
		extrapolate: 'clamp',
	});

	// Animation for image scale - completely disappears
	const imageScale = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.7, SCROLL_DISTANCE],
		outputRange: [1, 0.3, 0],
		extrapolate: 'clamp',
	});

	// Animation for header opacity - completely disappears
	const headerOpacity = scrollY.interpolate({
		inputRange: [0, SCROLL_DISTANCE * 0.8, SCROLL_DISTANCE],
		outputRange: [1, 0.3, 0],
		extrapolate: 'clamp',
	});

	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={lightTheme.colors.surface}
				translucent={false}
			/>

			{/* Animated header */}
			<Animated.View
				style={[
					styles.header,
					{
						height: headerHeight,
						opacity: headerOpacity,
						backgroundColor: lightTheme.colors.surface,
					}
				]}
			>
				{/* Driver image */}
				<Animated.View
					style={[
						styles.imageContainer,
						{
							transform: [{ scale: imageScale }],
							opacity: headerOpacity
						}
					]}
				>
					<Image
						source={{
							uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
						}}
						style={styles.driverImage}
					/>
				</Animated.View>
			</Animated.View>

			{/* Scrollable content */}
			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
				bounces={false}
			>
				{/* Spacer for header */}
				<View style={styles.headerSpacer} />

				{/* Main content */}
				<View style={styles.content}>
					{/* Content goes here */}
					<View style={styles.contentPlaceholder}>
						{/* Add your content here */}
					</View>
				</View>
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: StatusBar.currentHeight || 44,
	},
	imageContainer: {
		marginTop: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	driverImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 4,
		borderColor: 'white',
	},
	scrollView: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	headerSpacer: {
		height: HEADER_HEIGHT,
		backgroundColor: 'transparent',
	},
	content: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 20,
		paddingTop: 20,
		minHeight: SCREEN_HEIGHT,
	},
	contentPlaceholder: {
		flex: 1,
		backgroundColor: lightTheme.colors.background,
		minHeight: SCREEN_HEIGHT * 0.8,
	},
});