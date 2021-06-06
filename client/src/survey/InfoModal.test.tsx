import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { InfoModal } from './InfoModal';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

it('completed surveys renders correctly', () => {
  const tree = renderer
    .create(
      <View>
        <InfoModal description={'bla bla'} onClose={() => null} />
      </View>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
