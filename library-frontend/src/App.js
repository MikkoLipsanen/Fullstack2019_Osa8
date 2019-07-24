import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }`

const ALL_BOOKS = gql`
  {
    allBooks {
      title
      published
      author
    }
  }`

const App = () => {
  const [page, setPage] = useState('authors')

  console.log(page)

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors 
        show={page === 'authors'}
        result = {authors}
      />

      <Books
        show={page === 'books'}
        result = {books}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App