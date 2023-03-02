import React, { createContext, useEffect, useReducer } from 'react'
import { useState } from 'react';
import { profile } from '../config/api';
export const AuthContext = createContext();

function AuthProvider(props) {

    let [user, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_TOKEN": return {
                user: null,
                token: action.data,
            }
            case "SET_USER": return {
                ...state,
                user: action.data
            }
            case "LOGOUT":
                return {
                    user: null,
                    token: null
                }
            default:
                return state;
        }
    }, {
        user: null,
        token: localStorage.getItem('spoti')
    })

    useEffect(() => {

        let fetchUser = async (token) => {
            let res = await fetch(profile, {
                headers: {
                    "authorization": "berear " + token
                }
            })
            if (res.ok) {
                let data = await res.json();
                dispatch({ type: "SET_USER", data })
            } else {
                // token was invalid
                dispatch({ type: "LOGOUT" });
                localStorage.removeItem('spoti');
            }
            setload(false);
        }

        if (user.token) {
            fetchUser(user.token);
        } else {
            setload(false);
        }

    }, [user.token])

    // token = null indicates unauthenticated

    const [isload, setload] = useState(true);

    return (
        <AuthContext.Provider value={{ ...user, dispatch, isload }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider