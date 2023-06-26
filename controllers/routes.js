router = require("express").Router()
const fs = require('fs')
blogPath = './api/blog.json' // Path to blog post database

// Helper functions to read/write to the file directly
function read() {
  const file = fs.readFileSync(blogPath)
  return !file.length ? [] : JSON.parse(file)
}

function save(data) {
  fs.writeFile(blogPath, JSON.stringify(data), err => {
    if (err) console.log(err)
  })
}
//-----------------------------------------------------------------------------------------------

// ENDPOINTS
router.get('/', (req, res) => {
  try {
    let db = read()
    res.status(201).json(db)
  } catch (err){
    res.status(500).json({
      errorMessage: `${err}`
    })
  }
})

router.get('/:id', (req, res) => {
  try {
    let db = read()
  
    findPost = db.find(post => post.post_id === parseInt(req.params.id))
    if (!findPost) throw Error("Post not found")

    res.status(201).json({
      message: "Found post",
      post: findPost
    })
  } catch (err){
    res.status(500).json({
      errorMessage: `${err}`
    })
  }
})

router.post('/create', (req, res) => {
  try {
    let db = read()
    // Check if all parameters are entered
    if ( Object.keys(req.body).length != 3) throw Error('Please enter all params (title, author, body)')

    let post_id = db[db.length - 1].post_id + 1 // Setting new id from last id #
    
    if (!post_id) throw Error("Cannot make post id")
    db.push({post_id, ...req.body})
    save(db)

    res.status(201).json({
      message: "Post created successfully",
      post: db[db.length - 1]
    })
  } catch (err){
    res.status(500).json({
      errorMessage:`${err}`
    })
  }
})


router.put('/edit', (req, res) => {
  try {
    let db = read()
    // Throw error if the query is not entered properly
    if (!req.query.post_id) throw Error("ID not valid")
    const post_id  = parseInt(req.query.post_id)
    // Get the post, then get its index to edit it at that point in the database
    findPost = db.find(post => post.post_id === post_id)
    if (!findPost) throw Error("Post not found")
    postIndex = db.indexOf(findPost)

    if ( Object.keys(req.body).length != 3) throw Error('Please enter all params (title, author, body)')

    let updatedPost = {post_id, ...req.body}
    db[postIndex] = updatedPost
    save(db)

    res.status(201).json({
      message: 'Post updated successfully',
      post: updatedPost
    })
  } catch (err){
    res.status(500).json({
      errorMessage: `${err}`
    })
  }
})

router.delete('/delete/:id', (req, res) => {
  try {
    let db = read()
    // Get the post, then get its index to remove it from the database
    findPost = db.find(post => post.post_id === parseInt(req.params.id))
    if (!findPost) throw Error("Post not found")
    postIndex = db.indexOf(findPost)

    let deleted = db.splice(postIndex, 1)
    save(db)
    
    res.status(201).json({
      postMessage: "Post deleted successfully",
      deletedPost: deleted
    })
  } catch (err) {
    res.status(500).json({
      errorMessage: `${err}`
    })
  }
})
//-----------------------------------------------------------------------------------------------
// Export router to be used in app.js file
module.exports = router