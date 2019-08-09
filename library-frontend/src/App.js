import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import LoginForm from './components/LoginForm'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {name}
    published
  }
`

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }`

const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS} 
  `

  const ALL_GENRES = gql`
  {
    allGenres
  }`

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS} 
  `

const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
      id
    }
  }`

const CURRENT_USER = gql`
  {
    me {
      username
      favoriteGenre
    }
  }`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  } 
  ${BOOK_DETAILS}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const client = useApolloClient()

  const authors = useQuery(ALL_AUTHORS)
  const genres = useQuery(ALL_GENRES)
  const user = useQuery(CURRENT_USER)

  const includedIn = (set, object) => {
    set.map(p => p.id).includes(object.id) 
  }

  const updateCacheWith = (addedBook) => { 
    const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: "" }   })
    console.log(dataInStore)

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      console.log(dataInStore)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }      
  }

  const [addBook] = useMutation(CREATE_BOOK, 
    {
      onError: handleError,
      update: (store, response) => {
      },
      refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_GENRES }],
    })
  
    useSubscription(BOOK_ADDED, {
      onSubscriptionData: ({ subscriptionData }) => {
        const addedBook = subscriptionData.data.bookAdded
        window.alert(
          `Book ${addedBook.title} by 
          ${addedBook.author.name} was added`
        ) 
        updateCacheWith(addedBook)
      }
    })


  const [addBorn] = useMutation(SET_BIRTHYEAR,
    {
      onError: handleError,
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
  
  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token 
          ? <div>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
            </div>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }

      <Authors 
        show={page === 'authors'}
        result={authors}
        addBorn={addBorn}
      />

      <Books
        show={page === 'books'}
        ALL_BOOKS={ALL_BOOKS}
        result={genres}
      />

      <Recommend
        show={page === 'recommend'}
        ALL_BOOKS={ALL_BOOKS}
        result={user}
      />

      <NewBook
        addBook={addBook}
        show={page === 'add'}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
        setPage={setPage}
      />

    </div>
  )
}

export default App