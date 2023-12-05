import * as API from "../config/api";

export const getSongs = async (limit) => {
    let url = API.song;
    if (limit) {
        url = url + "?limit=" + limit;
    }
    let res = await fetch(url);
    let data = await res.json();
    return { res, data }
}

export const get = async (id) => {
    let res = await fetch(API.song + id);
    let data = await res.json();
    return { res, data }
}

export const getLikedSongs = async (token) => {
    let res = await fetch(API.like, {
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}
export const add = async (token, formdata) => {
    let res = await fetch(API.song, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": "berear " + token,
        },
        body: JSON.stringify(formdata)
    })
    let data = await res.json();
    return { data, res };
}

export const update = async (id, formdata, token) => {
    let res = await fetch(API.song + id, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": "berear " + token,
        },
        body: JSON.stringify(formdata)
    })
    let data = await res.json();
    return { data, res };
}

export const delete_ = async (key, token) => {
    let res = await fetch(API.song + key, {
        method: "DELETE",
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data }
}

export let likeSong = async (id, token) => {
    let res = await fetch(API.like + id, {
        method: "POST",
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}
