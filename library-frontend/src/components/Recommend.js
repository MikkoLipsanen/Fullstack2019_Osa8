import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'

const Recommend = ({show, ALL_BOOKS, result}) => {
  const [genre, setGenre] = useState(null)
  const [books, setBooks] = useState([])
  
  const client = useApolloClient()

  useEffect(() => {
    if(result.data.me) {
    (async () => {
      const { data } = await client.query({ 
        query: ALL_BOOKS,
        variables: { genre: result.data.me.favoriteGenre }
      })
      setBooks(data.allBooks)
      setGenre(result.data.me.favoriteGenre)
    })()
}}, [result, client, ALL_BOOKS])

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommended books in genre {genre}</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books
            .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
              )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend