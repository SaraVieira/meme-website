import React, { useState } from "react"
import { graphql } from "gatsby"
import Image from "gatsby-image"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"

import "../pages/_home.scss"
import Layout from "../components/layout"

const GET_CAPTIONS = gql`
  query($id: ID) {
    meme(where: { id: $id }) {
      id
      captions(where: { status: PUBLISHED }) {
        caption
        id
      }
    }
  }
`

const ADD_CAPTION = gql`
  mutation($id: ID, $caption: String) {
    createCaptions(
      data: { caption: $caption, memes: { connect: { id: $id } } }
    ) {
      caption
      id
    }
  }
`

export default ({
  data: {
    memes: { meme },
  },
}) => {
  const [value, setValue] = useState("")
  const [done, setDone] = useState(false)
  const { loading, error, data } = useQuery(GET_CAPTIONS, {
    variables: { id: meme.id },
  })
  // const [addCaption] = useMutation(ADD_CAPTION, {
  //   update(cache, { data }) {
  //     const { meme: queryMeme } = cache.readQuery({
  //       query: GET_CAPTIONS,
  //       variables: { id: meme.id },
  //     })
  //     cache.writeQuery({
  //       query: GET_CAPTIONS,
  //       variables: { id: meme.id },
  //       data: {
  //         meme: {
  //           ...queryMeme,
  //           captions: queryMeme.captions.concat([data.createCaptions]),
  //         },
  //       },
  //     })
  //   },
  // })

  const [addCaption] = useMutation(ADD_CAPTION)

  const submitForm = e => {
    e.preventDefault()
    addCaption({
      variables: { id: meme.id, caption: value },
    })
    setValue("")
    setDone(true)
  }

  return (
    <Layout>
      <main>
        <article>
          <figure>
            <Image
              fixed={{
                src: meme.small.url,
                srcSet: `${meme.small.url} 200w,${meme.medium.url} 400w, ${meme.large.url} 800w`,
                width: 200,
                height: 200,
              }}
            />
            <ul>
              {!loading &&
                !error &&
                data.meme.captions.map(caption => (
                  <li key={caption.id}>{caption.caption}</li>
                ))}
            </ul>
          </figure>
          <h2>Add a caption</h2>
          <form onSubmit={submitForm}>
            <label htmlFor="caption">Caption</label>
            <input
              required
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <button>Add Caption</button>
          </form>
          {done && "Your caption was sent for approval! Danke!"}
        </article>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query($id: ID) {
    memes {
      meme(where: { id: $id }) {
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
      }
    }
  }
`
