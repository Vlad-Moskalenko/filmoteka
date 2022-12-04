import { getMovies } from "./getFetch";
import { loader } from "./loader";

const moviesListEl = document.querySelector('.movies-list')

let moviesGenresList;
let movieItem;

export function renderMovies(data){
  movieItem = 0;

  const isLibraryPage = document.querySelector('.item--current')?.dataset.page === "library"

  const template = data.reduce((acc, movie) => {
    const {poster_path: poster, title, release_date, genre_ids, id, vote_average, genres } = movie;

    return acc +
      `<li class="movie" data-movieId="${id}">
          <div class="poster-wrapper">
            <img loading="lazy" class="movie-poster" src="https://image.tmdb.org/t/p/w500/${poster}" alt="${title}" />
          </div>
          <div class="movie-meta">
            <h2 class="movie-title" title="${title}">${title}</h2>
            <p class="movie-genre">
              <span class="genres">${genresList(genre_ids, genres)}</span> | ${parseInt(release_date)}
              <span class="vote ${isLibraryPage? "" : "visually-hidden"}">${vote_average.toFixed(1)}</span>
            </p>
          </div>
      </li>`
  }, '')

  moviesListEl.innerHTML = template;

  loader.off()

  moviesGenresList = document.querySelectorAll('.genres')
}

function genresList(idArr, genres) {
  if(genres) {
    return genres.map(genre => genre.name).join(", ")
  }

  getMovies.getGenres()
  .then(genresArr => {
    const genresFilteredArr = genresArr.filter(genre => idArr.includes(genre.id))
    const genresString = genresFilteredArr.map(({name}) => name).join(', ')
    moviesGenresList[movieItem].innerHTML = genresString
  })
  .catch(e => console.log(e))
  .finally(() => movieItem++)
}