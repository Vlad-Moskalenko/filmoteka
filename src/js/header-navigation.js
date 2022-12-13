import { libraryMovies, onBtnClick } from "./library"
import { onSearchFormSubmit } from "./searchMovie"
import {getTrendingMovies} from './home'
import { getItemLocaleStorage } from "./library"
import { loader } from "./loader";

const headerEl = document.querySelector('.header')

const headerRefs = {
  navigationEl: headerEl.querySelector('.navigation'),
  homeLinkEl: headerEl.querySelector('[data-page="home"]'),
  libraryLinkEl: headerEl.querySelector('[data-page="library"]'),
  searchForm: headerEl.querySelector('#search-form'),
  libraryBtn: headerEl.querySelector('.btn-wrapper')
}

const {navigationEl, homeLinkEl, libraryLinkEl, searchForm, libraryBtn} = headerRefs

navigationEl.addEventListener('click', onNavigationItemClick)
libraryBtn.addEventListener('click', onBtnClick)
searchForm.addEventListener('submit', onSearchFormSubmit)

function onNavigationItemClick(e){
  e.preventDefault()
  searchForm.reset()

  const target = e.target

  if(target.dataset.page === "library") {
    changeHeader(target, homeLinkEl, "header-library-bg", libraryBtn, searchForm)

    currentItem = "watched" in libraryBtn.querySelector('.btn--current').dataset? 'watched' : 'queue'

    getItemLocaleStorage(currentItem)
  }

  if(target.dataset.page === "home" || target.closest('a')?.classList.contains('logo-link')) {
    changeHeader(homeLinkEl, libraryLinkEl, "header-bg", searchForm, libraryBtn)

    loader.on()
    getTrendingMovies()
  }
}

function changeHeader(itemCurrentAdd, itemCurrentRemove, classHeaderBg, itemShow, itemHide){
  itemCurrentAdd.classList.add('item--current')
  itemCurrentRemove.classList.remove('item--current')

  headerEl.className = `header ${classHeaderBg}`

  itemShow.classList.remove('visually-hidden')
  itemHide.classList.add('visually-hidden')
}
