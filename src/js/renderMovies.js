import { getMovies } from "./getFetch";
import { loader } from "./loader";

const moviesListEl = document.querySelector('.movies-list')

let moviesList;
let item;

export function renderMovies(data, libraryFlag){
  item = 0;
  const isVoteHidden = libraryFlag? "" : "visually-hidden"

  const template = data.reduce((acc, movie) => {
    const {poster_path: poster, title, release_date, genre_ids, id, vote_average, genres } = movie;
    return acc +
      `<li class="movie" data-movieId="${id}">
        <div class="poster-wrapper">
          <img loading="lazy" class="movie-poster" src="https://image.tmdb.org/t/p/w500/${poster}" alt="${title}" />
        </div>
        <div class="movie-meta">
          <h2 class="movie-title" title="${title}">${textLength(title, 33)}</h2>
          <p class="movie-genre">
            <span class="genres">${genresList(genre_ids, genres)}</span> | ${parseInt(release_date)}
            <span class="vote ${isVoteHidden}">${vote_average.toFixed(1)}</span>
          </p>
        </div>
      </li>`
  }, '')

  moviesListEl.innerHTML = template;
  loader.off()

  moviesList = document.querySelectorAll('.genres')
}

function textLength(text, length){
  if(text.length > length){
    const str = [...text]
    str.length = length - 3
    return str.join('') + '...'
  }
  return text
}

function genresList(idArr, genres) {
  if(genres) {
    const template = genres.map(genre => genre.name).join(", ")
    return textLength(template, 25)
  }

  getMovies.getGenres()
  .then(genresArr => genresArr.filter(genre => idArr.includes(genre.id)))
  .then(genresFilteredArr => genresFilteredArr.map(({name}) => `${name}`).join(', '))
  .then(template => moviesList[item].innerHTML = textLength(template, 30))
  .finally(() => item++)
}