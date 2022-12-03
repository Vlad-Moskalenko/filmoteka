import { renderMovies } from "./renderMovies";
import { instance } from "./pagination";

const moviesListEl = document.querySelector('.movies-list')

export function onBtnClick(e){
  const watchedBtnEl = document.querySelector('[data-watched]')
  const queueBtnEl = document.querySelector('[data-queue]')
  const target = e.target

  if(target.tagName !== "BUTTON") return

  target.classList.add('btn--current')

  if("watched" in target.dataset){
    queueBtnEl.classList.remove('btn--current')
    getItemLocaleStorage("watched")
  }

  if("queue" in target.dataset){
    watchedBtnEl.classList.remove('btn--current')
    getItemLocaleStorage("queue")
  }
}

export function getItemLocaleStorage(itemKey){
  const itemsJSON = localStorage.getItem(`${itemKey}`)

  if(itemsJSON) {
    const itemsArr = JSON.parse(itemsJSON)
    instance.reset(itemsArr.length)
    return renderMovies(itemsArr, "library")
  }

  moviesListEl.innerHTML = ''
  instance.reset(0)
}
