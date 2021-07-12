import React from 'react';
import { Title, Navigation, Header } from '../common/Core';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { CirclesVisual } from './CirclesVisual';

export function CirclesHome() {
  return (
    <View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Navigation selected="circles">
        <View style={styles.container}>
          <Header title="My Health Circles" />
          <CirclesVisual />
        </View>
      </Navigation>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
  },
});
