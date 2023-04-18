import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import { createContext } from 'react'
import { artist, playlist, song, user } from '../config/api';
import { AuthContext } from './auth';

export const AdminContext = createContext();

function AdminProvider({ children }) {

    const { token } = useContext(AuthContext)

    let [admin, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_USERS": return {
                ...state,
                users: action.data
            }
            case "ADD_USER": return {
                ...state,
                users: [action.data, ...state.users]
            }
            case "DELETE_USER": return {
                ...state,
                users: state.users.filter((user) => user._id != action.data)
            }
            case "UPDATE_USER": return {
                ...state,
                users: state.users.map((user) => {
                    if (user._id == action.data._id) {
                        return action.data;
                    }
                    return user;
                })
            }



            case "SET_SONGS": return {
                ...state,
                songs: action.data
            }
            case "ADD_SONG": return {
                ...state,
                songs: [action.data, ...state.songs]
            }
            case "DELETE_SONG": return {
                ...state,
                songs: state.songs.filter((song) => song._id != action.data)
            }
            case "UPDATE_SONG": return {
                ...state,
                songs: state.songs.map((song) => {
                    if (song._id == action.data._id) {
                        return action.data;
                    }
                    return song;
                })
            }

            case "SET_ARTISTS": return {
                ...state,
                artists: action.data
            }
            case "ADD_ARTIST": return {
                ...state,
                artists: [action.data, ...state.artists]
            }
            case "DELETE_ARTIST": return {
                ...state,
                artists: state.artists.filter((artist) => artist._id != action.data)
            }
            case "UPDATE_ARTIST": return {
                ...state,
                artists: state.artists.map((artist) => {
                    if (artist._id == action.data._id) {
                        return action.data;
                    }
                    return artist;
                })
            }

            case "SET_PlAYLISTS": return {
                ...state,
                playlists: action.data
            }
            case "ADD_PlAYLIST": return {
                ...state,
                playlists: [action.data, ...state.playlists]
            }
            case "DELETE_PlAYLIST": return {
                ...state,
                playlists: state.playlists.filter((playlist) => playlist._id != action.data)
            }
            case "UPDATE_PLAYLIST": return {
                ...state,
                playlists: state.playlists.map((playlist) => {
                    if (playlist._id == action.data._id) {
                        return action.data;
                    }
                    return playlist;
                })
            }

            default:
                return state;
        }
    }, {
        songs: [],
        users: [],
        artists: [],
        playlists: []
    })

    let fetchSongs = async () => {
        let res = await fetch(song);
        let data = await res.json();
        if (res.ok) {
            dispatch({ type: "SET_SONGS", data })
        }
    }
    const fetchUsers = async () => {
        let res = await fetch(user + "all/", {
            headers: {
                "authorization": "berear " + token
            }
        })
        let data = await res.json();
        if (res.ok) {
            dispatch({ type: "SET_USERS", data: data });
        }
    }
    const fetchArtist = async () => {
        let res = await fetch(artist);
        let data = await res.json();
        dispatch({ type: "SET_ARTISTS", data });
    }

    const fetchAdminPlaylists = async () => {
        let res = await fetch(playlist + "admin/", {
            headers: {
                "authorization": "berear " + token
            }
        })
        let data = await res.json();
        if (res.ok) {
            dispatch({ type: "SET_PlAYLISTS", data: data });
        }
    }

    useEffect(() => {
        fetchSongs();
        fetchUsers();
        fetchArtist();
        fetchAdminPlaylists();
    }, [])

    return (
        <AdminContext.Provider value={{ ...admin, dispatch }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider