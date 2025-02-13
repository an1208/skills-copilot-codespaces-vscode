// Create web server
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, 'data/comments.json');

// Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occured');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/comments', (req, res) => {
  const { author, comment } = req.body;
  if (!author || !comment) {
    res.status(400).send('Author and comment are required');
    return;
  }

  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occured');
      return;
    }

    const comments = JSON.parse(data);
    comments.push({ author, comment });

    fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
      if (err) {
        res.status(500).send('An error occured');
        return;
      }
      res.send('Comment added');
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});