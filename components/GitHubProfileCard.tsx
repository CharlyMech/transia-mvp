import { Card } from "@/components/Card";
import { roundness, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface GitHubProfile {
	login: string;
	name: string;
	avatar_url: string;
	bio: string;
	html_url: string;
	blog: string;
	public_repos: number;
	followers: number;
}

export default function GitHubProfileCard() {
	const { theme } = useAppTheme();
	const [profile, setProfile] = useState<GitHubProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const styles = useMemo(() => getStyles(theme), [theme]);

	useEffect(() => {
		fetchGitHubProfile();
	}, []);

	const fetchGitHubProfile = async () => {
		try {
			const response = await fetch("https://api.github.com/users/CharlyMech");
			if (!response.ok) throw new Error("Failed to fetch");

			const data = await response.json();
			setProfile(data);
		} catch (err) {
			setError(true);
			console.error("Error fetching GitHub profile:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleGitHubPress = () => {
		if (profile?.html_url) {
			Linking.openURL(profile.html_url);
		}
	};

	const handleWebPress = () => {
		if (profile?.blog) {
			Linking.openURL(profile.blog);
		}
	};

	if (loading) {
		return (
			<Card backgroundColor={theme.colors.surface} border borderColor={theme.colors.outlineVariant}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="small" color={theme.colors.primary} />
				</View>
			</Card>
		);
	}

	if (error || !profile) {
		return (
			<Card backgroundColor={theme.colors.errorContainer} border={false}>
				<Text style={styles.errorText}>No se pudo cargar el perfil de GitHub</Text>
			</Card>
		);
	}

	return (
		<Card backgroundColor={theme.colors.surface} border borderColor={theme.colors.outlineVariant}>
			<View style={styles.header}>
				<Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
				<View style={styles.headerInfo}>
					<Text style={styles.name}>{profile.name}</Text>
					<Text style={styles.username}>@{profile.login}</Text>
				</View>
			</View>

			{profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

			<View style={styles.stats}>
				<View style={styles.stat}>
					<Text style={styles.statValue}>{profile.public_repos}</Text>
					<Text style={styles.statLabel}>Repositorios</Text>
				</View>
				<View style={styles.stat}>
					<Text style={styles.statValue}>{profile.followers}</Text>
					<Text style={styles.statLabel}>Seguidores</Text>
				</View>
			</View>

			<View style={styles.links}>
				<TouchableOpacity onPress={handleGitHubPress} style={styles.linkButton}>
					<Ionicons name="logo-github" size={20} color={theme.colors.primary} />
					<Text style={styles.linkText}>Perfil de GitHub</Text>
				</TouchableOpacity>
				{profile.blog && (
					<TouchableOpacity onPress={handleWebPress} style={styles.linkButton}>
						<Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
						<Text style={styles.linkText}>Sitio web</Text>
					</TouchableOpacity>
				)}
			</View>
		</Card>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	loadingContainer: {
		paddingVertical: spacing.lg,
		alignItems: "center",
	},
	errorText: {
		color: theme.colors.onErrorContainer,
		fontSize: typography.bodyMedium,
		textAlign: "center",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: roundness.full,
		marginRight: spacing.md,
	},
	headerInfo: {
		flex: 1,
	},
	name: {
		fontSize: typography.titleMedium,
		fontWeight: "600",
		color: theme.colors.onSurface,
		marginBottom: 2,
	},
	username: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
	},
	bio: {
		fontSize: typography.bodyMedium,
		color: theme.colors.onSurfaceVariant,
		lineHeight: 20,
		marginBottom: spacing.sm,
	},
	stats: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: spacing.sm,
		marginBottom: spacing.sm,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: theme.colors.outlineVariant,
	},
	stat: {
		alignItems: "center",
	},
	statValue: {
		fontSize: typography.titleLarge,
		fontWeight: "600",
		color: theme.colors.primary,
	},
	statLabel: {
		fontSize: typography.bodySmall,
		color: theme.colors.onSurfaceVariant,
		marginTop: 2,
	},
	links: {
		paddingHorizontal: spacing.lg,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	linkButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		paddingVertical: spacing.xs,
	},
	linkText: {
		fontSize: typography.bodyMedium,
		color: theme.colors.primary,
		fontWeight: "500",
	},
});
