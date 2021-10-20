const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const redis = require('redis');
const PORT = process.env.PORT || 3002;
const REDIS_URL = process.env.REDIS_URL || 'redis';
const client = redis.createClient(`redis://${REDIS_URL}`);
const fileMiddleware = require('../middleware/file');
const fs = require('fs');

let counters = [];
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


router.get('/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;

client.incr(id, (err, rep) => {
    if(err) {
      res.status(500).json({error: 'Redis error'});
    } else {
      console.log(`request received! from ${id}, counter = ${rep}`);

       res.send(
        `<h1>request received! from ${id}, counter = ${rep}</h1>`
      );
    }

    const idx = books.findIndex(el => el.id === id);
    if (idx !== -1) {
        const id = books[idx].id;
        const idx2 =counters.findIndex(el => el.id === id);
        if (idx2 !== -1) {
          counters[idx2] = {id, rep};
        } else {
          counters.push({id, rep});
        }
        const db = JSON.stringify(counters);
        fs.writeFile('counter/db.json', db, (err) => {
          if (err) {
            console.error(err)
            return
          }
          //файл записан успешно
        })
        console.log(counters);
    } else {
      res.status(404);
      res.json("book | not found");
    }
  })

  
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