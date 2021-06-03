import React from 'react';
import renderer from 'react-test-renderer';
import { ProgressBar } from './ProgressBar';

it('renders correctly', () => {
  const tree = renderer.create(<ProgressBar progress={10} />).toJSON();
  expect(tree).toMatchSnapshot();
});
