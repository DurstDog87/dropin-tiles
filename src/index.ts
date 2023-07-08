import { Pool, QueryResult } from 'pg';

interface IConnection {
    user: string
    host: string
    database?: string
    password?: string
    port?: number
}

interface ITileCoord {
    z: number
    x: number
    y: number
}

interface ITileEnvelope {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
}

export class Tileserver {
    pool: Pool

    constructor(connection: IConnection) {
        this.pool = new Pool(connection)
    }

    private _validateTileCoords(z: number, x: number, y: number): boolean {
        const tileSize = 2**z

        if( x<=0 || y<=0 || z<0) {
            return false
        }

        if(x >= tileSize || y >= tileSize) {
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

        if (!this._validateTileCoords(tileCoord.z, tileCoord.x, tileCoord.y)) {
            throw Error("Invalid tile coordinates")
        }

        try{
            const result: QueryResult = await conn.query(query, params)
            return result.rows[0].mvt
        } catch(e) {
            throw e
        } finally {
            conn.release()
        }
    }
}
