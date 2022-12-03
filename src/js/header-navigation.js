import { onBtnClick } from "./library"
import { onSearchFormSubmit } from "./searchMovie"
import {getTrendingMovies} from './home'
import { getItemLocaleStorage } from "./library"
import { loader } from "./loader";

const navigationList = document.querySelector('.navigation-list')
const headerEl = document.querySelector('.header')
const jsWrapper = document.querySelector('.js-wrapper')
const logoLink = document.querySelector('.logo-link')
const homeLinkEl = document.querySelector('[data-page="home"]')
const libraryLinkEl = document.querySelector('[data-page="library"]')
const searchForm = jsWrapper.querySelector('#search-form')

searchForm.addEventListener('submit', onSearchFormSubmit)
navigationList.addEventListener('click', onNavigationItemClick)
logoLink.addEventListener('click', onLogoLinkClick)

function onNavigationItemClick(e){
  const target = e.target

  if(target.tagName === "UL") return

  e.preventDefault()

  target.classList.add('item--current')

  if(target.dataset.page === "library") {
    homeLinkEl.classList.remove('item--current')
    headerEl.classList.replace('header-bg', 'header-library-bg')

    renderLibraryBtn()

    const btnWrapperEl = jsWrapper.querySelector('.btn-wrapper')
    btnWrapperEl.addEventListener('click', onBtnClick)

    getItemLocaleStorage('watched')
  }

  if(target.dataset.page === "home") {
    libraryLinkEl.classList.remove('item--current')
    headerEl.classList.replace('header-library-bg', 'header-bg')

    renderHomeSearchInput()

    const searchForm = jsWrapper.querySelector('#search-form')
    searchForm.addEventListener('submit', onSearchFormSubmit)

    loader.on()
    getTrendingMovies()
  }
}

function renderLibraryBtn(){
  const template = `
    <div class="btn-wrapper">
      <button class="btn-library btn--current" type="button" data-watched>watched</button>
      <button class="btn-library" type="button" data-queue>queue</button>
    </div>`

  jsWrapper.innerHTML = template;
}

function renderHomeSearchInput(){
  const template = `
    <form class="search-form" id="search-form">
      <input
        type="text"
        name="query"
        autocomplete="off"
        placeholder="Movie search"
        class="search-field"
      />
      <button type="submit" class="search-btn">
        <svg class="search-icon" width="12" height="12">
          <use href="./icons.adfc4680.svg#icon-search"></use>
        </svg>
      </button>
    </form>`

    jsWrapper.innerHTML = template;
}

function onLogoLinkClick(e){
  e.preventDefault()
  libraryLinkEl.classList.remove('item--current')
  headerEl.classList.replace('header-library-bg', 'header-bg')

  homeLinkEl.classList.add('item--current')
  renderHomeSearchInput()

  const searchForm = jsWrapper.querySelector('#search-form')
  searchForm.addEventListener('submit', onSearchFormSubmit)

  loader.on()
  getTrendingMovies()
}