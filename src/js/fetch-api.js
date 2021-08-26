import '../sass/main.scss';
import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/country-list.hbs';
import fetchCountries from './api-service';
import getRefs from './get-refs';
import debounce from 'lodash.debounce';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const refs = getRefs();

refs.inputField.addEventListener('input', debounce(onInput, 500));

function makeMarkup(array) {
  const countiesQuantity = array.length;
  if (countiesQuantity > 10) {
    error({
      delay: 3000,
      text: 'Too many matches found. Please enter a more specific query!',
    });
  } else if (countiesQuantity >= 2 && countiesQuantity <= 10) {
    const markup = countryListTpl(array);
    refs.container.innerHTML = markup;
  } else if (countiesQuantity === 1) {
    const markup = countryCardTpl(array[0]);
    refs.container.innerHTML = markup;
  }
}

function onInput(e) {
  e.preventDefault();
  const searchQuery = refs.inputField.value;
  if (searchQuery === '') {
    return;
  }

  fetchCountries(searchQuery)
    .then(makeMarkup)
    .catch(error => {
      refs.container.innerHTML = '';
      refs.inputField.value = '';
    });
}
