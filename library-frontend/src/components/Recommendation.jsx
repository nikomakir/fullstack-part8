import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { ME, ALL_BOOKS } from "../queries"

const Recommendations = (props) => {
  const [genre, setGenre] = useState('')

  const genreResult = useQuery(ME, {
    onCompleted: (data) => {
      if (data?.me?.favoriteGenre) {
        setGenre(data.me.favoriteGenre)
      }
    },
    skip: !props.token
  })

  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre || undefined },
    skip: !genre
  })

  useEffect(() => {
    if (genre) {
      bookResult.refetch()
    }
  }, [genre, bookResult.refetch])

  if (!props.show) {
    return null
  }

  if (bookResult.loading || genreResult.loading) {
    return <p>Loading...</p>
  }

  if (!bookResult.data) {
    return (
      <div>
        could not find any books for your favorite genre {genre}
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{genre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookResult.data?.allBooks?.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations