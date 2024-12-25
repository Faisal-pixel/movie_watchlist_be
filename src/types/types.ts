export type TUser = {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    profile_picture: string | null,
    password_hash: string,
    email: string,
    created_at: Date,
    last_login: Date | null,
    bio: string | null,
    notification_enabled: boolean
}


export type TMovieDetails = {
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: null | object,
    budget: number,
    genres: Array<TmovieGenre>,
    homepage: string,
    id: number,
    imdb_id: string,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<object>,
    production_countries: Array<object>,
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: Array<object>,
    status: string,
    tagline: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
}

export type TmovieGenre = {
    id: number,
    name: string
}

export type TStreak = {
    id: number,
    user_id: number,
    streak_count: number,
    start_streak_date: Date | null,
    last_streak_update: Date | null,
} 