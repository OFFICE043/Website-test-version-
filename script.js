let currentUser = localStorage.getItem('currentUser') || null;

const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const msg = document.getElementById('auth-msg');

const animeList = document.getElementById('anime-list');
const animeView = document.getElementById('anime-view');
const animeTitle = document.getElementById('anime-title');
const animeImg = document.getElementById('anime-img');
const animeVideo = document.getElementById('anime-video');
const commentList = document.getElementById('comment-list');
const commentInput = document.getElementById('comment-input');
const addCommentBtn = document.getElementById('add-comment');
const backBtn = document.getElementById('back');
const searchInput = document.getElementById('search');
const body = document.body;

// Users
function getUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }
function saveUsers(users){ localStorage.setItem('users', JSON.stringify(users)); }

const animeData = [
  {id:1, title:"Naruto", img:"https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg", video:"https://www.youtube.com/embed/1H9bj7E0wFI", genre:"Action", comments:[]},
  {id:2, title:"One Piece", img:"https://upload.wikimedia.org/wikipedia/en/6/65/OnePiece62Cover.png", video:"https://www.youtube.com/embed/mQsfI-M5n7s", genre:"Adventure", comments:[]},
  {id:3, title:"Attack on Titan", img:"https://upload.wikimedia.org/wikipedia/en/7/79/Attack_on_Titan_manga_volume_1.jpg", video:"https://www.youtube.com/embed/MkJDBk7jXo4", genre:"Action", comments:[]},
  {id:4, title:"Demon Slayer", img:"https://upload.wikimedia.org/wikipedia/en/3/3f/Kimetsu_no_Yaiba_Volume_1.jpg", video:"https://www.youtube.com/embed/2qQfJv0aC_s", genre:"Fantasy", comments:[]},
  {id:5, title:"Jujutsu Kaisen", img:"https://upload.wikimedia.org/wikipedia/en/0/0b/Jujutsu_Kaisen_Volume_1.png", video:"https://www.youtube.com/embed/wX1nWzOZ33k", genre:"Action", comments:[]}
];

// Authentication
function initApp(){
  if(!currentUser){
    document.getElementById('auth').style.display='flex';
    return;
  }
  document.getElementById('auth').style.display='none';
  document.querySelector('header').style.display='flex';
  showAnimeList();
}

registerBtn.onclick = ()=>{
  const users = getUsers();
  if(users.find(u=>u.username===usernameInput.value)){ msg.innerText="Foydalanuvchi nomi band"; return; }
  users.push({username:usernameInput.value, password:passwordInput.value});
  saveUsers(users);
  localStorage.setItem('currentUser', usernameInput.value);
  currentUser = usernameInput.value;
  initApp();
}

loginBtn.onclick = ()=>{
  const users = getUsers();
  const user = users.find(u=>u.username===usernameInput
