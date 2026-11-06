const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ---------- In-memory "database" ----------
let posts = [
  {
    id: 1,
    title: 'Welcome to Simple Blog',
    content:
      'This is your first post. You can edit or delete it, or create a new one using the form on the home page.',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  },
];

let nextId = 2;

// ---------- Helper ----------
const today = () =>
  new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// ---------- Routes ----------

// Home – list all posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Create form
app.get('/create', (req, res) => {
  res.render('create');
});

// Create handler
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    posts.push({
      id: nextId++,
      title: title.trim(),
      content: content.trim(),
      date: today(),
    });
  }
  res.redirect('/');
});

// Edit form
app.get('/edit/:id', (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.redirect('/');
  res.render('edit', { post });
});

// Edit handler
app.post('/edit/:id', (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (post) {
    post.title = req.body.title.trim();
    post.content = req.body.content.trim();
  }
  res.redirect('/');
});

// Delete handler
app.post('/delete/:id', (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  res.redirect('/');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).redirect('/');
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Simple Blog running at http://localhost:${PORT}`);
});