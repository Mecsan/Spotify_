let baseUrl = "";

if (process.env.NODE_ENV == 'development') {
    baseUrl = "http://localhost:2000/api/";
} else {
    baseUrl = "/api/";
}

export const playlist = baseUrl + "playlist/"

export const songToPlaylist = playlist + "songs/";

export const song = baseUrl + "song/"

export const profile = baseUrl + "user/"

export const image = baseUrl + "image/"

export const artist = baseUrl + "artist/"

export const signup = baseUrl + "user/signup"

export const signin = baseUrl + "user/login"

export const user = baseUrl + "user/"

export const search = baseUrl + "search/"

export const like = song + "like/"

