import React, { createContext, useReducer } from 'react'

export const PlaylistContext = createContext();
function PlaylistProvider(props) {

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

    return (
        <PlaylistContext.Provider value={{ dispatch, ...playlist, isOwn, isliked }}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistProvider