import { describe, expect, test } from '@jest/globals';
import { tileExt, nTiles, makeEnvelopeFromTileCoord } from '../util/tile';

describe('tile utilities', () => {
  test('find tile extent at given zoom', () => {
    expect(tileExt(2)).toBe(4);
  });

  test('find the total number of tiles at a given zoom level', () => {
    expect(nTiles(0)).toBe(1);
    expect(nTiles(1)).toBe(4);
  });

  test('find the bounding box for and zxy set', () => {
    /* "POLYGON((-20037508.342789244 -20037508.342789244,-20037508.342789244 20037508.342789244,20037508.342789244 20037508.342789244,20037508.342789244 -20037508.342789244,-20037508.342789244 -20037508.342789244))"*/
    expect(makeEnvelopeFromTileCoord(0, 0, 0)).toBe({});
  });
});
