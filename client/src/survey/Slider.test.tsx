import React from 'react';
import renderer from 'react-test-renderer';
import { Slider } from './Slider';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('completed surveys renders correctly', () => {
  const tree = renderer.create(<Slider />).toJSON();
  expect(tree).toMatchSnapshot();
});
