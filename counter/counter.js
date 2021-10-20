const express = require('express');
const router = express.Router();
const fs = require('fs');

let counters = [];


router.post('/counter/:id/incr', (req, res) => {
  fs.readFile('counter/db.json', (err, data) => {
    if (err) throw err;
     counters = JSON.parse(data);
    console.log(counters);
  });
  const {id} = req.params;

   const idx = counters.findIndex(el => el.id === id);
   if (idx !== -1) {     
      res.json(counters[idx].rep);
   } else {
     res.status(404);
     res.json("book | not found");
  }
  
})

router.get('/counter/:id', (req, res) => {
  const {id} = req.params;
  const idx = counters.findIndex(el => el.id === id);
  if (idx !== -1) {     
    res.json({
      "message": `request received! from ${id}`, "cnt": rep
    });
  } else {
    res.status(404);
    res.json("book | not found");
  }
    
})

module.exports = router;