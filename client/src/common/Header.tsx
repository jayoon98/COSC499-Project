import React from 'react';
import { Title } from './Title';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';

const screen = Dimensions.get('screen');

export type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Title style={{ fontSize: screen.height * 0.035 }}>{title}</Title>
      <View style={{ flex: 1, flexDirection: 'row' }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: screen.height * 0.12,
    justifyContent: 'flex-start',
    display: 'flex',

    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f6fa',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
