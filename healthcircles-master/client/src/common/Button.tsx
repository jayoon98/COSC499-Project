import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

export type ButtonProps = {
  innerStyle?: any;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'link' | 'none';
} & TouchableOpacityProps;

// A simple button based on TouchableOpacity. Unlike the native button, this
// button accepts child components.
export function Button(props: ButtonProps) {
  const type = props.type || 'secondary';
  const altStyle = (() => {
    switch (type) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'link':
        return styles.link;
      default:
        return {};
    }
  })();
  const disabledStyle = props.disabled || {};

  return (
    <TouchableOpacity {...(props as TouchableOpacityProps)}>
      <View
        style={{
          ...styles.button,
          ...altStyle,
          ...disabledStyle,
          ...props.innerStyle,
        }}
      >
        {props.children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  secondary: {
    borderColor: '#e2e4ef',
    borderWidth: 1,
    borderRadius: 4,
  },
  primary: {
    backgroundColor: '#3483eb',
    color: 'white',
    borderRadius: 4,
  },
  link: {
    color: '#3483eb',
  },
  disabled: {
    opacity: 0.2,
  },
});
