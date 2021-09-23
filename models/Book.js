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

module.exports = Book;