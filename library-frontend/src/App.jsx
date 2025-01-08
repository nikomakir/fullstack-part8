import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendation";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [genre, setGenre] = useState('');
  const client = useApolloClient();
  const authorResult = useQuery(ALL_AUTHORS);
  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre || undefined },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book by title ${addedBook.title} added!`)
      client.refetchQueries({
        include: [
          ALL_BOOKS,
          ALL_AUTHORS
        ],
      })
    }
  })

  if (authorResult.loading || bookResult.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null);
    setGenre('');
    setPage("authors")
    localStorage.clear();
    client.resetStore();
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token && <button onClick={logout}>logout</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} authors={authorResult.data.allAuthors} token={token} />

      <Books show={page === "books"} genre={genre} books={bookResult} setGenre={setGenre} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} token={token} />

      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
