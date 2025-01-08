import { useState } from "react"
import { useMutation } from "@apollo/client"
import { EDIT_YEAR, ALL_AUTHORS } from "../queries"


const Authors = (props) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [ updateYear ] = useMutation(EDIT_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const submit = async (event) => {
    event.preventDefault()

    updateYear({ variables: { name, setBornTo: Number(year) }})
    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && (
        <>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
          <div>
            <select value={name} onChange={({ target }) => setName(target.value)}>
              {authors.map((a) => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            born
            <input
              type="number"
              value={year}
              onChange={({ target }) => setYear(target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
        </>
      )}
    </div>
  )
}

export default Authors
