import React from 'react';
import renderer from 'react-test-renderer';
import { DomainSelection } from './DomainSelection';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('completed surveys renders correctly', () => {
  const tree = renderer.create(<DomainSelection />).toJSON();
  expect(tree).toMatchSnapshot();
});
