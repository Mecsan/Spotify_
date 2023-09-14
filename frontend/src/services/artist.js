import * as API from "../config/api";

export const getArtists = async (limit) => {
    let url = API.artist;
    if (limit) {
        url = url + "?limit=" + limit;
    }
    let res = await fetch(url);
    let data = await res.json();
    return { res, data }
}

export const get = async (id) => {
    let res = await fetch(API.artist + id);
    let data = await res.json();
    return { res, data }
}

export const delete_ = async (key, token) => {
    let res = await fetch(API.artist + key, {
        method: "DELETE",
        headers: {
            "authorization": "berear " + token,
        }
    })
    let data = await res.json();
    return { res, data }
}

export const add = async (token, formdata) => {
    let res = await fetch(API.artist, {
        method: "POST",
        headers: {
            "authorization": "berear " + token,
        },
        body: formdata
    })
    let data = await res.json();
    return { res, data }
}

export const update = async (id, token, formdata) => {
    let res = await fetch(API.artist + id, {
        method: "PUT",
        headers: {
            "authorization": "berear " + token,
        },
        body: formdata
    })
    let data = await res.json();
    return { res, data }
}