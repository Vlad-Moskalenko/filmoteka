import {getMovies} from "./getFetch";
import { instance } from "./pagination";
import {renderMovies} from "./renderMovies"
import {loader} from "./loader"

getTrendingMovies()

export function getTrendingMovies(){
  loader.on()

  getMovies.getTrendingMovies()
  .then(({data}) => {
    instance.setItemsPerPage(20)
    instance.reset(data.total_results)
    renderMovies(data.results)
  })
  .catch(err => console.log(err))
}