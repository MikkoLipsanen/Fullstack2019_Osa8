import React, { useState } from 'react'
import Select from 'react-select'

const Authors = ({ result, addBorn, show }) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  console.log(result.data)

  const names = result.data.allAuthors.map(a => ({value: a.name, label: a.name}))

  const handleChange = name => {
    setName(name.value)
  }

  const submit = async (e) => {
    e.preventDefault()

    await addBorn({
      variables: { name, born }
    })

    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <div>
      <form onSubmit={submit}>
        <div>
          <Select
            value={name.value}
            onChange={handleChange}
            options={names}
          />
        </div>
        <div>
          born <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
    </div>
  )
}

export default Authors