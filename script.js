// Current user
let currentUser = localStorage.getItem('currentUser') || null;

// Elements
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');
const logoutBtn = document.getElementById('logout');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMsg = document.getElementById('auth-msg');

const animeList = document.getElementById('anime-list');
const animeView = document.getElementById('anime-view');
const animeTitle = document.getElementById('anime-title');
const animeImg = document.getElementById('anime-img');
const animeVideo = document.getElementById('anime-video');
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const addCommentBtn = document.getElementById('add-comment');
const backBtn = document.getElementById('back');

// Users
function getUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }
function saveUsers(users){ localStorage.setItem('users', JSON.stringify(users)); }

// Sample anime data
const animeData = [
  {id:1, title:"Naruto", img:"https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg", video:"https://www.youtube.com/embed/1H9bj7E0wFI", genre:"Action", comments:[]},
  {id:2, title:"One Piece", img:"https://upload.wikimedia.org/wikipedia/en/6/65/OnePiece62Cover.png", video:"https://www.youtube.com/embed/mQsfI-M5n7s", genre:"Adventure", comments:[]},
  {id:3, title:"Attack on Titan", img:"https://upload.wikimedia.org/wikipedia/en/7/79/Attack_on_Titan_manga_volume_1.jpg", video:"https://www.youtube.com/embed/MkJDBk7jXo4", genre:"Action", comments:[]},
  {id:4, title:"Demon Slayer", img:"https://upload.wikimedia.org/wikipedia/en/3/3f/Kimetsu_no_Yaiba_Volume_1.jpg", video:"https://www.youtube.com/embed/2qQfJv0aC_s", genre:"Fantasy", comments:[]},
  {id:5, title:"Jujutsu Kaisen", img:"https://upload.wikimedia.org/wikipedia/en/0/0b/Jujutsu_Kaisen_Volume_1.png", video:"https://www.youtube.com/embed/wX1nWzOZ33k", genre:"Action", comments:[]}
];

// Init App
function initApp(){
  if(!currentUser){
    document.getElementById('auth').style.display='flex';
    document.querySelector('header').style.display='none';
    animeList.style.display='none';
    animeView.style.display='none';
  } else {
    document.getElementById('auth').style.display='none';
    document.querySelector('header').style.display='flex';
    showAnimeList();
  }
}

// Register
registerBtn.onclick = ()=>{
  const users = getUsers();
  if(users.find(u=>u.username===usernameInput.value)){
    authMsg.innerText="Foydalanuvchi nomi band"; return;
  }
  const role = (usernameInput.value==='admin' && passwordInput.value==='1415') ? 'admin' : 'user';
  users.push({username:usernameInput.value, password:passwordInput.value, role:role});
  saveUsers(users);
  localStorage.setItem('currentUser', usernameInput.value);
  currentUser = usernameInput.value;
  initApp();
}

// Login
loginBtn.onclick = ()=>{
  const users = getUsers();
  const user = users.find(u=>u.username===usernameInput.value && u.password===passwordInput.value);
  if(user){
    localStorage.setItem('currentUser', user.username);
    currentUser = user.username;
    initApp();
  } else authMsg.innerText="Noto‘g‘ri foydalanuvchi nomi yoki parol";
}

// Logout
logoutBtn.onclick = ()=>{
  localStorage.removeItem('currentUser');
  currentUser = null;
  initApp();
}

// Show anime list
function showAnimeList(){
  animeList.innerHTML='';
  animeList.style.display='grid';
  animeView.style.display='none';
  animeData.forEach(a=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `<img src="${a.img}" alt="${a.title}"><h3>${a.title}</h3><p>${a.genre}</p><button onclick="viewAnime(${a.id})">Ko'rish</button>`;
    animeList.appendChild(card);
  });
}

// View anime
window.viewAnime = function(id){
  const anime = animeData.find(a=>a.id===id);
  animeList.style.display='none';
  animeView.style.display='block';
  animeTitle.innerText = anime.title;
  animeImg.src = anime.img;
  animeVideo.src = anime.video;
  updateComments(anime);
  addCommentBtn.onclick = ()=>{
    if(commentInput.value.trim()!==''){
      const timestamp = new Date().toLocaleString();
      anime.comments.push(commentInput.value.trim() + " ("+timestamp+")");
      commentInput.value='';
      updateComments(anime);
    }
  }
}

// Update comments
function updateComments(anime){
  commentList.innerHTML='';
  anime.comments.forEach(c=>{
    const div = document.createElement('div');
    div.className='comment';
    div.innerText = c;
    commentList.appendChild(div);
  });
}

// Back button
backBtn.onclick = ()=>{
  animeVideo.src='';
  showAnimeList();
}

// Init
initApp();
