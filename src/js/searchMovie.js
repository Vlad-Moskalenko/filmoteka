import { getMovies } from "./getFetch";
import { renderMovies } from "./renderMovies";
import { instance } from "./pagination";
import { loader } from "./loader";

export async function onSearchFormSubmit(e){
  e.preventDefault()

  const query = e.target.query.value
  const currentTarget = e.currentTarget

  if(query === "") {
    setTimeout(() => currentTarget.classList.remove('item-error'), 2000)
    return currentTarget.classList.add('item-error')
  }

  try{
    loader.on()
    const getSearchMovies= await getMovies.searchMovie(query)
    const {data: moviesData} = getSearchMovies

    if(moviesData.total_results === 0) {
      throw new Error("404")
    }

    currentTarget.classList.remove('item-error')

    instance.setItemsPerPage(20)
    instance.reset(moviesData.total_results)

    renderMovies(moviesData.results)
  }

  catch(err) {
    err.message === "404"? currentTarget.classList.add('item-error') : console.log(err)
  }

  finally {
    loader.off()
    setTimeout(() => currentTarget.classList.remove('item-error'), 2000)
  }
}