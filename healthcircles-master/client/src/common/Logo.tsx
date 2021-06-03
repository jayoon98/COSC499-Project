import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function Logo() {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignContent: 'flex-start',
        position: 'relative',
      }}
    >
      <Svg width="555" height="70" style={{}}>
        <Circle
          cx="120"
          cy="30"
          fill="#5350ef"
          id="circle1"
          r="25"
          stroke="#5350ef"
          stroke-width="5"
        />
        <Circle
          cx="200"
          cy="30"
          fill="#fa7f72"
          id="circle2"
          r="25"
          stroke="#fa7f72"
          stroke-width="5"
        />
        <Circle
          cx="280"
          cy="30"
          fill="#389393"
          id="circle3"
          r="25"
          stroke="#389393"
          stroke-width="5"
        />
        <Circle
          cx="360"
          cy="30"
          fill="#f5a25d"
          id="circle4"
          r="25"
          stroke="#f5a25d"
          stroke-width="5"
        />
        <Circle
          cx="440"
          cy="30"
          fill="#a8dda8"
          id="circle5"
          r="25"
          stroke="#a8dda8"
          stroke-width="5"
        />
      </Svg>
    </View>
  );
}
