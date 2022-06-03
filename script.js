// слайдер с проектами
const slides = document.querySelectorAll('.slide')

for (const slide of slides) {
    slide.addEventListener('click', () => {
        clearActiveClasses()

        slide.classList.add('active')
    })
}

function clearActiveClasses() {
    slides.forEach((slide) => {
        slide.classList.remove('active')
    })
}

//кнопка вверх
let smoothJumpUp = function() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        window.scrollBy(0,-100);
        setTimeout(smoothJumpUp, 50);
    }
}

window.onscroll = function() {
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 100) {
    document.getElementById('upbutton').style.display = 'block';
    } else {
    document.getElementById('upbutton').style.display = 'none';
    }
}

// дата в футере
let footer = document.querySelector('.footer');
let userTitle = document.querySelector('.title');

let currentDate = document.createElement('span');

// функция добавления ведущих нулей (если число меньше десяти, перед числом добавляем ноль)
function plusZero(value) {
    if (value < 10) { value='0' + value; }
    return value;
}
//функция получения текущей даты
function date() {
    let now = new Date();
    let day = plusZero(now.getDate());
    let month = plusZero(now.getMonth()+1);
    let year = plusZero(now.getFullYear());
    return day+"."+month+"."+year;
}


let url = window.location.toString(); // объект window.location предоставляет информацию о текущем адресе страницы (URL)

// получение гитхаб юзера
function getUser(url) {
    let name = url.split('=')[1];
    if (name === undefined) { name = 'EllieOllie'; }
    return name;
}
let githubUser = `https://api.github.com/users/${getUser(url)}`;


//промисы
let day = new Promise((resolve, reject) => {
    setTimeout(() => date ? resolve(currentDate.innerHTML = date()) : reject('Error, date not defined!'), 0)
});

let user = new Promise((resolve, reject) => {
    setTimeout(() => githubUser ? resolve(githubUser) : reject('Error, user not found!'), 0)
})

Promise.all([user, day])
.then(([githubUser, date]) => fetch(githubUser))
.then(response => response.json())
.then(json => {

    let img = new Image();
    img.src = json.avatar_url;
    userTitle.append(img);
    img.classList.add('avatar');
    img.style = 'width:200px; heigth:200px; cursor: pointer';
    img.addEventListener('click', () => window.location = json.html_url)

    let name = document.createElement('h1');
    if (json.name != null) {
        name.innerHTML = json.name;
    } else {
        name.innerHTML = 'Error, user not found!';
    }
    userTitle.append(name);
    name.classList.add('title__name');

    let bio = document.createElement('h3');
    if (json.bio != null) {
        bio.innerHTML = json.bio;
    } else {
        bio.innerHTML = 'No description!';
    }
    userTitle.append(bio);
    bio.classList.add('title__profession');


    footer.append(currentDate);

    }).catch(err => document.body.innerHTML = ('Sorry, it\'s error!'));
