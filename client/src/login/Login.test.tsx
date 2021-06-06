import React from 'react';
import renderer from 'react-test-renderer';
import { Login, ResetPassword, Signup } from './Login';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('@react-native-community/async-storage', () => ({
  AsyncStorage: '',
}));

it('Login renders correctly', () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Signup renders correctly', () => {
  const tree = renderer.create(<Signup email={'a@b.com'} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Signup renders correctly', () => {
  const tree = renderer.create(<ResetPassword email={'a@b.com'} />).toJSON();
  expect(tree).toMatchSnapshot();
});
