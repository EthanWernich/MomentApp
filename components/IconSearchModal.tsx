import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { XMarkIcon, MagnifyingGlassIcon, SparklesIcon } from 'react-native-heroicons/outline';
import * as HeroIconsSolid from 'react-native-heroicons/solid';
import { themes } from '../lib/themes';
import { useAppStore } from '../store/useAppStore';
import { PREMIUM_ICON_NAMES, AllIconName } from '../constants/eventConfig';

interface IconSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: AllIconName) => void;
  currentIcon?: string;
}

// Map icon names to their components
const getIconComponent = (iconName: string) => {
  // Convert kebab-case to PascalCase and add "Icon" suffix
  const componentName = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Icon';
  
  return (HeroIconsSolid as any)[componentName];
};

export function IconSearchModal({
  visible,
  onClose,
  onSelectIcon,
  currentIcon,
}: IconSearchModalProps) {
  const theme = useAppStore((state) => state.user?.theme || 'midnight');
  const isPremium = useAppStore((state) => state.user?.isPremium || false);
  const colors = themes[theme] || themes.midnight;
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return PREMIUM_ICON_NAMES;
    }

    const query = searchQuery.toLowerCase().trim();
    return PREMIUM_ICON_NAMES.filter((iconName) =>
      iconName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectIcon = (iconName: AllIconName) => {
    if (!isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Premium Required',
        'Upgrade to Premium to access 50+ exclusive icons.',
        [{ text: 'OK' }]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectIcon(iconName);
    onClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitle}>
              <SparklesIcon color={colors.accent} size={24} />
              <Text style={[styles.title, { color: colors.text }]}>
                Premium Icons
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <XMarkIcon color={colors.textMuted} size={24} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <MagnifyingGlassIcon color={colors.textMuted} size={20} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search icons..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <XMarkIcon color={colors.textMuted} size={20} />
              </TouchableOpacity>
            )}
          </View>

          {!isPremium && (
            <View style={[styles.banner, { backgroundColor: colors.card }]}>
              <Text style={[styles.bannerText, { color: colors.textMuted }]}>
                Unlock all icons with Premium
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredIcons.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No icons found
              </Text>
            </View>
          ) : (
            <View style={styles.iconGrid}>
              {filteredIcons.map((iconName) => {
                const IconComponent = getIconComponent(iconName);
                const isSelected = currentIcon === iconName;
                const isLocked = !isPremium;

                return (
                  <TouchableOpacity
                    key={iconName}
                    onPress={() => handleSelectIcon(iconName)}
                    style={[
                      styles.iconButton,
                      {
                        backgroundColor: isSelected ? colors.accent : colors.card,
                        opacity: isLocked ? 0.5 : 1,
                      },
                    ]}
                  >
                    {IconComponent ? (
                      <IconComponent
                        color={isSelected ? colors.background : colors.text}
                        size={28}
                      />
                    ) : (
                      <Text style={{ color: colors.textMuted, fontSize: 10 }}>?</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.separator }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {filteredIcons.length} premium icons available
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  banner: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});
