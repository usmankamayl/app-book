const express = require('express');
const {v4: uuid} = require('uuid');

class Book {
  constructor(title = "", desc = "", authors = "", favorite = "", fileCover = "", fileName = "", id = uuid()) {
      this.title = title;
      this.desc = desc;
      this.authors = authors;
      this.favorite = favorite;
      this.fileCover = fileCover;
      this.fileName = fileName;
      this.id = id;
  }
}

const books = [];

[1, 2, 3].map(el => {
  const newBook = new Book( `title ${el}`, `desc book ${el}`, `authors ${el}`, `favorite ${el}`, `fileCover ${el}`, `fileName ${el}`);
  books.push(newBook);
});

const app = express();
app.use(express.json());

app.get('/api/books/', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
      res.json(books[idx]);
  } else {
      res.status(404);
      res.json("books | not found");
  }
});

app.post('/api/books/', (req, res) => {
  const {title, desc, authors, favorite, fileCover, fileName} = req.body;

  const newBook = new Book(title, desc, authors, favorite, fileCover, fileName);
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const {title, desc, authors, favorite, fileCover, fileName} = req.body;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books[idx] = {
          ...books[idx],
          id,
          title,
          desc,
          authors,
          favorite,
          fileCover,
          fileName
      };
      res.json(books[idx]);
  } else {
      res.status(404);
      res.json("books | not found");
  }
});

app.delete('/api/books/:id', (req, res) => {
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
      res.json(true);
  } else {
      res.status(404);
      res.json("books | not found");
  }
});

app.post('/api/user/login', (reg, res) => {
  res.status(201);
  res.json({
    "id": 1,
    "mail": "test@mail.ru"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})