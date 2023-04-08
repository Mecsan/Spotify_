import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { like } from '../config/api';
import { AuthContext } from './auth';
export const LikeContext = createContext();
function LikeProvider(props) {

    const { token } = useContext(AuthContext)

    const myfun = (state, action) => {
        switch (action.type) {
            case "SET_LIKES": return {
                likes: action.data
            };
            case "ADD_LIKE": return {
                likes: [action.data, ...state.likes]
            };
            case "RM_LIKE": return {
                likes: state.likes?.filter((one) => one._id != action.data)
            }
            default:
                return state;
        }
    }

    const [likes, dispatch] = useReducer(myfun, {
        likes: []
    })
    const [load, setload] = useState(true)

    const islike = (id) => {
        if (likes.likes.find(like => like._id == id)) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        const getLikeSongs = async () => {
            setload(true);
            let res = await fetch(like, {
                headers: {
                    "authorization": "berear " + token
                }
            })
            let data = await res.json();
            dispatch({ type: "SET_LIKES", data: data })
            setload(false)
        }
        if (token) {
            getLikeSongs();
        } else {
            dispatch({ type: "SET_LIKES", data: [] })
        }
    }, [token])

    return (
        <LikeContext.Provider value={{ likes, dispatch, islike, load }}>
            {props.children}
        </LikeContext.Provider>
    )
}

export default LikeProvider