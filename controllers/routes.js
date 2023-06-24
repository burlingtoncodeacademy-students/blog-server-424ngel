router = require("express").Router()
const fs = require('fs')
blogPath = './api/blog.json'

function read() {
  const file = fs.readFileSync(blogPath)
  return !file.length ? [] : JSON.parse(file)
}

function save(data) {
  fs.writeFile(blogPath, JSON.stringify(data), err => {
    if (err) console.log(err)
  })
}

module.exports = router