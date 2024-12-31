export type TWatchlist = {
    id: number,
    user_id: number,
    created_at: Date,
    watchlist_name: string,
    description: string
    movies?: TWatchlistMovie[]
}

export type TWatchlistMovie = {
    tmdb_movie_id: number,
    added_at: Date
}