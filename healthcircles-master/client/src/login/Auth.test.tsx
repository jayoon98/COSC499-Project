import React from 'react';
import renderer from 'react-test-renderer';
import { AuthHandler } from './Auth';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: '',
}));

it('renders correctly', () => {
  const tree = renderer.create(<AuthHandler />).toJSON();
  expect(tree).toMatchSnapshot();
});
