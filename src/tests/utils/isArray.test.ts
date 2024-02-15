import { isArrayofStrings } from '../../utils/isArray';

describe('isArrayofStrings', () => {
  it('should return true for an array of strings', () => {
    const arr = ['hello', 'world'];
    expect(isArrayofStrings(arr)).toBe(true);
  });

  it('should return false for an array with non-string elements', () => {
    const arr: any = ['hello', 123];
    expect(isArrayofStrings(arr)).toBe(false);
  });

  it('should return false for a non-array input', () => {
    const arr:any = 'hello';
    expect(isArrayofStrings(arr)).toBe(false);
  });
});