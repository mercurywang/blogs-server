const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 1 ? blogs[0].likes : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const sorted = lodash.orderBy(blogs, ['likes'], ['desc'])
  return lodash.pick(sorted[0], ['title', 'author', 'likes'])
}

const mostBlogs = (blogs) => {
  const authors = lodash.countBy(blogs, 'author')
  const authorArr = []
  lodash.forOwn(authors, (val, key) => {
    return authorArr.push({
      author: key,
      blogs: val,
    })
  })

  return lodash.orderBy(authorArr, ['blogs'], ['desc'])[0]
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, 'author')

  const likesArr = []
  lodash.forOwn(authors, (val, key) => {
    let counts = 0
    val.forEach(({ likes }) => {
      counts += likes
    })
    return likesArr.push({
      author: key,
      likes: counts,
    })
  })

  return lodash.orderBy(likesArr, ['likes'], ['desc'])[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
