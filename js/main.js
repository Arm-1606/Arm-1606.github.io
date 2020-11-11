//? когда сайт загрузился
window.onload = function() {
  //? находим DOM элементы
  const $rulesCard = document.querySelector('.game__rules')
  const $startGameButton = $rulesCard.querySelector('.game__rules-button')
  const $cardTitle = $rulesCard.querySelector('.game__rules-title')
  const $game = document.querySelector('.game__container')
  const $bottles = $game.querySelectorAll('.bottle')
  const $paperBall = $game.querySelector('.paper-ball')
  const $timer = $game.querySelector('.timer')

  const defaultBottleCounter = 6
  const defaultTime = 30

  let bottlesSize = []
  let bottleCounter = defaultBottleCounter
  let time = defaultTime

  //? по клику на кнопку "Старт" начать игру
  $startGameButton.addEventListener('click', startGame)

  function startGame() {
    //? скрываем карточку с правилами
    $rulesCard.style.opacity = '0'
    //? показываем игру
    $game.style.display = 'flex'

    //? сбрасываем время и количество бутылок до значений по умолчанию
    bottleCounter = defaultBottleCounter
    time = defaultTime

    //? получаем позиции бутылок
    getBottlesSeze()

    //? каждую секунду...
    const intervalId = setInterval(() => {
      //? если есть время и бутылки
      if (time && bottleCounter) {
        //? уменьшаем оставшееся время и выводим его
        time -= 1
        $timer.innerText = time
        //? иначе
      } else {
        //? если бутылки остались
        if (bottleCounter) {
          //? сбрасываем время и количество бутылок до значений по умолчанию
          bottleCounter = defaultBottleCounter
          time = defaultTime
          $timer.innerText = time

          //? меняем текст в правилах
          $cardTitle.innerText = 'Попробуйте ещё раз'
          //? скрываем игру и показываем правила
          $rulesCard.style.opacity = '1'
          $game.style.display = 'none'
          //? проходимся по всем бутылкам и показываем их
          $bottles.forEach(function($bottle) {
            $bottle.style.opacity = '1'
          })
          //? если бутылки закончились
        } else {
          //? отправить пользователя на страницу с поздравлением
          document.location.href = "/congratulation";
        }
        //? прервать интервал
        clearInterval(intervalId);
      }
    }, 1000);
  }

  //? привязываем к событиям с комком бумаги соответствующие функции
  $paperBall.ondragstart = dragstart
  $paperBall.ondragend = dragend
  $paperBall.ontouchmove = ontouchmove
  $paperBall.ontouchend = ontouchend

  //? проходимся по всем бутылках
  $bottles.forEach(function($bottle) {
    //? разрешаем бросать в бутылки
    $bottle.ondragover = allowDrop
    //? привязываем функцию к броску в бутылку
    $bottle.ondrop = drop
  })

  //? функция для получения размеров бутылок
  function getBottlesSeze() {
    bottlesSize = []
    $bottles.forEach(function($bottle) {
      bottlesSize.push({
        top: $bottle.offsetTop,
        left: $bottle.offsetLeft,
        right: $bottle.offsetLeft + $bottle.clientWidth,
        bottom: $bottle.offsetTop + $bottle.clientHeight
      })
    })
  }

  //? функция для позиционирования комка бумаги при его перемещении
  function ontouchmove(event) {
    //? получаем из события текущие координацы
    const coordY = event.targetTouches[0].pageY
    const coordX = event.targetTouches[0].pageX
    //? привязываем координаты к стилям
    $paperBall.style.top = coordY + 'px'
    $paperBall.style.left = coordX + 'px'
  }

  //? функция для прекращения перемещения комка бумаги
  function ontouchend(event) {
    //? получаем из события текущие координацы
    const coordY = event.changedTouches[0].pageY
    const coordX = event.changedTouches[0].pageX

    //? проходимся по размерам бутылок
    bottlesSize.forEach(function(size, index) {
      //? если позиция комка бумаги находится между краями блока с бутылкой
      if (coordY > size.top
        && coordY < size.bottom
        && coordX > size.left
        && coordX < size.right){
          //? скрываем бутылку, меняем счётчик, возвращаем комок бумаги на место
          $bottles[index].style.opacity = '0'
          bottleCounter -= 1
          $paperBall.style.top = '90%'
          $paperBall.style.left = '90%'
      }
    })
  }

  //? фенкия для разрешения броска в блок
  function allowDrop(event) {
    event.preventDefault();
  }

  //? функция для броска
  function drop(event) {
    //? скрываем элемент, в который попали
    event.target.style.opacity = '0'
    //? меняем счётчик
    bottleCounter -= 1
  }

  //? событие для начала перемещения
  function dragstart(event) {
    //? чтоб исчез только компонент, но остался дублекат, выполняем скрытие элемента с задержкой
    setTimeout(() => {
      //? скрываес перемещаемый элемент
      event.target.style.display = 'none'
    }, 0);
  }

  //? аункция для прекращения перемещения
  function dragend(event) {
    //? делаем компонент видимым
    event.target.style.display = 'block'
  }
}