import { useQuery } from "@apollo/client"
import { ALL_GENRES } from "../queries"

const Books = (props) => {
  const books = props.books.data.allBooks
  const genresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{props.genre ? props.genre : 'all genres'}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!genresResult.loading && (genresResult.data.allGenres.map(g =>
        <button key={g}
          onClick={() => {
            props.setGenre(g)
            props.books.refetch()
          }}
        >
          {g}
        </button>)
      )}
      <button onClick={() => {
        props.setGenre('')
        props.books.refetch()
        }}
      >all genres</button>
    </div>
  )
}

export default Books
