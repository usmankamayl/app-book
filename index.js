const express = require('express');
const nodemon = require('nodemon');
const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');
const app = express();
app.use(express.json());

app.use(loggerMiddleware);

app.use('/public', express.static(__dirname+"/public"));

app.use('/', indexRouter);
app.use('/api/book', bookRouter);

app.use(errorMiddleware);

app.listen(3000, () => console.log("server start on 3000"));