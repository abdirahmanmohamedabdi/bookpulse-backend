const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookpulse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Define the Book schema
const bookSchema = new mongoose.Schema({
  googleId: String,
  title: String,
  authors: [String],
  thumbnail: String,
  previewLink: String,
  userId: String,
  progress: Number,
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.post('/favorites', async (req, res) => {
  const { userId, googleId, title, authors, thumbnail, previewLink } = req.body;
  const newBook = new Book({ userId, googleId, title, authors, thumbnail, previewLink, progress: 0 });
  await newBook.save();
  res.json(newBook);
});

app.get('/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  const books = await Book.find({ userId });
  res.json(books);
});

app.put('/progress/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const { progress } = req.body;
  const book = await Book.findById(bookId);
  if (book) {
    book.progress = progress;
    await book.save();
    res.json(book);
  } else {
    res.status(404).send('Book not found');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
