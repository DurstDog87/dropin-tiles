import { describe, expect, test } from '@jest/globals';
import { Pool } from 'pg';
import { Tileserver } from '../index';

const gPool = new Pool();

describe('test Tileserver class internals', () => {
  test('constructor', () => {
    const testClass = new Tileserver(gPool);
    expect(testClass.srid).toStrictEqual(4269);
    expect(testClass.extent).toStrictEqual(4096);
    expect(testClass.buffer).toStrictEqual(256);
    expect(testClass.clip_geom).toBe(true);
    expect(!!testClass.queryString).toBe(false);
    expect(testClass.queryString).toBe('');
  });

  test('setters', () => {
    const testClass = new Tileserver(gPool);
    testClass.setQuery('SELECT * FROM foo.bar;');
    testClass.setSrid(4326);
    expect(testClass.queryString).toBe('SELECT * FROM foo.bar;');
    expect(testClass.srid).toBe(4326);
  });
});
