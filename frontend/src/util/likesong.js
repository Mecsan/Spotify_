import { like } from "../config/api";

export let likeSong = async (song,token) => {
    let res = await fetch(like + song._id, {
        method: "POST",
        headers: {
            "authorization": "berear " + token
        }
    })

    let data = await res.json();
    return data
}
