import { Pool, QueryResult } from "pg"
import { ITileCoord, IQueryInput } from "./types"

export declare const DEFAULT_SRID = 4269

export class Tileserver {
    declare pool: Pool
    declare queryString: string
    declare srid: number

    constructor(pool: Pool) {
        this.pool = pool 
        this.srid = DEFAULT_SRID
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

    async query({queryString=this.queryString, params=[], z, x, y, srid=this.srid}: IQueryInput={}):
    Promise<ArrayBuffer | undefined> {

        if (z==undefined || x===undefined || y===undefined) {
            throw EvalError("tile coordinates not defined")
        }

        const tileCoord: ITileCoord = {z: z, x: x, y: y}

        if(!queryString){
            throw EvalError("no query string set")
        }

        const query = `
        WITH mvtgeom AS (
            SELECT ST_AsMVTGeom(ST_Transform(geom, 3857), ST_TileEnvelope(
                    ${tileCoord.z},${tileCoord.x},${tileCoord.y}
                )) AS mvtgeom, *
            FROM (${queryString}) AS dat
            WHERE ST_Intersects(geom, ST_Transform(ST_TileEnvelope(
                    ${tileCoord.z},${tileCoord.x},${tileCoord.y}
            ), ${srid}))
        )
        SELECT ST_AsMVT(mvtgeom.*) AS mvt FROM mvtgeom;
        `
        const conn = await this.pool.connect()

        try{
            const result: QueryResult<{mvt:ArrayBuffer}> = await conn.query(query, params)
            return result.rows[0].mvt
        } catch(e) {
            throw e
        } finally {
            conn.release()
        }
    }
}
