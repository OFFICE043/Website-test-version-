const $ = (q) => document.querySelector(q);
const api = (path, opts={}) => fetch(path, opts).then(r=>r.json());

const animeGrid = $('#animeGrid');
const detail = $('#detail');
const playerWrap = $('#playerWrap');
const video = $('#video');
const progress = $('#progress');
const volume = $('#volume');
const btnPlay = $('#btnPlay');
const btnMinus = $('#btnMinus');
const btnPlus = $('#btnPlus');
const btnMute = $('#btnMute');
const btnFull = $('#btnFull');
const qualitySel = $('#quality');

let currentUser = null;
let currentSources = []; // [{url,quality}]
let durationKnown = false;

// ---- Auth (demo) ----
$('#btnRegister').onclick = async ()=>{
  const username = $('#username').value.trim();
  const password = $('#password').value.trim();
  if(!username || !password){ $('#authMsg').textContent='Ism/parol kiriting'; return; }
  const res = await api('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
  if(res.error) { $('#authMsg').textContent=res.error; return; }
  currentUser = res;
  $('#userbox').style.display='none';
  $('#logged').style.display='flex';
  $('#who').textContent=res.username;
};

$('#btnLogin').onclick = async ()=>{
  const username = $('#username').value.trim();
  const password = $('#password').value.trim();
  const res = await api('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
  if(res.error){ $('#authMsg').textContent=res.error; return; }
  currentUser = res;
  $('#userbox').style.display='none';
  $('#logged').style.display='flex';
  $('#who').textContent=res.username;
};

$('#btnLogout').onclick = ()=>{
  currentUser = null;
  $('#logged').style.display='none';
  $('#userbox').style.display='flex';
  $('#who').textContent='';
};

// ---- Load anime list ----
async function loadAnime(){
  const list = await api('/api/anime');
  animeGrid.innerHTML = '';
  list.forEach(a=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <img src="${a.poster || ''}" alt="${a.title}">
      <div class="ct">
        <h4>${a.title}</h4>
        <p>${a.description || ''}</p>
      </div>`;
    card.onclick = ()=> openAnime(a);
    animeGrid.appendChild(card);
  });
}

async function openAnime(a){
  $('#animeTitle').textContent = a.title;
  detail.style.display='block';
  playerWrap.style.display='none';
  const eps = await api(`/api/anime/${a.id}/episodes`);
  const box = $('#episodes');
  box.innerHTML = '';
  // топтау: сапасы бір эпизод үшін select-те көрсетіледі
  const groups = {};
  eps.forEach(ep=>{
    const key = ep.title.replace(/\s*\(.+\)\s*$/,''); // "1-qism (720p)" → "1-qism"
    groups[key] = groups[key] || [];
    groups[key].push(ep);
  });
  Object.entries(groups).forEach(([title,items])=>{
    const el = document.createElement('div');
    el.className = 'episode';
    const qlist = items.map(i=>i.quality || '—').join(', ');
    el.innerHTML = `
      <div class="meta">
        <strong>${title}</strong>
        <span style="color:#9aa">[${qlist}]</span>
      </div>
      <button class="play">Tomosha qilish</button>
    `;
    el.querySelector('.play').onclick = ()=> startPlay(items);
    box.appendChild(el);
  });
}

function startPlay(items){
  // items: бір эпизодтың бірнеше сапасы
  currentSources = items.map(i=>({url:i.url, quality:i.quality||'—'}));
  // quality select толтыру
  qualitySel.innerHTML = '';
  currentSources.forEach((s,idx)=>{
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = s.quality;
    qualitySel.appendChild(opt);
  });
  // әдепкі — соңғысы (әдетте жоғарғы сапа)
  qualitySel.value = String(currentSources.length-1);
  setSource(currentSources[currentSources.length-1].url);
  playerWrap.style.display='block';
  video.scrollIntoView({behavior:'smooth',block:'center'});
}

function setSource(url){
  video.src = url;
  video.load();
  video.play().catch(()=>{ /* autoplay блокталса — пайдаланушы өзі басады */ });
}

// ---- Player Controls ----
btnPlay.onclick = ()=>{
  if (video.paused) { video.play(); btnPlay.textContent='⏸'; }
  else { video.pause(); btnPlay.textContent='▶'; }
};
btnMinus.onclick = ()=> video.currentTime = Math.max(0, video.currentTime - 10);
btnPlus.onclick = ()=> video.currentTime = Math.min((video.duration||1), video.currentTime + 10);
btnMute.onclick = ()=> { video.muted = !video.muted; btnMute.textContent = video.muted ? '🔇' : '🔊'; };
btnFull.onclick = ()=> {
  if (!document.fullscreenElement) playerWrap.requestFullscreen();
  else document.exitFullscreen();
};
volume.oninput = ()=> video.volume = Number(volume.value);

video.addEventListener('play', ()=> btnPlay.textContent='⏸');
video.addEventListener('pause', ()=> btnPlay.textContent='▶');
video.addEventListener('loadedmetadata', ()=>{
  durationKnown = true;
  progress.value = 0;
});
video.addEventListener('timeupdate', ()=>{
  if(!durationKnown || !video.duration) return;
  progress.value = (video.currentTime / video.duration) * 100;
});
progress.oninput = ()=>{
  if(!video.duration) return;
  video.currentTime = (Number(progress.value)/100) * video.duration;
};

// сапа ауыстыру
qualitySel.onchange = ()=>{
  const src = currentSources[Number(qualitySel.value)];
  const wasPlaying = !video.paused;
  const t = video.currentTime;
  setSource(src.url);
  // шамамен сол уақытқа секіру
  video.addEventListener('loadedmetadata', function once(){
    video.currentTime = t;
    if (wasPlaying) video.play();
    video.removeEventListener('loadedmetadata', once);
  });
};

// Back
$('#btnBack').onclick = ()=>{
  detail.style.display='none';
  playerWrap.style.display='none';
  video.pause();
};

// init
loadAnime();
