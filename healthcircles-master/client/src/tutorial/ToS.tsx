import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { Header } from '../common/Header';
import Logo from '../common/Logo';
import { termsofuse } from './termsofuse';

export const MAIN_SCENE = 'questionnaires';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 10;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export function ToS() {
  const [accepted, setAccepted] = useState(false);

  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <Logo />
        <Header title="Terms of Use"></Header>
        {/* <Header title="health circles" /> */}
        <ScrollView
          style={{ maxHeight: '50%' }}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setAccepted(true);
            }
          }}
        >
          <Text style={{ textAlign: 'center' }}>{termsofuse()}</Text>
        </ScrollView>
        <TouchableOpacity
          disabled={!accepted}
          onPress={() => Actions.replace('tutorialsurvey')}
          style={accepted ? styles.button : styles.buttonDisabled}
        >
          <Text style={styles.buttonLabel}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    marginTop: 100,
    padding: 48,
  },
  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10,
    top: 10,
  },

  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10,
    top: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center',
  },
});
