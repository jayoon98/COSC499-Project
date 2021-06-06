import React from 'react';
import renderer from 'react-test-renderer';
import { SurveyList } from './SurveyList';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('completed surveys renders correctly', () => {
  const tree = renderer.create(<SurveyList />).toJSON();
  expect(tree).toMatchSnapshot();
});
