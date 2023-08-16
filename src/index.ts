import { Pool, QueryResult } from "pg"
import { IQueryOptions } from "./types"

export const DEFAULT_SRID = 4269
export const DEFAULT_EXTENT = 4096
export const DEFAULT_BUFFER = 256
export const DEFAULT_CLIP_GEOM = true

export class Tileserver {
    pool: Pool
    srid: number
    extent: number
    buffer: number
    clip_geom: boolean

    declare queryString: string

    constructor(pool: Pool) {
        this.pool = pool 
        this.srid = DEFAULT_SRID
        this.extent = DEFAULT_EXTENT
        this.buffer = DEFAULT_BUFFER
        this.clip_geom = DEFAULT_CLIP_GEOM
    }

    setPool(pool: Pool) {
        this.pool = pool
    }

    setQuery(query: string) {
        this.queryString = query
    }

    setSrid(srid: number) {
        this.srid = srid
    }

    async query(z:number, x:number, y:number, options: IQueryOptions = {}):
    Promise<ArrayBuffer> {

        if (z===undefined || x===undefined || y===undefined) {
            throw EvalError("tile coordinates not defined")
        }

        if(!this.queryString && !options.queryString){
            throw EvalError("no query string set")
        }

        const query = `
        WITH mvtgeom AS (
            SELECT ST_AsMVTGeom(
                ST_Transform(geom, 3857), 
                ST_TileEnvelope(${z},${x},${y}), 
                ${options.extent??this.extent},
                ${options.buffer??this.buffer},
                ${options.clip_geom??this.clip_geom}
                ) AS mvtgeom, dat.*
            FROM (${(options.queryString??this.queryString).replace(/;$/g, "")}) AS dat
            WHERE ST_Intersects(
                geom, 
                ST_Transform(ST_TileEnvelope(${z},${x},${y}), ${options.srid??this.srid}))
        )
        SELECT ST_AsMVT(mvtgeom.*, '${options.layerName??"default"}') AS mvt FROM mvtgeom;
        `

        const conn = await this.pool.connect()

        try{
            const result: QueryResult<{mvt:ArrayBuffer}> = await conn.query(query, options.params??[])
            return result.rows[0].mvt
        } catch(e) {
            throw e
        } finally {
            conn.release()
        }
    }
}
