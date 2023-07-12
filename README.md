# Drop In Tileservice

A drop in vector tile service using pg for turning any postres backend into a tileserver.

### Pre Requisites:

- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](http://postgis.net/) installed.
- This Package requires the [node-postgres](https://node-postgres.com/) package


### Usage:

```javascript
import { Tileserver } from "dropin-tileservice"
import { Pool } from "pg"

const connection_params = {
    user: "postgres",
    host: "localhost",
    database: "features",
    password: "secret-password", //optional
    port: 5432
}

const pool = new Pool(connection_params)

const tileService = new Tileserver(pool)
```