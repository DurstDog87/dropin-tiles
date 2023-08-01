 # Drop In Tileservice

A drop in vector tile service using pg for turning any postres backend into a tileserver.

### Pre Requisites:

- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](http://postgis.net/) installed.
- This Package requires the [node-postgres](https://node-postgres.com/) package

### Installation 

- Clone this repo then build using `npm run build` at the root
- Install in your application with `npm install path/to/repo`
- Link with `npm link path/to/repo`

### Usage: (Express example)

```javascript
import { Tileserver } from "dropin-tileservice"
import { Pool } from "pg"
import Express from "express"

const app = Express()
const port = 5000

app.use(cors())

const connection_params = {
    user: "postgres",
    host: "localhost",
    database: "features",
    password: "secret-password", //optional
    port: 5432
}

const pool = new Pool(connection_params)

const tileService = new Tileserver(pool)
//SQL to be run against the pool db
tileservice.setQuery("SELECT id, geom FROM schema.table WHERE prop = 44") 
tileservice.setSrid(2252) //Michigan Central

app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const tiles = await ts.query({ // returns a protobuf containing tile geometries and properties
            z: req.params.z,
            x: req.params.x,
            y: req.params.y
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    }

})

```

### With Params
```javascript
tileservice.setQuery("SELECT id, geom FROM schema.table WHERE prop = $1") 
tileservice.setSrid(2252) //Michigan Central

app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const tiles = await ts.query({ // returns a protobuf containing tile geometries and properties
            z: req.params.z,
            x: req.params.x,
            y: req.params.y,
            params: [44]
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    }
})
```

### Passing queryString and srid

```javascript
app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const tiles = await ts.query({ // returns a protobuf containing tile geometries and properties
            queryString: "SELECT id, geom FROM schema.table WHERE prop = $1",
            srid: 2252,
            z: req.params.z,
            x: req.params.x,
            y: req.params.y,
            params: [44]
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    }
})
```
