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

  test('succeeds while property like is not set, gets a default value as 0', async () => {
    const newBlog = {
      title: 'for testing',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    const blogToInsert = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(blogToInsert.body.likes).toBe(0)
  })

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      author: 'Dan',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const urls = blogsAtEnd.map((blog) => blog.url)
    expect(urls).not.toContain(blogToDelete.url)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code of 201 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const blog = {
      likes: 20,
    }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .expect(201)

    expect(updatedBlog.body.likes).toEqual(blog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
