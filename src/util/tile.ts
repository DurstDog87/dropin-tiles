import { ITileBbox } from '../types';

export function tileExt(zoom: number): number {
  //tile width at zoom level `zoom`
  return 2 ** zoom;
}

export function nTiles(zoom: number): number {
  //total number of tiles at zoom level `zoom`
  return 2 ** (2 * zoom);
}

export function makeBboxFromTileCoord(z: number, x: number, y: number): ITileBbox {
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
    yMin: webMercMax - tileMercSize * (y + 1),
    yMax: webMercMax - tileMercSize * y,
  };
}

export function validateTileCoords(z: number, x: number, y: number): boolean {
  const tileSize = tileExt(z);

  if (x < 0 || y < 0 || z < 0) {
    return false;
  }

  if (x >= tileSize || y >= tileSize) {
    return false;
  }
  return true;
}
