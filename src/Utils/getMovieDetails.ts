import config from "../Config/config";

export const getMovieDetails = async (movieId: number) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${config.tmdbApiKey}`);
    const data = await response.json();
    return data;
}

export const getMovieGenres = async (movieId: number) => {
    const response = await getMovieDetails(movieId)
    return response.genres;
}