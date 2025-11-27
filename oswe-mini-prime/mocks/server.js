const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

app.use(cors())
app.use(bodyParser.json())

const data = JSON.parse(fs.readFileSync(path.join(__dirname,'mock_api.json'),'utf8'))

app.get('/api/profile', (req,res) => {
  res.json(data.profile)
})
app.get('/api/handbook', (req,res) => {
  res.json(data.handbook)
})

const port = process.env.PORT || 3001
app.listen(port, ()=>console.log(`Mock API listening on ${port}`))
