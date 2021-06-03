import React from 'react';
import renderer from 'react-test-renderer';
import { CompletedSurveys } from './CompletedSurveys';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('completed surveys renders correctly', () => {
  const tree = renderer.create(<CompletedSurveys />).toJSON();
  expect(tree).toMatchSnapshot();
});
