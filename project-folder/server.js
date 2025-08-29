const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // фронт файлы

const DB_FILE = './data.db';
const db = new sqlite3.Database(DB_FILE);

// Бірінші іске қосқанда schema.sql орындау
if (!fs.existsSync(DB_FILE) || process.env.REINIT === '1') {
  const schema = fs.readFileSync('./schema.sql', 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error('Schema error:', err.message);
    else console.log('DB initialized.');
  });
}

// -------- Auth (демо) --------
// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'username/password required'});
  // Admin logic: Admin1..Admin10 + anilordtv.site
  let role = 'user';
  const m = username.match(/^Admin([1-9]|10)$/);
  if (m && password === 'anilordtv.site') role='admin';

  db.run('INSERT INTO users(username,password,role) VALUES(?,?,?)',
    [username, password, role],
    function(err){
      if(err) return res.status(400).json({error: 'Username already taken'});
      res.json({id:this.lastID, username, role});
    });
});

// Login
app.post('/api/login', (req,res)=>{
  const { username, password } = req.body;
  db.get('SELECT id,username,role FROM users WHERE username=? AND password=?',
    [username, password], (err,row)=>{
      if (err) return res.status(500).json({error:'db error'});
      if (!row) return res.status(401).json({error:'invalid credentials'});
      res.json(row); // prod-та JWT берген дұрыс
    });
});

// -------- Anime & Episodes --------
// Барлығын алу (қысқа карточка)
app.get('/api/anime', (req,res)=>{
  db.all('SELECT id,title,description,poster FROM anime ORDER BY id DESC', [], (err,rows)=>{
    if (err) return res.status(500).json({error:'db error'});
    res.json(rows);
  });
});

// Бір анименің эпизодтары
app.get('/api/anime/:id/episodes', (req,res)=>{
  db.all('SELECT id,title,url,quality FROM episodes WHERE anime_id=? ORDER BY id', [req.params.id], (err,rows)=>{
    if (err) return res.status(500).json({error:'db error'});
    res.json(rows);
  });
});

// (Қалауынша) Админге аниме/эпизод қосу — демо (нақтыда auth тексеру керек)
app.post('/api/anime', (req,res)=>{
  const { title, description, poster } = req.body;
  db.run('INSERT INTO anime(title,description,poster) VALUES(?,?,?)',
    [title, description||'', poster||''],
    function(err){
      if (err) return res.status(500).json({error:'db error'});
      res.json({id:this.lastID});
    });
});

app.post('/api/episodes', (req,res)=>{
  const { anime_id, title, url, quality } = req.body;
  if(!anime_id || !title || !url) return res.status(400).json({error:'anime_id/title/url required'});
  db.run('INSERT INTO episodes(anime_id,title,url,quality) VALUES(?,?,?,?)',
    [anime_id, title, url, quality||null],
    function(err){
      if (err) return res.status(500).json({error:'db error'});
      res.json({id:this.lastID});
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on http://localhost:'+PORT));
