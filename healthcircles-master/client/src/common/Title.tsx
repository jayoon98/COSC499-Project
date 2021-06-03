import React from 'react';
import { StyleSheet, Text } from 'react-native';

export type TitleProps = {
  color?: string;
  style?: any;
  children?: React.ReactNode;
};

export function Title({ color, style, children }: TitleProps) {
  return (
    <Text
      style={{ ...styles.title, ...(style || {}), color: color || 'black' }}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
