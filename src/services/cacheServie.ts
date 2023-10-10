import NodeCache from 'node-cache';

const cache = new NodeCache();

export const getCache = (key: string): any[] | undefined => {
  return cache.get(key);
};

export const setCache = (key: string, value: any, time:number) => {
  return cache.set(key, value, time);
};