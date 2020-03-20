//Данные
const CITY_API = 'database/cities.json',
      PROXY = 'https://cors-anywhere.herokuapp.com/',
      API_KEY='59b2326ef4e36e05010ba16e70acb7fe',
      CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';
let city = [];

//Переменные
//Получаем элементы разметки
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');

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

  //Фильтр городов в зависимости от ввода пользователя
const showCity = (input, list) => {
  list.textContent = '';
    //Проверка, пустой ли инпут, если да, функция не выполняется
   if (input.value === '') {
    return;
   }
  const filterCity = city.filter((item) => {
    const fixItem = item.name.toLowerCase();
    return fixItem.includes(input.value.toLowerCase());
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
  //Фильтр по лучшей цене
const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket);
  
}

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets);
  
}

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
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  };
  
  //Создаём строку, которую требуется добавить к запросу
  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;
  
  //Делаем запрос
  getData(PROXY + CALENDAR + requestData, (response) =>{
    renderCheap(response, formData.when);    
  });
});

//Вызовы функций
getData(CITY_API, (data) => {
  city = JSON.parse(data).filter(item => item.name)
});


