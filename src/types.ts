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

export interface IQueryInput {
    queryString?: string
    params?: Array<string | number>
    z?: number
    x?: number
    y?: number
    srid?: number

}