const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Projek Joints Camp Kelompok 7')
})

app.listen(port, () => {
  console.log(`running on http://localhost:${port}/`)
})