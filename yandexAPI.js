var myMap = null;

// Инициализация карты
function init(){
        myMap = new ymaps.Map("map", {
        center: [55.607020, 37.531474],
        zoom: 15,
        controls: []
    });

    myMap.controls.add('zoomControl');
} //init
ymaps.ready(init);


// Функция по созданию маршрута
const createRoute = (referencePoints) => {
  /*Если на карте уже были какие-либо метки, они удаляются
   во избежание их дублирования */
  myMap.geoObjects.removeAll();

 // Создание нового маршрута
  var multiRoute = new ymaps.multiRouter.MultiRoute({
   // Точки маршрута.
   // Обязательное поле.
   referencePoints: referencePoints
   }, {
   // Автоматически устанавливать границы карты так,
   // чтобы маршрут был виден целиком.
   boundsAutoApply: true
  });

  /* Включение режима редактирования - теперь
  маркеры можно перемещать по карте */
  multiRoute.editor.start();


  // Функция настройки внешнего вида маршрутной точки
  const customizePoint = (number) => {
        /**
         * Ждем, пока будут загружены данные мультимаршрута и созданы отображения путевых точек.
         * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel-docpage/#event-requestsuccess
         */
        multiRoute.model.events.once("requestsuccess", function () {
            var yandexWayPoint = multiRoute.getWayPoints().get(number);
            // Создаем балун у метки второй точки.
            ymaps.geoObject.addon.balloon.get(yandexWayPoint);
            yandexWayPoint.options.set({
                preset: "islands#brownIcon",
                iconContentLayout: ymaps.templateLayoutFactory.createClass(
                    `${number+1}`
                ),
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    '{{ properties.address|raw }}'
                )
            });
        });
    }
 // Зададим внешний вид каждой точке с помощью петли
  for (let i = 0; i < referencePoints.length; i++) {
    customizePoint(i);
  }

  // Добавление маршрута на карту.
  myMap.geoObjects.add(multiRoute);
}

// Функция по удалению метки
const deleteRoute = () => {
  let collectionToDelete = new ymaps.GeoObjectCollection();
  collectionToDelete.add(myMap.geoObjects.get(0));
  collectionToDelete.removeAll();
}
