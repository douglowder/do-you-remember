import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard } from '@/components/category-card';
import { OptionButton } from '@/components/option-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebContainer } from '@/components/web-container';
import { CATEGORIES, getQuestionsForCategory } from '@/constants/questions';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const version = Constants.expoConfig?.version ?? '—';
const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ??
  Constants.expoConfig?.android?.versionCode?.toString() ??
  '—';
// const updateId = Updates.updateId ? Updates.updateId.slice(0, 8) : 'dev';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const updatesInfo = Updates.useUpdates();
  const { currentlyRunning, availableUpdate, isUpdateAvailable, isUpdatePending } = updatesInfo;
  const updateId = currentlyRunning.updateId?.slice(0, 8) ?? 'dev';

  const handleCheck = () => Updates.checkForUpdateAsync();
  const handleDownload = () => Updates.fetchUpdateAsync();
  const handleReload = () => Updates.reloadAsync();

  return (
    <ThemedView style={styles.container}>
      <WebContainer>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.title}>
              Do You Remember?
            </ThemedText>
            <ThemedText style={styles.subtitle}>Pick a category and test your memory.</ThemedText>

            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                questionCount={getQuestionsForCategory(category.id).length}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            ))}

            <ThemedText type="mono" style={[styles.versionInfo, { color: colors.icon }]}>
              v{version} ({buildNumber}) · {updateId}
            </ThemedText>

            <ThemedText>Available update:</ThemedText>
            {isUpdateAvailable ? (
              <ThemedText type="mono" style={[styles.versionInfo, { color: colors.icon }]}>
                {availableUpdate?.updateId}
              </ThemedText>
            ) : null}
            <OptionButton label="Check" state="idle" onPress={handleCheck} />
            {isUpdateAvailable ? (
              <OptionButton label="Download" state="idle" onPress={handleDownload} />
            ) : null}
            {isUpdatePending ? (
              <OptionButton label="Launch" state="idle" onPress={handleReload} />
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </WebContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.6,
  },
  versionInfo: {
    fontSize: 14,
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 16,
  },
});
