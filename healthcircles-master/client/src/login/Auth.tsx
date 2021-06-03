import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getCachedUserCredentials } from '../services/login';
export const MAIN_SCENE = 'questionnaires';

// TODO: Pass default page as prop in case it changes
export function AuthHandler() {
  useEffect(() => {
    getCachedUserCredentials((res, _) => {
      if (res) {
        Actions.replace(MAIN_SCENE);
        return;
      }
      Actions.replace('login');
    });
  }, []);

  return <View style={styles.container}></View>;
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
});
