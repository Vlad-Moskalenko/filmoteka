import Pagination from 'tui-pagination';
import "tui-pagination/dist/tui-pagination.min.css"

import { getMovies } from './getFetch';
import { renderMovies } from './renderMovies';
import { loader } from "./loader";
import { libraryMovies } from './library';

const container = document.getElementById('tui-pagination-container');
const searchForm = document.querySelector('#search-form')

export const options = {
  totalItems: 500,
  itemsPerPage: 20,
  visiblePages: 5,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

export const instance = new Pagination(container, options);

instance.on('beforeMove', onPaginationClick);

function onPaginationClick(e){
  const searchQuery = searchForm.elements.query.value
  const currentPage = document.querySelector('.item--current')

  loader.on()

  if(searchQuery !== ""){
    getMovies.searchMovie(getMovies.query, e.page)
    .then(({data}) => renderMovies(data.results))
    .catch(() => searchForm.classList.add('item-error'))
  }

  if(currentPage.dataset.page === "library"){
    libraryMovies(e.page)
  }

  if(searchQuery === "" && currentPage.dataset.page === "home") {
    getMovies.getTrendingMovies(e.page)
    .then(({data}) => renderMovies(data.results))
    .catch(err => console.log(err))
  }
}