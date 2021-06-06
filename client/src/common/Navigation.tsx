import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Actions } from 'react-native-router-flux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import {
  faCalendar,
  faNewspaper,
  faCircle,
  faUser,
} from '@fortawesome/free-regular-svg-icons';

import {
  faCalendar as faCalendarSolid,
  faNewspaper as faNewspaperSolid,
  faCircle as faCircleSolid,
  faUser as faUserSolid,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext, themes } from './ThemeContext';

const screen = Dimensions.get('screen');

export type NavigationProps = {
  children?: React.ReactNode;
  selected?: string; // This is no longer required
};

//export const navHeight = screen.height * 0.065;

export let navHeight = 80;

if (Platform.OS !== 'ios') {
  navHeight = screen.height * 0.065;
}

type NavButtonProps = {
  name: string;
  style: any;
};

// TODO: Find better icons for these
const icons = {
  circles: [faCircle, faCircleSolid],
  questionnaires: [faNewspaper, faNewspaperSolid],
  calendar: [faCalendar, faCalendarSolid],
  settings: [faUser, faUserSolid],
};

// Adds a navigation bar to a component. Very bare bones right now.
// example:
//     <Navigation selected="pageName">
//       <MyComponent />
//     </Navigation>
export function Navigation({ children, selected }: NavigationProps) {
  const [currentScene, setCurrentScene] = useState(Actions.currentScene);

  // Scene loading is async so we can't just use currentScene directly, instead
  // we watch for when the scene changes to set the currently selected icon
  // in the nav bar.
  useEffect(() => {
    setCurrentScene(Actions.currentScene);
  }, [setCurrentScene, Actions.currentScene]);

  if (!selected) {
    selected = currentScene;
  }

  const NavButton = ({ name, style }: NavButtonProps) => {
    const icon = icons[name][name === selected ? 1 : 0];
    return (
      <TouchableOpacity
        style={{ ...styles.navIcon, ...style }}
        onPress={() => Actions.replace(name)}
      >
        <FontAwesomeIcon icon={icon} size={28} color="#12121a" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: navHeight }}>{children}</View>
      <View style={styles.navigation}>
        <NavButton name="circles" style={{ flexGrow: 1, paddingLeft: 32 }} />
        <NavButton
          name="questionnaires"
          style={{ flexGrow: 2, alignItems: 'center' }}
        />
        <NavButton
          name="calendar"
          style={{ flexGrow: 2, alignItems: 'center' }}
        />
        <NavButton
          name="settings"
          style={{ flexGrow: 1, alignItems: 'flex-end', paddingRight: 32 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    backgroundColor: 'white',
    height: navHeight,
    padding: 8,
    paddingLeft: 0,
    paddingRight: 0,
    borderTopWidth: 1,
    borderColor: '#eaeaea',
  },
  navIcon: {
    flexGrow: 1,
    display: 'flex',
  },
});
