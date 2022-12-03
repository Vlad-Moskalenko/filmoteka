import {getMovies} from "./getFetch";
import { instance } from "./pagination";
import {renderMovies} from "./renderMovies"
import {loader} from "./loader"

getTrendingMovies()

export function getTrendingMovies(){
  loader.on()
  getMovies.getTrendingMovies()
  .then(({data}) => {
    instance.reset(data.total_results)
    return data.results
  })
  .then(renderMovies)
  .catch(err => console.log(err))
}