import { Pool, QueryResult } from "pg"
import { ITileCoord, ITileEnvelope } from "./types"

export class Tileserver {
    pool: Pool

    constructor(pool: Pool) {
        this.pool = pool
    }

    private _validateTileCoords(coord: ITileCoord): boolean {
        const tileSize = 2**coord.z

        if(coord.x<0 || coord.y<0 || coord.z<0) {
            return false
        }

        if(coord.x >= tileSize || coord.y >= tileSize) {
            return false
        }

        return true
    }
    
    private _makeEnvelopeFromTileCoord(coord: ITileCoord): ITileEnvelope {
        let result: ITileEnvelope
        const webMercMax = 20037508.3427892
        const webMercMin = -1 * webMercMax
        const worldSize = webMercMax - webMercMin
        //bbox width in tiles
        const tileSize = 2**coord.z
        //bbox width in EPSG:3857
        const tileMercSize = worldSize / tileSize

        result = {
            xMin: webMercMin + tileMercSize * coord.x,
            xMax: webMercMin + tileMercSize * (coord.x + 1),
            yMin: webMercMax + tileMercSize * (coord.y + 1),
            yMax: webMercMax + tileMercSize * coord.y
        }
        return result
    }

    async query(queryString: string, params: Array<string | number>, tileCoord: ITileCoord): Promise<BinaryData | undefined> {
        const query = ``
        const conn = await this.pool.connect()

        if (!this._validateTileCoords(tileCoord)) {
            throw Error("Invalid tile coordinates")
        }

        try{
            const result: QueryResult<{mvt:BinaryData}> = await conn.query(query, params)
            return result.rows[0].mvt
        } catch(e) {
            throw e
        } finally {
            conn.release()
        }
    }
}
