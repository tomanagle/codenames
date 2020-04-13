import { hello, world } from '../app';

describe('App', () => {
  it(`Should return Hello ${world}`, () => {
    expect.assertions(1);
    expect(hello()).toBe(`Hello ${world}`);
  });
});
