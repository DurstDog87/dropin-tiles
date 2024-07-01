import { Client, Pool, QueryResult } from 'pg';
import { IQueryOptions } from './types';
import { makeBboxFromTileCoord } from './util/tile';

export const DEFAULT_SRID = 4269;
export const DEFAULT_EXTENT = 4096;
export const DEFAULT_BUFFER = 256;
export const DEFAULT_CLIP_GEOM = true;

export class Tileserver {
  srid: number;
  extent: number;
  buffer: number;
  clip_geom: boolean;
  queryString: string;

  constructor() {
    this.srid = DEFAULT_SRID;
    this.extent = DEFAULT_EXTENT;
    this.buffer = DEFAULT_BUFFER;
    this.clip_geom = DEFAULT_CLIP_GEOM;
    this.queryString = '';
  }

  setQuery(query: string) {
    this.queryString = query;
  }

  setSrid(srid: number) {
    this.srid = srid;
  }

  async query(z: number, x: number, y: number, client: Client, options: IQueryOptions = {}): Promise<ArrayBuffer> {
    if (z === undefined || x === undefined || y === undefined) {
      throw EvalError('tile coordinates not defined');
    }

    if (!this.queryString && !options.queryString) {
      throw EvalError('no query string set');
    }

    const query = `--sql
        WITH mvtgeom AS (
            SELECT ST_AsMVTGeom(
                ST_Transform(geom, 3857), 
                ST_MakeEnvelope($1,$2,$3,$4, 4326), 
                ${options.extent ?? this.extent},
                ${options.buffer ?? this.buffer},
                ${options.clip_geom ?? this.clip_geom}
                ) AS mvtgeom, dat.*
            FROM (${(options.queryString ?? this.queryString).replace(/;$/g, '')}) AS dat
            WHERE ST_Intersects(
                geom, 
                ST_Transform(ST_MakeEnvelope($1,$2,$3,$4, ${options.srid ?? this.srid}), ${options.srid ?? this.srid})
        ))
        SELECT ST_AsMVT(mvtgeom.*, '${options.layerName ?? 'default'}') AS mvt FROM mvtgeom;
        `;

    const bbox = makeBboxFromTileCoord(z, x, y);
    const result: QueryResult<{ mvt: ArrayBuffer }> = await client.query(query, [
      bbox.xMin,
      bbox.yMin,
      bbox.xMax,
      bbox.yMax,
    ]);
    return result.rows[0].mvt;
  }
}
