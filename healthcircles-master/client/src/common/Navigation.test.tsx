import React from 'react';
import renderer from 'react-test-renderer';
import { Navigation } from './Navigation';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('renders correctly', () => {
  const tree = renderer.create(<Navigation />).toJSON();
  expect(tree).toMatchSnapshot();
});
