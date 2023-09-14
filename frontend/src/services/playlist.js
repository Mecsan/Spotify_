import * as API from "../config/api";

export const update = async (id, form, token) => {
    let res = await fetch(API.playlist + id, {
        method: "PUT",
        headers: {
            "authorization": "berear " + token
        },
        body: form
    });
    let data = await res.json();
    return { res, data };
}

export const get = async (id, token) => {
    const option = {};
    if (token) {
        option['headers'] = { "authorization": "berear " + token }
    }
    let res = await fetch(API.playlist + id, option)
    let data = await res.json();
    return { res, data };
}


export const delete_ = async (id, token) => {
    let res = await fetch(API.playlist + id, {
        method: "DELETE",
        headers: { "authorization": "berear " + token }
    })
    let data = await res.json();
    return { res, data };
}

export const add = async (token, body) => {
    let res = await fetch(API.playlist,
        {
            method: "POST",
            headers: {
                "authorization": "berear " + token,
                "content-type": "application/json"
            },
            body: body
        })
    let data = await res.json();
    return { res, data };
}

export const like = async (id, token) => {
    let res = await fetch(API.playlist + "like/" + id, {
        method: "GET",
        headers: {
            "authorization": "berear " + token
        }
    });
    const data = await res.json();
    return { res, data }
}

export const addSong = async (pid, id, token) => {
    let res = await fetch(`${API.songToPlaylist}${pid}/${id}`, {
        method: "POST",
        headers: {
            "authorization": "berear " + token
        }
    });

    let data = await res.json();
    return { data, res }
}

export const removeSong = async (id, key, token) => {
    let res = await fetch(API.playlist + "/songs/" + id + "/" + key, {
        method: "DELETE",
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}

export const changeVis = async (id, action, token) => {
    let res = await fetch(API.playlist + id + "/" + action, {
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}

export const getPlaylistSongs = async (pid) => {
    let res = await fetch(API.playlist + pid);
    let data = await res.json();
    return { res, data }
}

export const getPlayLists = async (token) => {
    let res = await fetch(API.playlist, {
        headers: {
            "authorization": "berear " + token
        }
    });
    let data = await res.json();
    return { res, data };
}

export const getLikedLists = async (token) => {
    let res = await fetch(API.playlist + "like/", {
        headers: {
            "authorization": "berear " + token
        }
    });
    let data = await res.json();
    return { res, data }
}

export const getAll = async (limit) => {
    let url = API.playlist + "all";
    if (limit) {
        url = url + "?limit=" + limit;
    }
    let res = await fetch(url);
    let data = await res.json();
    return { res, data };
}