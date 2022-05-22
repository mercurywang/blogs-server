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

blogsRouter.delete('/:id', async (request, response) => {
  // if fails
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
