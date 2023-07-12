export function tileExt(zoom: number): number {
    //tile width at zoom level `zoom`
    return 2**zoom
}

export function nTiles(zoom: number): number {
    //total number of tiles at zoom level `zoom`
    return 2**(2*zoom)
}
