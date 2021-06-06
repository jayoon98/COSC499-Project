import React from 'react';
import renderer from 'react-test-renderer';
import { Themes } from './Themes';

jest.mock('@react-native-picker/picker', () => ({
  Picker: '',
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: '',
}));

jest.mock('rn-tourguide', () => ({
  TourGuideProvider: '',
}));

it('renders correctly', () => {
  const tree = renderer.create(<Themes />).toJSON();
  expect(tree).toMatchSnapshot();
});
