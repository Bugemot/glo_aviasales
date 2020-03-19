//Формируем список городов
const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Калиниград', 'Владивосток', 'Нижний Новгород', 'Сочи', 'Крым', 'Самара', 'Волгоград', 'Екатеринбург'];

//Получаем элементы разметки
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');
//Фильтр городов в зависимости от ввода пользователя
const showCity = (input, list) => {
  list.textContent = '';
    //Проверка, пустой ли инпут, если да, функция не выполняется
   if (input.value === '') {
    return;
   }
  const filterCity = city.filter((item) => {
    const fixItem = item.toLowerCase();
    return fixItem.includes(input.value.toLowerCase());
  });
//Добавляем элементы li в .dropdown__city
  filterCity.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item;
    list.append(li);
  });
};

const selectCity = (event, input, list) => {
  const target = event.target;
  if(target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
}
//Показываем список городов соответственно вводу
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo)
});
//Подставляем город в поле по клику
dropdownCitiesFrom.addEventListener('click', (event) => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});
