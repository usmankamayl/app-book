const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const fileMiddleware = require('../middleware/file');

const stor = {
    books: [],
};

[1, 2, 3].map(el => {
  const newBook = new Book( `title ${el}`, `desc book ${el}`, `authors ${el}`, `favorite ${el}`, `fileCover ${el}`, `fileName ${el}`);
  stor.books.push(newBook);
});

router.get('/', (req, res) => {
  const {books} = stor;
  res.json(books);
});

// router.get('/create', (req, res) => {
//   res.render("book/create", {
//       title: "Book | create",
//       books: {},
//   });
// });

// router.post('/create', (req, res) => {
//   const {books} = stor;
//   const {title, desc} = req.body;

//   const newBook = new Book(title, desc);
//   books.push(newBook);

//   res.redirect('/book')
// });

router.get('/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
      res.json(books[idx]);
  } else {
    res.status(404);
    res.json("book | not found");
  }
});

router.post('/', (req, res) => {
  const {books} = stor;
  const {title, desc, authors, favorite, fileCover, fileName} = req.body;

  const newBook = new Book(title, desc, authors, favorite, fileCover, fileName);
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});


router.put('/:id', (req, res) => {
  const {books} = stor;
  const {title, desc, authors, favorite, fileCover, fileName} = req.body;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
      books[idx] = {
          ...books[idx],
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
      res.json("book | not found");
  }
});


router.delete('/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
      books.splice(idx, 1);
      res.json(true);
  } else {
      res.status(404);
      res.json("book | not found");
  }
});



// загрузка файлов
router.post('/upload-book', fileMiddleware.single('book'), (req, res) => {
  if (req.file) {
    const {path} = req.file;
    const {books} = stor;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;
    const newBook= new Book(title, desc, authors, favorite, fileCover, fileName );
    newBook.fileBook = path;
    books.push(newBook);
    res.json(newBook);
      res.json(path);
  } else {
      res.json(null);
  }
});

router.get('/:id/download-book', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);
  if (idx !== -1) {
      res.download(`${books[idx].fileBook}`, 'book', err=>{
          if (err){
              res.status(404).json();
          }
      });
  } 
 
});

module.exports = router;  