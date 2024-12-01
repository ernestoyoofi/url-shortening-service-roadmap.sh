require("dotenv").config()
const express = require("express")
const mysql2 = require("mysql2/promise")

const port = process.env.PORT || 3000
const app = express()
const databaseQueryRequest = async (query_params) => {
  const connection = await mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATA
  })
  await connection.query(`CREATE TABLE IF NOT EXISTS shorting (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url TEXT NOT NULL,
  shortcode VARCHAR(64) NOT NULL,
  createdat BIGINT NOT NULL,
  updateat BIGINT NOT NULL,
  accesscount INT DEFAULT 0
);`)
  let result = []
  for(let request of query_params) {
    const dataReq = await connection.query(request[0], request[1])
    result.push({
      result: dataReq[1]? dataReq[1] : dataReq[0],
      data: dataReq[1]? dataReq[0] : dataReq[1],
    })
  }
  connection.end()
  return result
}
const responResult = (data, showAccess) => {
  return JSON.parse(JSON.stringify({
    id: data.id,
    url: data.url,
    shortCode: data.shortcode,
    createdAt: new Date(data.createdat),
    updateAt: new Date(data.updateat),
    accesscount: showAccess? data.accesscount : undefined
  }))
}
app.use(express.json())

// # 1. Create a shortened URL
app.post("/shorten", async (req, res) => {
  // Validate
  if(!req.body.url || typeof req.body.url != "string" || req.body.url?.slice(0, 4) != "http") {
    return res.status(400).json({
      message: "Invalid URL or not entered!"
    })
  }
  const data = await databaseQueryRequest([
    [`INSERT INTO shorting (url, shortcode, createdat, updateat, accesscount) VALUES (?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0);`, [ req.body.url, require("crypto").randomBytes(10).toString("base64url") ]],
    [`SELECT * FROM shorting WHERE id = LAST_INSERT_ID();`]
  ])
  const result = data[1].data[0]
  return res.status(201).json(responResult(result))
})
// # 2. Retrieve the original URL from a short URL
app.get("/shorten/:code", async (req, res) => {
  const data = await databaseQueryRequest([
    [`SELECT * FROM shorting WHERE shortcode = ?`, [req.params.code]]
  ])
  if(!data[0].data[0]) {
    return res.status(404).json({
      message: "Not Found"
    })
  }
  await databaseQueryRequest([
    [`UPDATE shorting SET accesscount = ?`,data[0].data[0].accesscount + 1]
  ])
  return res.status(200).json(responResult(data[0].data[0]))
})
// # 3. Update an existing short URL
app.put("/shorten/:code", async (req, res) => {
  if(!req.body.url || typeof req.body.url != "string" || req.body.url?.slice(0, 4) != "http") {
    return res.status(400).json({
      message: "Invalid URL or not entered!"
    })
  }
  const data = await databaseQueryRequest([
    [`UPDATE shorting SET url = ?, updateat = UNIX_TIMESTAMP() WHERE shortcode = ?`,[req.body.url, req.params.code]],
    [`SELECT * FROM shorting WHERE shortcode = ?`,[req.params.code]]
  ])
  if(!data[1].data[0]) {
    return res.status(404).json({
      message: "Not Found"
    })
  }
  return res.status(200).json(responResult(data[1].data[0]))
})
// # 4. Delete an existing short URL
app.delete("/shorten/:code", async (req, res) => {
  const data = await databaseQueryRequest([
    [`SELECT * FROM shorting WHERE shortcode = ?`, [req.params.code]],
    [`DELETE FROM shorting WHERE shortcode = ?`, [req.params.code]]
  ])
  if(!data[0].data[0]) {
    return res.status(404).json({
      message: "Not Found"
    })
  }
  return res.status(200).json({
    success: true
  })
})
// # 5. Get statistics for a short URL
app.get("/shorten/:code/stats", async (req, res) => {
  const data = await databaseQueryRequest([
    [`SELECT * FROM shorting WHERE shortcode = ?`, req.params.code]
  ])
  if(!data[0].data[0]) {
    return res.status(404).json({
      message: "Not Found"
    })
  }
  return res.status(200).json(responResult(data[0].data[0], true))
})
app.listen(port, () => {
  console.log(`Running in http://localhost:${port} !`)
})