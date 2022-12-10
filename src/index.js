import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries' // підключаємо винесений в окремий файл fetch
import debounce from 'lodash.debounce'; // підключаємо затримку debounce
import Notiflix from 'notiflix';  // підключаємо  повідомлення notiflix

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');  // отримуємо доступ до списку
const countryInfo = document.querySelector('.country-info');  // отримуємо доступ до картки
const searchForm = document.querySelector('#search-box');     // отримуємо доступ до інпуту


function onSearch(e) { // функція обробки інпуту
  e.preventDefault();  // забороняємо оновлення сторінки

  const searchQuery = searchForm.value.trim(); // виключаємо пробіли при введенні значення за допомогою метода trim
  cleanHtml(); // очистка результату при очистці інпуту
  if (searchQuery !== '') { // перевіряємо якщо значення інпуту не пусте, тоді:
    fetchCountries(searchQuery) // запускаємо обробку даних по введеному значенню з окремо винесеного fetch
      .then(foundData => {    // виконуємо fetch, оголошуємо змінну для обробки результатів

        if (foundData.length > 10) { // виводимо повідомлення в разі якщо кількість результатів більше 10
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundData.length === 0) { // виводимо повідомлення в разі якщо результатів не знайдено, помилка 404
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (foundData.length >= 2 && foundData.length <= 10) {
         
          renderCountryList(foundData); // виводимо список країн в разі якщо кількість результатів від 2 до 10
        } else if (foundData.length === 1) {
    
          renderContryCard(foundData); // виводимо картку країни в разі якщо умови вище не виконані
        }
      })
      .catch(error => console.log(error)) // ловимо помилку в лог
  }
}

const debouncedOnSearch = debounce(onSearch, DEBOUNCE_DELAY); // додаємо затримку обробки до функції слухача подій

searchForm.addEventListener('input', debouncedOnSearch)  // слухач для інпуту


function renderCountryList(countries) { 
    const markup = countries.map(country => { // мапимо дані з API в заготовку html для списку
        return `<li class="country-item">
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="20" hight="15">
        <b>${country.name.official}</b></p>
                </li>`;
    })
        .join('');
    countryList.innerHTML = markup; // прописуємо новий html список в домі
}

function renderContryCard(countries) {
    const markup = countries.map(country => { // мапимо дані з API в заготовку html для картки
        return `<li>
        <div class="country-item">
      <img src="${country.flags.svg}" alt="Flag of ${
            country.name.official
          }" width="25" hight="20">
         <b class="country-name">${country.name.official}</b></p>
         </div>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
        })
        .join('');
    countryInfo.innerHTML = markup; // прописуємо новий html картки в домі
}

function cleanHtml() {   // чистимо результат виконання функцій при очищенні інпуту
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}