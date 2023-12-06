import { ITileCoord, ITileEnvelope } from '../types';

export function tileExt(zoom: number): number {
  //tile width at zoom level `zoom`
  return 2 ** zoom;
}

export function nTiles(zoom: number): number {
  //total number of tiles at zoom level `zoom`
  return 2 ** (2 * zoom);
}

export function makeEnvelopeFromTileCoord(z: number, x: number, y: number): ITileEnvelope {
  const webMercMax = 20037508.3427892;
  const webMercMin = -1 * webMercMax;
  const worldSize = webMercMax - webMercMin;
  //bbox width in tiles
  const tileSize = tileExt(z);
  //bbox width in EPSG:3857
  const tileMercSize = worldSize / tileSize;

  return {
    xMin: webMercMin + tileMercSize * x,
    xMax: webMercMin + tileMercSize * (x + 1),
    yMin: webMercMax + tileMercSize * (y + 1),
    yMax: webMercMax + tileMercSize * y,
  };
}

export function validateTileCoords(coord: ITileCoord): boolean {
  const tileSize = tileExt(coord.z);

  if (coord.x <= 0 || coord.y <= 0 || coord.z < 0) {
    return false;
  }

  if (coord.x > tileSize || coord.y > tileSize) {
    return false;
  }
  return true;
}
