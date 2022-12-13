import { getMovies } from "./getFetch";
import {loader} from "./loader";
import img404 from "../images/404.jpg";

const moviesListEl = document.querySelector('.movies-list')
const modalMovieBackdrop = document.querySelector('.modal-backdrop')
const movieDetailsWrapper = document.querySelector('.movie-details-wrapper')
const closeBtn = document.querySelector('.modal-movie-close')

moviesListEl.addEventListener('click', onMovieItemClick)
closeBtn.addEventListener('click', hideModal)

async function onMovieItemClick(e){
  e.preventDefault()

  if(e.target.tagName === "UL") {
    return
  }

  const movieId = e.target.closest('li').dataset.movieid
  loader.on()

  const movieDetails = await getMovies.getMovieDetails(movieId)
  movieDetailsWrapper.innerHTML = renderMovieDetails(movieDetails)

  loader.off()

  const modalMovieDetailsBtn = document.querySelector('.modal-movie-btn-wrapper')

  modalMovieDetailsBtn.addEventListener('click', (e) => onMovieBtnClick(e, movieDetails.data))

  showModalMovie()
}

function showModalMovie(){
  modalMovieBackdrop.classList.remove('visually-hidden')
  document.body.style.overflow = "hidden"

  modalMovieBackdrop.addEventListener('click', hideModal)
  document.addEventListener('keydown', hideModal)
}

function hideModal(e){
  if(e.target === e.currentTarget || e.code === "Escape" || e.target.closest('button') === closeBtn){
    modalMovieBackdrop.classList.add('visually-hidden')
    document.body.style.overflow = "visible"

    modalMovieBackdrop.removeEventListener('click', hideModal)
    document.removeEventListener('keydown', hideModal)
  }
}

function onMovieBtnClick(e, movieData){
  if(e.target.textContent === "Add to watched"){
    addMovieToLocaleStorage('watched', movieData)
    return e.target.textContent = "Remove from watched"
  }
  if(e.target.textContent === "Add to queue"){
    addMovieToLocaleStorage('queue', movieData)
    return e.target.textContent = "Remove from queue"
  }
  if(e.target.textContent === "Remove from watched"){
    removeMovieFromLocaleStorage('watched', movieData.id)
    return e.target.textContent = "Add to watched"
  }
  if(e.target.textContent === "Remove from queue"){
    removeMovieFromLocaleStorage('queue', movieData.id)
    return e.target.textContent = "Add to queue"
  }
}

function addMovieToLocaleStorage(itemKey, movieData){
  const itemStorage = localStorage.getItem(`${itemKey}`)

  const itemValue = itemStorage? [...JSON.parse(itemStorage), movieData] : [movieData]

  localStorage.setItem(`${itemKey}`, JSON.stringify(itemValue))
}

function removeMovieFromLocaleStorage(itemKey, movieId){
  const itemStorage = localStorage.getItem(`${itemKey}`)
  const newMovieArr = JSON.parse(itemStorage).filter(movie => movie.id !== movieId)
  localStorage.setItem(`${itemKey}`, JSON.stringify(newMovieArr))
}

function isNotUnique(itemKey, movieId){
  const itemStorage = localStorage.getItem(`${itemKey}`)
  if(itemStorage) {
    return JSON.parse(itemStorage).find(movie => movie.id === movieId)
  }
}

function renderMovieDetails({data}){
  const {poster_path, title, vote_average, vote_count, popularity, original_title, genres, overview, id} = data
  const genresString = genres.map(({name}) => name).join(', ')
  const btnWatchedTextContent = isNotUnique("watched", id)? "Remove from watched" : "Add to watched"
  const btnQueueTextContent = isNotUnique("queue", id)? "Remove from queue" : "Add to queue"
  const imageSrc = poster_path? `https://image.tmdb.org/t/p/w500/${poster_path}` : img404

  return `
  <div class="modal-movie__poster">
    <img
      class="modal-movie__img"
      src=${imageSrc}
      alt="movie poster"
    />
  </div>
  <div class="modal-movie-content">
    <h2 class="modal-movie__title">${title}</h2>
    <table class="modal-movie-info">
    <tr>
      <td class="modal-movie-info__title">Vote / Votes</td>
      <td class="modal-movie-info__value">
        <span class="modal-movie-info__rate">${vote_average.toFixed(1)}</span>
        /
        <span class="modal-movie-info__rate">${vote_count}</span>
      </td>
    </tr>
    <tr>
      <td class="modal-movie-info__title">Popularity</td>
      <td class="modal-movie-info__value">${popularity.toFixed(1)}</td>
    </tr>
    <tr>
      <td class="modal-movie-info__title">Original Title</td>
      <td class="modal-movie-info__value">${original_title}</td>
    </tr>
    <tr>
      <td class="modal-movie-info__title">Genre</td>
      <td class="modal-movie-info__value">${genresString}</td>
    </tr>
  </table>

    <div class="modal-movie-about">
      <h3 class="modal-movie-about__title">About</h3>
      <p class="modal-movie-about__desc">${overview}</p>
    </div>
    <div class="modal-movie-btn-wrapper">
      <button class="modal-movie-btn" data-btn="watched">${btnWatchedTextContent}</button>
      <button class="modal-movie-btn" data-btn="queue">${btnQueueTextContent}</button>
    </div>
  </div>`
}