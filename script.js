//Данные
const CITY_API = 'database/cities.json',
      PROXY = 'https://cors-anywhere.herokuapp.com/',
      API_KEY='59b2326ef4e36e05010ba16e70acb7fe',
      CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
      MAX_COUNT = 10;
let city = [];

//Переменные
//Получаем элементы разметки
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets');


//Функции
const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
       callback(request.response); 
    } else {
      console.error(request.status);
    }
  });

  request.send();
};

  //Фильтр и вывод городов в зависимости от ввода пользователя
const showCity = (input, list) => {
  list.textContent = '';
    //Проверка, пустой ли инпут, если да, функция не выполняется
   if (input.value === '') {
    return;
   }
  const filterCity = city.filter((item) => {
    const fixItem = item.name.toLowerCase();
    return fixItem.startsWith(input.value.toLowerCase());
  });

  //Добавляем элементы li в .dropdown__city
  filterCity.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item.name;
    list.append(li);
  });
};

const selectCity = (event, input, list) => {
  const target = event.target;
  if(target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};
//Получаем корректное название города
const getNameCity = (code) => {
  const objCity = city.find(item => item.code === code);
  return objCity.name;
};
//Получаем количество пересаок
const getChanges = num => {
  if (num) {
    return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
};
//Получем корректный вид даты вылета
const getDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

//Формируем ссылку
const getLinkAviasales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;

  const date = new Date(data.depart_date);

  const day = date.getDate();

  link += day < 10 ? '0' + day : day;

  const month = date.getMonth() + 1;

  link += month < 10 ? '0' + month : month;
  link += data.destination;
  link += '1';

  return link;
};


const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';
  //Вставляем вёрстку с результатами поиска
  if (data){
    deep = `
      <h3 class="agent">${data.gate}</h3>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
            за ${data.value}₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города
              <span class="city__name">${getNameCity(data.origin)}</span>
            </div>
            <div class="date">${getDate(data.depart_date)}</div>
          </div>
      
          <div class="block-right">
            <div class="changes">${getChanges(data.number_of_changes)}</div>
            <div class="city__to">Город назначения:
              <span class="city__name">${getNameCity(data.destination)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }else {
      deep = '<img src="img/no_tickets.jpg" alt="Билетов нет">';
    }
  
  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
  
  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самый дешевый билет на другие даты</h2>';

  //Сортировка по цене по возрастанию
  cheapTickets.sort((a, b) => a.value - b.value);
  
  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  
  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear); 
}

//Обработчики событий
//Показываем список городов соответственно вводу
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

//Подставляем город в поле по клику
dropdownCitiesFrom.addEventListener('click', (event) => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

//Получаем значения из API
formSearch.addEventListener('submit', (event) => {
  
  //Запрещаем браузеру перезагружаться
  event.preventDefault();

  //Забираем города отправления и прибытия из массива по городам
  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name),
        cityTo = city.find((item) => inputCitiesTo.value === item.name);
  
        //Формируем объект с данными для запроса
  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };
  //Проверка правильно ли указан город
  if (formData.from && formData.to) {
    //Создаём строку, которую требуется добавить к запросу
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;
    
    //Делаем запрос
    getData(PROXY + CALENDAR + requestData, (response) =>{
      renderCheap(response, formData.when);    
    });
  } else {
    alert('Введите корректное название города');
  }
});

//Вызовы функций
getData(CITY_API, (data) => {
  city = JSON.parse(data).filter(item => item.name);
  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
  
});


