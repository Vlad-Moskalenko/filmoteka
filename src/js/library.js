import { renderMovies } from "./renderMovies";
import { instance } from "./pagination";

const moviesListEl = document.querySelector('.movies-list')
const itemsPerPage = 9;
let itemsArr;

export function onBtnClick(e){
  const target = e.target

  if(target.tagName !== "BUTTON") return

  target.classList.add('btn--current')

  if("watched" in target?.dataset){
    target.nextElementSibling.classList.remove('btn--current')

    getItemLocaleStorage("watched")
  }

  if("queue" in target?.dataset){
    target.previousElementSibling.classList.remove('btn--current')

    getItemLocaleStorage("queue")
  }
}

export function getItemLocaleStorage(itemKey){
  const itemsJSON = localStorage.getItem(`${itemKey}`)

  if(!itemsJSON){
    moviesListEl.innerHTML = ''
    return instance.reset(0)
  }

  itemsArr = JSON.parse(itemsJSON).reverse()

  instance.setItemsPerPage(itemsPerPage)
  instance.reset(itemsArr.length)

  libraryMovies()
}

export function libraryMovies(page=1){
  renderMovies(itemsArr.slice(page*itemsPerPage - 9, page*itemsPerPage))
}
