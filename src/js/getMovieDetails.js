import { getMovies } from "./getFetch";
import {loader} from "./loader"

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
  }
  if(e.target.textContent === "Add to queue"){
    addMovieToLocaleStorage('queue', movieData)
  }
}

function addMovieToLocaleStorage(itemKey, movieData){
  const itemStorage = localStorage.getItem(`${itemKey}`)

  if(itemStorage){
    const isNotUnique = JSON.parse(itemStorage).find(movie => movie.id === movieData.id)

    if(isNotUnique) return
  }

  const itemValue = itemStorage? [...JSON.parse(itemStorage), movieData] : [movieData]

  localStorage.setItem(`${itemKey}`, JSON.stringify(itemValue))
}

function renderMovieDetails({data}){
  const {poster_path, title, vote_average, vote_count, popularity, original_title, genres, overview} = data
  const genresString = genres.map(({name}) => name).join(', ')

  return `
  <div class="modal-movie__poster">
    <img
      class="modal-movie__img"
      src="https://image.tmdb.org/t/p/w500/${poster_path}"
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
      <button class="modal-movie-btn">Add to watched</button>
      <button class="modal-movie-btn">Add to queue</button>
    </div>
  </div>`
}