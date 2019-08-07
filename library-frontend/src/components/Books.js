import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'


const Books = ({ ALL_BOOKS, show, result }) => {
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('')
  //const [genres, setGenres] = useState([])

  const client = useApolloClient()

  /*useEffect(() => {
    (async () => {
      const { data } = await client.query({
        query: ALL_GENRES,
      })
      setGenres(data.allGenres)
    })()
  }, [ALL_GENRES, client])*/

  useEffect(() => {
    (async () => {
      const { data } = await client.query({ 
        query: ALL_BOOKS,
        variables: { genre: genre },
      })
      setBooks(data.allBooks)
    })()
  }, [genre, ALL_BOOKS, client])

  if (!show) {
    return null
  }
  
  if (ALL_BOOKS.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      <br/>
      <h3>in genre {genre}</h3>
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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {result.data.allGenres.map(g =>
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        )}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books