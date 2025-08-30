const tg = Telegram.WebApp;
tg.ready();

// Список ID админов
const ADMINS = [7575041003 , 6486825926];

// ID пользователя
const userId = tg.initDataUnsafe?.user?.id;
const user = tg.initDataUnsafe?.user;
const firstName = user?.first_name || "Mehmon";
// Сайты
const SEARCH_URL = "./Search/search.html"; // твой сайт поиска
const ADD_URL    = "./add/add.html";    // твой сайт добавления


if (ADMINS.includes(userId)) {
    // Админ — спрашиваем
    document.body.innerHTML = `
        <h2>Salom, ${firstName}!</h2>
        <p>nima qilamiz?</p>
        <button id="watch">Anime ko'rish</button>
        <button id="add">Anime qo'shish</button>
    `;
    document.getElementById("watch").onclick = () => location.href = SEARCH_URL;
    document.getElementById("add").onclick = () => location.href = ADD_URL;
} else {
    // Обычный пользователь — сразу в поиск
    location.href = SEARCH_URL;
}