const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  if (!title && !url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title,
      author,
      url,
      likes,
    })

    const result = await blog.save()

    response.status(201).json(result)
  }
})

module.exports = blogsRouter
