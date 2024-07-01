 # Drop In Tileservice

A drop in vector tile service using pg for turning any postres backend into a tileserver.

### Pre Requisites:

- [PostgreSQL](https://www.postgresql.org/) with the [PostGIS](http://postgis.net/) extension added.
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

const tileService = new Tileserver()
//SQL to be run against the pool db
tileservice.setQuery("SELECT id, geom FROM schema.table WHERE prop = 44") 
tileservice.setSrid(2252) //Michigan Central

app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const conn = await pool.connect()
        const tiles = await ts.query(req.params.z, req.params.x, req.params.y, conn {
            layername: "default"
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    } finally {
        await conn.release()
    }

})

```

### With Params
```javascript
tileservice.setQuery("SELECT id, geom FROM schema.table WHERE prop = $1") 
tileservice.setSrid(2252) //Michigan Central

app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const conn = await pool.connect()
        const tiles = await ts.query(req.params.z, req.params.x, req.params.y, conn, {
            params: [44],
            layername: "default"
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    } finally {
        await conn.release()
    }
})
```

### Passing queryString and srid

```javascript
app.get("/tiles/:z/:x/:y", async (req, res) => {
    try {
        const conn = await pool.connect()
        const tiles = await ts.query(req.params.z, req.params.x, req.params.y, conn, {
            queryString: "SELECT id, geom FROM schema.table WHERE prop = $1",
            srid: 2252,
            params: [44],
            layername: "default"
        })
        res.status(200).send(tiles) //protobuf sent as result 
    } catch (e) {
        console.log(e)
    } finally {
        await conn.release()
    }
})
```
