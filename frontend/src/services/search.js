import * as API from "../config/api";

export const search = async (val) => {
    let res = await fetch(API.search + `?q=${val}`);
    let data = await res.json();
    return { res, data };
}