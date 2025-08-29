-- Users (қарапайым демо, пароль plain — нақты жобада хэш керек)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' -- 'user' | 'admin'
);

-- Anime
CREATE TABLE IF NOT EXISTS anime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  poster TEXT  -- карточка суреті (URL)
);

-- Episodes (әр эпизодқа URL; сапа болса, бөлек қатарлармен сақтауға болады)
CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,      -- mp4/m3u8 тікелей сілтеме
  quality TEXT,           -- '240p'|'480p'|'720p'|'1080p' (қаласаң бос қалдырасың)
  FOREIGN KEY(anime_id) REFERENCES anime(id) ON DELETE CASCADE
);

-- Демо деректер
INSERT OR IGNORE INTO users (username,password,role) VALUES
('Admin1','anilordtv.site','admin');

INSERT OR IGNORE INTO anime (id,title,description,poster) VALUES
(1,'Naruto','Ninja hikoyalari','https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg');

INSERT OR IGNORE INTO episodes (anime_id,title,url,quality) VALUES
(1,'1-qism (240p)','https://archive.org/download/sample-mp4-file/sample_640x360.mp4','240p'),
(1,'1-qism (720p)','https://archive.org/download/sample-mp4-file/sample_960x540.mp4','720p');
