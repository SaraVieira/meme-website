const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query Memes {
      memes {
        memes {
          id
        }
      }
    }
  `)

  result.data.memes.memes.forEach(meme => {
    createPage({
      path: meme.id,
      component: path.resolve(`./src/templates/meme.js`),
      context: {
        id: meme.id,
      },
    })
  })
}
