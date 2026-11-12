
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- In-memory database ----------

let posts = [
  {
    id: 1,
    title: 'Welcome to My Blog',
    content: 'Welcome to my blog! This is my first sample post. You can read posts on the home page and create new posts using the separate Create Post page.',
    date: new Date(2026, 10, 5).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
];

let nextId = 2;

// ---------- Helper function ----------

const today = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ---------- HOME PAGE ----------

app.get('/', (req, res) => {
  res.render('index', { posts });
});

// ---------- CREATE POST ----------

// Display create post page
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle new post submission
app.post('/create', (req, res) => {
  const { title, content } = req.body;

  // Validate title and content
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send(
      'Title and content cannot be empty or contain only spaces.'
    );
  }

  // Create new post
  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    date: today(),
  };

  posts.push(newPost);

  res.redirect('/');
});

// ---------- EDIT POST ----------

// Display edit post page
app.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const post = posts.find((p) => p.id === id);

  // Check whether post exists
  if (!post) {
    return res.status(404).send('Post not found.');
  }

  res.render('edit', { post });
});

// Handle post update
app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const post = posts.find((p) => p.id === id);

  // Check whether post exists
  if (!post) {
    return res.status(404).send('Post not found.');
  }

  const { title, content } = req.body;

  // Validate title and content
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send(
      'Title and content cannot be empty or contain only spaces.'
    );
  }

  // Update post
  post.title = title.trim();
  post.content = content.trim();

  res.redirect('/');
});

// ---------- DELETE POST ----------

app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const postExists = posts.some((p) => p.id === id);

  // Check whether post exists
  if (!postExists) {
    return res.status(404).send('Post not found.');
  }

  // Delete post
  posts = posts.filter((p) => p.id !== id);

  res.redirect('/');
});

// ---------- 404 ERROR HANDLER ----------

app.use((req, res) => {
  res.status(404).send('Page not found');
});

// ---------- START SERVER ----------

app.listen(PORT, () => {
  console.log(`My Blog is running at http://localhost:${PORT}`);
});
