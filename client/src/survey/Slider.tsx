import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Colors } from '../colors';
import {
  faSmile,
  faFrown,
  faMeh,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

// NOTE: This library isn't great (from 2018 and gives warnings now)
import NativeSlider from 'react-native-slider';

export type SliderProps = {
  min?: number;
  max?: number;
  height?: number;
  thumbSize?: number;
  value?: number;
  onChangeValue?: (value: number) => void;
  colorLeft?: string;
  colorRight?: string;
};

type LabelProps = {
  icon: IconDefinition;
  accent: string;
  selected?: boolean;
};

export function Slider(props: SliderProps) {
  const height = props.height || 32;
  const thumbSize = props.thumbSize || height + 12;
  const min = props.min || 1;
  const max = props.max || 10;
  const colorLeft = props.colorLeft || '#ef5350';
  const colorRight = props.colorRight || '#e2e4e8';
  const [currentValue, setCurrentValue] = useState(props.value || min);

  useEffect(() => {
    // If the parent changes the prop value we need to reinitialize
    // the state to update the slider.
    setCurrentValue(props.value || min);
  }, [props.value]);

  const onSlidingComplete = (v: number) => {
    setCurrentValue(Math.round(v));
    if (props.onChangeValue) {
      props.onChangeValue(Math.round(v));
    }
  };

  const LabelIcon = ({ icon, selected, accent }: LabelProps) => (
    <FontAwesomeIcon
      icon={icon}
      size={32}
      color={selected ? accent : Colors.lightgrey}
    />
  );

  const makeLabels = () => {
    const mid = Math.round(max / 2);
    const accent = (() => {
      if (currentValue > mid) return colorLeft;
      if (currentValue < mid) return colorRight;
      return '#c2c4cf';
    })();

    return new Array(max + 1 - min).fill(0).map((_, i) => {
      const selected = currentValue - min === i;
      // Smiley and frown for first and last point. Meh for midpoint
      const icon = (() => {
        if (i === 0) return faFrown;
        if (i + min === mid) return faMeh;
        if (i + min === max) return faSmile;
        return null;
      })();

      if (icon) {
        return <LabelIcon key={i} {...{ selected, accent, icon }} />;
      }
      // Default: return bullet point
      return (
        <Text
          key={i}
          style={selected ? { ...styles.label, color: accent } : styles.label}
        >
          {'\u2022'}
        </Text>
      );
    });
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={{ height, width: '100%' }}>
        <NativeSlider
          style={{
            borderRadius: 24,
          }}
          trackStyle={{
            height,
            borderRadius: height / 2,
          }}
          minimumValue={min}
          maximumValue={max}
          animateTransitions={true}
          animationType="spring"
          minimumTrackTintColor={colorLeft}
          maximumTrackTintColor={colorRight}
          thumbStyle={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#f1f2f6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.6,
            elevation: 5,
          }}
          value={currentValue}
          onSlidingComplete={onSlidingComplete}
        />
      </View>
      <View style={styles.labels}>{makeLabels()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    marginTop: 4,
  },
  label: {
    color: Colors.lightgrey,
    fontSize: 32,
  },
});
