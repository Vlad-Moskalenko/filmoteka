import axios from "axios"
axios.defaults.baseURL = 'https://api.themoviedb.org/3';

class FetchMovies {
  #API_KEY = "dc26557b281e26d9f878e92da4703242"

  constructor(){
    this.page = 1;
    this.query = '';
  }

  searchMovie(query, page=1){
    this.query = query
    return axios.get('/search/movie?', {
      params: {
        api_key: this.#API_KEY,
        query,
        page
      }
    })
  }

  getTrendingMovies(page = 1){
    return axios.get('/trending/movie/day?', {
      params: {
        api_key: this.#API_KEY,
        page
      }
    })
  }

  getGenres(){
    return axios.get('/genre/movie/list?', {
      params: {
        api_key: this.#API_KEY,
      }
    })
    .then(({data}) => data.genres)
  }

  getMovieDetails(id){
    return axios.get(`/movie/${id}?`, {
      params: {
        api_key: this.#API_KEY
      }
    })
  }
}

export const getMovies = new FetchMovies()