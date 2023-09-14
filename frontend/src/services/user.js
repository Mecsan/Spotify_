import * as API from "../config/api"

export const getUsers = async (token) => {
    let res = await fetch(API.user + "all/", {
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}

export const get = async (id) => {
    let res = await fetch(API.profile + id);
    let data = await res.json();
    return { res, data }
}

export const add = async (token, body) => {
    let res = await fetch(API.user, {
        method: "POST",
        headers: {
            "authorization": "berear " + token,
            "content-type": "application/json"
        },
        body: body
    })
    let data = await res.json();
    return { res, data }
}

export const delete_ = async (key, token) => {
    let res = await fetch(API.user + key, {
        method: "DELETE",
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data };
}

export const update = async (id, token, body) => {
    let res = await fetch(API.user + id, {
        method: "PUT",
        headers: {
            "authorization": "berear " + token,
            "content-type": "application/json"
        },
        body: body
    })
    let data = await res.json();
    return { res, data };
}

