const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('verify the property name', () => {
  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('addition of a new blog', () => {
  test('succeeds with a valid data', async () => {
    const newBlog = {
      title: 'for testing ',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 20,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const filteredBlogs = blogsAtEnd.map((blog) => {
      delete blog.id
      return blog
    })

    expect(filteredBlogs).toContainEqual(newBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
