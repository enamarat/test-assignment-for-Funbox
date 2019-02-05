
// Функция, которая добавляет новую точку в маршруте
let waypoints = [];
const addNewpoint = () => {
  let inputValue = document.querySelector("#route-point").value;
  const ul = document.querySelector('#pointList');
  /* Функция запустится только в случае, если поле ввода не будет пустым */
  if(inputValue.length > 0) {
    /* Создаётся элемент списка одновременно с кнопкой для его удаления.
    Текстовое содержание элемента становится равным значению, внесённому
    в поле ввода */
    const li = document.createElement('li');
    li.innerHTML = `<button class="delete"> Удалить </button> ${inputValue}`;
    /* Элемент списка вместе со своим содержанием присоединяется к
    неупорядоченному списку, уже существующему на веб-странице */
    ul.appendChild(li);
    /* Текстовое содержание элемента списка добавляется в
    массив waypoints, который затем включается в переменную
    referencePoints*/
    waypoints.push(li.textContent.replace('Удалить', ''));
    // Создание экземпляра маршрута
    createRoute(waypoints);

} // if input.value > 0
  /* Если поле ввода является пустым при нажатии кнопки "Найти",
  функция не запускается, а на экран выходит предупреждение */
  else {
    alert('Вы не ввели адрес!');
  }
  /*После добавления новой точки маршрута строка поиска
  становится пустой, чтобы можно было сразу ввести в неё
  новый адрес */
  document.querySelector("#route-point").value = "";
}


// Функция, которая удаляет элемент списка
const deleteLi = (event) => {
  if (event.target.tagName.toLowerCase() == 'button') {
    let liChosenForDeletion = event.target.parentNode;
    const liArrayIndex = Array.from(document.querySelectorAll('li')).indexOf(event.target.parentNode);
    document.querySelector('#pointList').removeChild(liChosenForDeletion);
    waypoints.splice(liArrayIndex, 1);

/* Весь маршрут на карте удаляется целиком, после чего
 на API подаётся запрос на формирование нового маршрута,
 который уже не будет содержать удалённый адрес из списка */
  deleteRoute();
  createRoute(waypoints);
  }
}

/* Запустить функцию по добавлению новой точки можно и с
помощью клавиши Enter, если она нажата*/
const hitEnter = (event) => {
  if (event.key === "Enter" ) {
    addNewpoint();
  }
}

/* Функция, перерисовывающая маршрут при перетягивании
 точек в списке */
const changeRouteWhenOrderisChanged = (event) => {
  const li = Array.from(document.querySelectorAll('li'));
/* Для события update элементом, вызывающим его (event.target),
является unordered list (ul). Чтобы обработчик события срабатывал
только на элементах списка и нигде больше, ставим условием его
активации то, что первым ребёнком event.target lдолжен быть
 list item (li). Далее полностью опустошаем массив waypoint
 и наполняем его элементами списка заново, но уже в новом порядке,
 слодившимся после перетягивания списка */
  if (event.target.firstElementChild.tagName.toLowerCase() == "li") {
      waypoints = [];
      li.forEach(item => {waypoints.push(item.textContent.replace('Удалить', ''))});
      deleteRoute();
      createRoute(waypoints);
  }
}

/*********************Перетаскивание элементов списка мышью**********/
/* Код по перетягиванию элементов заимствован
 из https://github.com/SortableJS/Sortable */
let el = document.getElementById('pointList');
let sortable = Sortable.create(el);

// Слушатели событий
const button = document.querySelector('#add');
button.addEventListener('click', addNewpoint);
document.addEventListener('keypress', hitEnter);
document.querySelector('#pointList').addEventListener('click', deleteLi);
document.addEventListener('update', changeRouteWhenOrderisChanged);
