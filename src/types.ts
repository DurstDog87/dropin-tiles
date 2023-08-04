export interface ITileCoord {
    z: number
    x: number
    y: number
}

export interface ITileEnvelope {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
}

export interface IQueryOptions {
    queryString?: string
    params?: Array<string | number>
    srid?: number
    layerName?: string
    extent?: number
    buffer?: number
    clip_geom?: boolean
}
