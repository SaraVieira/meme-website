import React from "react"
import { graphql, Link } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

import "./_home.scss"

const IndexPage = ({ data: { memes } }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Sara Meme Website</h1>
    <main>
      {memes.memes.map(meme => (
        <article key={meme.id}>
          <Link to={`/${meme.id}`}>
            <figure>
              <Image
                fixed={{
                  src: meme.small.url,
                  srcSet: `${meme.small.url} 200w,${meme.medium.url} 400w, ${meme.large.url} 800w`,
                  width: 200,
                  height: 200,
                }}
              />
            </figure>
          </Link>
        </article>
      ))}
    </main>
  </Layout>
)

export const query = graphql`
  query Memes {
    memes {
      memes {
        id
        small: photo {
          url(
            transformation: {
              image: { resize: { fit: crop, width: 200, height: 200 } }
            }
          )
          id
        }
        medium: photo {
          url(
            transformation: {
              image: { resize: { fit: crop, width: 400, height: 400 } }
            }
          )
          id
        }
        large: photo {
          url(
            transformation: {
              image: { resize: { fit: crop, width: 800, height: 800 } }
            }
          )
          id
        }
        captions {
          caption
          id
        }
      }
    }
  }
`

export default IndexPage
