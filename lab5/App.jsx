import { useState } from "react";

// Shows filled stars for the rating, e.g. rating 3 -> ⭐⭐⭐
function Stars({ rating }) {
  let stars = "";
  for (let i = 0; i < rating; i++) {
    stars = stars + "⭐";
  }
  return <span>{stars}</span>;
}

// One movie in the list
function Movie({ movie, onRemove, onReviewChange, onRatingChange }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.movieTitle}>{movie.title}</h3>
        <button style={styles.removeButton} onClick={() => onRemove(movie.id)}>
          Remove
        </button>
      </div>

      <p style={styles.ratingText}>
        Rating: <Stars rating={movie.rating} /> ({movie.rating}/5)
      </p>

      <label style={styles.label}>Change rating: </label>
      <select
        value={movie.rating}
        onChange={(e) => onRatingChange(movie.id, Number(e.target.value))}
        style={styles.input}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>

      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder="Write your review..."
          value={movie.review}
          onChange={(e) => onReviewChange(movie.id, e.target.value)}
          style={styles.textarea}
        />
      </div>
    </div>
  );
}

// Form for adding a new movie
function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");

  function handleAdd() {
    if (title.trim() === "") {
      return; // don't add empty titles
    }
    onAdd(title.trim(), rating, review);
    setTitle("");
    setRating(3);
    setReview("");
  }

  return (
    <div style={styles.form}>
      <h2 style={styles.formTitle}>Add a movie</h2>

      <input
        type="text"
        placeholder="Movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <div style={{ marginTop: "10px" }}>
        <label style={styles.label}>Rating: </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={styles.input}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <span style={{ marginLeft: "10px" }}>
          <Stars rating={rating} />
        </span>
      </div>

      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder="Write a review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <button style={styles.addButton} onClick={handleAdd}>
        Add movie
      </button>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [nextId, setNextId] = useState(1);

  function handleAdd(title, rating, review) {
    const newMovie = {
      id: nextId,
      title: title,
      rating: rating,
      review: review,
    };
    setMovies([...movies, newMovie]);
    setNextId(nextId + 1);
  }

  function handleRemove(id) {
    setMovies(movies.filter((movie) => movie.id !== id));
  }

  function handleReviewChange(id, newReview) {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, review: newReview } : movie
      )
    );
  }

  function handleRatingChange(id, newRating) {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, rating: newRating } : movie
      )
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🎬 My Movies Watch List</h1>

      <AddMovieForm onAdd={handleAdd} />

      <h2 style={styles.listTitle}>Watched ({movies.length})</h2>

      {movies.length === 0 ? (
        <p style={styles.empty}>No movies yet. Add your first one above.</p>
      ) : (
        movies.map((movie) => (
          <Movie
            key={movie.id}
            movie={movie}
            onRemove={handleRemove}
            onReviewChange={handleReviewChange}
            onRatingChange={handleRatingChange}
          />
        ))
      )}
    </div>
  );
}

// Inline styles (the lab allows AI for styling)
const styles = {
  page: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
  },
  title: { textAlign: "center", color: "#222" },
  form: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    marginBottom: "20px",
  },
  formTitle: { marginTop: 0 },
  listTitle: { color: "#222" },
  empty: { color: "#777" },
  card: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    marginBottom: "12px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieTitle: { margin: 0 },
  ratingText: { margin: "8px 0" },
  label: { fontWeight: "bold" },
  input: {
    padding: "6px",
    fontSize: "14px",
    width: "auto",
  },
  textarea: {
    width: "100%",
    minHeight: "60px",
    padding: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  addButton: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "tomato",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  removeButton: {
    padding: "4px 10px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default App;
