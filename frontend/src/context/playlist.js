import React, { createContext, useReducer } from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { playlist as playlistApi } from '../config/api';
import { getLikedLists, getPlayLists } from '../services/playlist';
import { AuthContext } from './auth';

export const PlaylistContext = createContext();
function PlaylistProvider(props) {

    const { token } = useContext(AuthContext)

    const myfun = (state, action) => {
        switch (action.type) {
            case "SET_PLAYLISTS": return {
                ...state,
                playlists: action.data
            };
            case "DELETE_PLAYLIST": return {
                ...state,
                playlists: state.playlists.filter((one) => one._id != action.data)
            };
            case "ADD_PLAYLIST": return {
                ...state,
                playlists: [action.data, ...state?.playlists]
            };
            case "UPDATE_PLAYLIST": return {
                ...state,
                playlists: state.playlists.map((one) => {
                    if (one._id == action.data._id) {
                        return action.data;
                    }
                    return one;
                })
            };
            case "SET_PRIVATE": return {
                ...state,
                currPlayList: {
                    ...state.currPlayList,
                    isPrivate: action.data
                }
            }
                ;
            case "SET_CURR_PLAYLIST": return {
                ...state,
                currPlayList: action.data,
            };

            case "REMOVE_SONG": return {
                ...state,
                currPlayList: {
                    ...state.currPlayList,
                    songs: state.currPlayList.songs.filter((one) => one._id != action.data)
                }
            }

            default:
                return state;
        }
    }

    const [playlist, dispatch] = useReducer(myfun, {
        playlists: [], // user's all playlist & liked playlist
        currPlayList: {}, //when we are on perticular playlist page this indicates current playlist info with songs also   
    })

    const [load, setload] = useState(true)

    const isliked = (id) => {
        let res = playlist.playlists.find((one) => {
            if (one._id == id) return true;
        })
        if (res && res.like) return true;
        return false;
    }

    const isOwn = (id) => {
        let res = playlist.playlists.find((one) => {
            if (one._id == id) return true;
        })
        if (res == undefined) return false;
        if (res && res.like) return false;
        return true;
    }

    const fetchPlaylist = async () => {
        let { res, data } = await getPlayLists(token);
        return data;
    }

    const getLikedlist = async () => {
        let { res, data } = await getLikedLists(token);
        return data.map((one) => { return { ...one, like: true } });
    }

    useEffect(() => {
        const makelist = async () => {
            setload(true);
            const results = await Promise.all([fetchPlaylist(), getLikedlist()]);
            dispatch({ type: "SET_PLAYLISTS", data: [...results[0], ...results[1]] })
            setload(false)
        }

        if (token) {
            makelist();
        } else {
            dispatch({ type: "SET_PLAYLISTS", data: [] })
        }
    }, [token])

    return (
        <PlaylistContext.Provider value={{ dispatch, ...playlist, isOwn, isliked, load }}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistProvider