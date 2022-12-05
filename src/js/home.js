import {getMovies} from "./getFetch";
import { paginationSettings } from "./pagination";
import {renderMovies} from "./renderMovies"
import {loader} from "./loader"

getTrendingMovies()

export function getTrendingMovies(){
  loader.on()

  getMovies.getTrendingMovies()
  .then(({data}) => {
    paginationSettings(data.total_results, 20)
    renderMovies(data.results)
  })
  .catch(err => console.log(err))
}