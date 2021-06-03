import React from 'react';
import renderer from 'react-test-renderer';
import { Quotes } from './Quotes';

it('test quotes return', () => {
  const quote = Quotes();
  expect(typeof quote).toBe('string');
});
