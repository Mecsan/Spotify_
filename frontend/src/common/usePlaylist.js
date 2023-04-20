import { useContext } from 'react';
import { playlist } from '../config/api';
import { AuthContext } from '../context/auth';

function usePlaylist() {
    let { token } = useContext(AuthContext);

    const update = async (id, form) => {
        let res = await fetch(playlist + id, {
            method: "PUT",
            headers: {
                "authorization": "berear " + token
            },
            body: form
        });
        console.log(id, form, res)
        let data = await res.json();
        return data;
    }

    const get = async (id) => {
        const option = {};
        if (token) {
            option['headers'] = { "authorization": "berear " + token }
        }
        let res = await fetch(playlist + id, option)
        let data = await res.json();
        return data;
    }

    const delete_ = async (id) => {
        let res = await fetch(playlist + id, {
            method: "DELETE",
            headers: { "authorization": "berear " + token }
        })
        let data = await res.json();
        return data;
    }

    const removeSong = async (id, key) => {
        // remove a song from playlist
        let res = await fetch(playlist + "/songs/" + id + "/" + key, {
            method: "DELETE",
            headers: {
                "authorization": "berear " + token
            }
        })
        let data = await res.json();
        return res;
    }

    const changeVis = async (id, action) => {
        let res = await fetch(playlist + id + "/" + action, {
            headers: {
                "authorization": "berear " + token
            }
        })
        let data = await res.json();
        return data;
    }

    return { update, delete_, get, removeSong, changeVis };
}

export default usePlaylist