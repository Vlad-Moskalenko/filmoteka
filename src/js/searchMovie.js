import { getMovies } from "./getFetch";
import { renderMovies } from "./renderMovies";
import { instance } from "./pagination";
import { loader } from "./loader";

export function onSearchFormSubmit(e){
  e.preventDefault()
  const query = e.target.query.value
  const currentTarget = e.currentTarget

  if(query === "") return currentTarget.classList.add('item-error')

  loader.on()

  getMovies.searchMovie(query)
  .then(({data}) => {
    if(data.total_results === 0){
     throw new Error("404")
    }
    currentTarget.classList.remove('item-error')
    return data
  })
  .then(data => {
    instance.reset(data.total_results)
    return data.results
  })
  .then(renderMovies)
  .catch(err => {
    err.message === "404"? currentTarget.classList.add('item-error') : console.log(err)
  })
}