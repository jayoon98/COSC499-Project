import React from 'react';
import { View, StyleSheet } from 'react-native';

export type ProgressBarProps = {
  progress: number;
  color?: string;
  background?: string;
};

export function ProgressBar(props: ProgressBarProps) {
  const color = props.color || '#f067ab';
  const background = props.background || '#050220';

  return (
    <View style={{ ...styles.container, backgroundColor: background }}>
      <View
        style={{
          ...styles.progressBar,
          width: `${props.progress}%`,
          backgroundColor: color,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    opacity: 0.7,
    height: 12,
    borderRadius: 6,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
});
