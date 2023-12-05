import * as API from "../config/api"

export const signup = async (body) => {
    let res = await fetch(API.signup, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body)
    })
    let data = await res.json();
    return { res, data };
}

export const signin = async (body) => {
    let res = await fetch(API.signin, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body)
    })
    let data = await res.json();
    return { res, data };
}

export const info = async (token) => {
    let res = await fetch(API.profile + "token", {
        headers: {
            "authorization": "berear " + token
        }
    })
    let data = await res.json();
    return { res, data }
}

export const update = async (token, form) => {
    let res = await fetch(API.profile + "update", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": "berear " + token
        },
        body: JSON.stringify(form)
    });
    let data = await res.json();
    return { res, data }
}