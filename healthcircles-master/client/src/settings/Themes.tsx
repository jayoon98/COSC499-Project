import React, { useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Colors } from '../colors';
import { ThemeContext, themes, Theme } from '../common/ThemeContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { saveUserTheme } from '../services/theme';

const domains = ['social', 'emotional', 'physical', 'mental', 'spiritual'];

type ThemeCardProps = {
  themeKey: string;
  theme: Theme;
  selectedTheme: Theme;
  onSelect: (theme: Theme) => void;
};

function ThemeCard({
  themeKey,
  theme,
  selectedTheme,
  onSelect,
}: ThemeCardProps) {
  const makeDots = () => {
    return domains.map((d, i) => {
      const style = {
        ...styles.domainCircle,
        backgroundColor: theme[d],
      };
      return <View key={i} style={style} />;
    });
  };

  return (
    <TouchableOpacity
      onPress={(e) => {
        onSelect(theme);
        saveUserTheme(themeKey);
      }}
    >
      <View style={styles.themeCard}>
        <View style={{ marginRight: 12 }}>
          {theme.name === selectedTheme.name ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <View style={{ width: 16, height: 16 }}></View>
          )}
        </View>
        <Text style={{ width: 96 }}>{theme.name}</Text>
        {makeDots()}
      </View>
    </TouchableOpacity>
  );
}

export function Themes() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <View style={styles.themeSelection}>
      <View style={styles.themesList}>
        {Object.keys(themes).map((k, i) => (
          <ThemeCard
            themeKey={k}
            theme={themes[k]}
            selectedTheme={theme}
            key={i}
            onSelect={(t) => setTheme(t)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeSelection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  themesList: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  themeCard: {
    padding: 18,
    borderRadius: 14,
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5.6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainCircle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: Colors.offwhite,
    marginRight: 10,
  },
  header: {
    height: 100,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f6fa',
  },
});
