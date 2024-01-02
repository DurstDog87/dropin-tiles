import { describe, expect, test } from '@jest/globals';
import { tileExt, nTiles, makeBboxFromTileCoord, validateTileCoords } from '../util/tile';

describe('tile utilities', () => {
  test('find tile extent at given zoom', () => {
    expect(tileExt(2)).toBe(4);
  });

  test('find the total number of tiles at a given zoom level', () => {
    expect(nTiles(0)).toBe(1);
    expect(nTiles(1)).toBe(4);
    expect(nTiles(12)).toBe(16777216);
  });

  test('find the envelope for and zxy set', () => {
    const res = makeBboxFromTileCoord(3, 3, 4);
    expect(res).toStrictEqual({
      xMin: -5009377.085697301,
      xMax: 0.0,
      yMin: -5009377.085697301,
      yMax: 0.0,
    });
  });

  test('tile validation', () => {
    expect(validateTileCoords(0, 0, 0)).toBe(true);
    expect(validateTileCoords(-1, -1, -1)).toBe(false);
    expect(validateTileCoords(18, -1, -1)).toBe(false);
    expect(validateTileCoords(18, 4095, 4095)).toBe(true);
  });
});
