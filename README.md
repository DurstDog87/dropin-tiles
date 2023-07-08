# Drop In Tileservice

A drop in vector tile service using pg for turning any postres nackend into a tileserver.

### Pre Requisites:

- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](http://postgis.net/) installed.
- This Package uses the [node-postgres](https://node-postgres.com/)


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