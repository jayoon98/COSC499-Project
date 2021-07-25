import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View } from 'react-native';

export type PickerProps = {
  onChange?: (hour: number, minute: number) => void;
};
export type DomainPickerProps = {
  onChange?: (domain: string) => void;
};

export function _Picker({ onChange }: PickerProps) {
  const [pickerHour, setPickerHour] = useState(1);
  const [pickerMinute, setPickerMinute] = useState(0);
  // TODO: AM and PM
  // TODO: JSON constant for picker items
  // TODO: flex box properties
  return (
    <View
      style={{
        height: 200,
        width: 200,
        display: 'flex',
        flexDirection: 'row',
        margin: 12,
      }}
    >
      <Picker
        selectedValue={pickerHour}
        style={{ width: '50%' }}
        onValueChange={(value: number) => {
          setPickerHour(value);
          onChange && onChange(value, pickerMinute);
        }}
        mode="dropdown"
      >
        {new Array(24).fill(0).map((_, i) => (
          <Picker.Item label={(i + 1).toString()} value={i + 1} key={i} />
        ))}
      </Picker>
      <Picker
        style={{ width: '50%' }}
        selectedValue={pickerMinute}
        onValueChange={(value: number) => {
          setPickerMinute(value);
          onChange && onChange(pickerHour, value);
        }}
        mode="dropdown"
      >
        {new Array(12).fill(0).map((_, i) => (
          <Picker.Item
            label={(i * 5).toString().padStart(2, '0')}
            value={i * 5}
            key={i}
          />
        ))}
      </Picker>
    </View>
  );
}

export function DomainPicker({ onChange }: DomainPickerProps) {
  const [domain, setDomain] = useState('social');
  onChange(domain);
  return (
    <View
      style={{
        height: 200,
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto',
      }}
    >
      <Picker
        selectedValue={domain}
        style={{ width: '50%' }}
        onValueChange={(value: string) => {
          setDomain(value);
          onChange(value);
        }}
        mode="dropdown"
      >
        <Picker.Item label="Social" value="social" />
        <Picker.Item label="Emotional" value="emotional" />
        <Picker.Item label="Physical" value="physical" />
        <Picker.Item label="Mental" value="mental" />
        <Picker.Item label="Spiritual" value="spiritual" />
      </Picker>
    </View>
  );
}
