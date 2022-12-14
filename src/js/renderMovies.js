import { getMovies } from "./getFetch";
import { loader } from "./loader";
import img404 from "../images/404.jpg"

const moviesListEl = document.querySelector('.movies-list')

export async function renderMovies(data){
  const isLibraryPage = document.querySelector('.item--current')?.dataset.page === "library";
  const genresData = await getMovies.getGenres()

  const template = data.reduce((acc, movie) => {
    const {poster_path: poster, title, release_date, genre_ids, id, vote_average, genres } = movie;
    const imageSrc = poster? `https://image.tmdb.org/t/p/w500/${poster}` : img404

    return acc +
      `<li class="movie" data-movieId="${id}">
          <div class="poster-wrapper">
            <img loading="lazy" class="movie-poster" src="${imageSrc}" alt="${title}" />
          </div>
          <div class="movie-meta">
            <h2 class="movie-title" title="${title}">${title}</h2>
            <p class="movie-genre">
              <span class="genres">${genresList(genre_ids, genres, genresData)}</span> | ${release_date? parseInt(release_date) : "-"}
              <span class="vote ${isLibraryPage? "" : "visually-hidden"}">${vote_average.toFixed(1)}</span>
            </p>
          </div>
      </li>`
  }, '')

  moviesListEl.innerHTML = template;

  loader.off()
}

function genresList(idArr, genres, genresData) {
  if(genres) {
    return genres.map(genre => genre.name).join(", ")
  }

  return genresData.filter(genre => idArr.includes(genre.id)).map(({name}) => name).join(', ')
}