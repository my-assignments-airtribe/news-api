import { getCache, setCache } from '../../services/cacheServie';

describe('cacheService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get cache', () => {
    const key = 'testKey';
    const value = ['testValue'];
    const time = 10;

    setCache(key, value, time);

    const cachedValue = getCache(key);

    expect(cachedValue).toEqual(value);
  });

  it('should return undefined for non-existent key', () => {
    const key = 'nonExistentKey';

    const cachedValue = getCache(key);

    expect(cachedValue).toBeUndefined();
  });
});