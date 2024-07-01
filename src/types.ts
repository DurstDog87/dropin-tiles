export interface ITileBbox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface IQueryOptions {
  queryString?: string;
  params?: Array<string | number>;
  srid?: number;
  layerName?: string;
  extent?: number;
  buffer?: number;
  clip_geom?: boolean;
}
