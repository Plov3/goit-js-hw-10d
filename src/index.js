import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

function getCountries() {
  const inputData = inputEl.value.trim();
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
  if (inputData !== '')
    fetchCountries(inputData)
      .then(data => {
        inputEl.classList.remove('error');
        if (data.length === 0) {
          return;
        } else if (data.length === 1) {
          renderCountry(data);
        } else if (data.length >= 2 && data.length <= 10) {
          renderCountries(data);
        } else if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        inputEl.classList.add('error');
      });
}


function renderCountries(countries) {
  const markupCountries = countries
    .map(country => {
      return `<li><img src=${country.flags.svg} alt="flag, ${country.name.official}" width=30, height=auto><p>${country.name.official}</p></li>`;
    })
    .join('');
  countryListEl.innerHTML = markupCountries;
}

function renderCountry(countries) {
  const markupCountry = countries
    .map(country => {
      return `<div class="country-card"><img src=${
        country.flags.svg
      } alt="flag, ${country.name.official}" width=40, height=auto><h2>${
        country.name.official
      }</h2><p><span class="title">Capital:</span> ${
        country.capital
      }</p><p><span class="title">Population:</span> ${
        country.population
      }</p><p><span class="title">Languages:</span> ${Object.values(
        country.languages
      )}</p></div>`;
    })
    .join('');
  countryInfoEl.innerHTML = markupCountry;
}

inputEl.addEventListener(
  'input',
  debounce(event => getCountries(event), DEBOUNCE_DELAY)
);

countryListEl.addEventListener('click', chooseCard);

function chooseCard(event) {
  inputEl.value = event.target.innerText.trim();
  const card = inputEl.value;
  getCountries(card);
  inputEl.value = '';
}