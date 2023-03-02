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
                playlists: [ action.data, ...state?.playlists]
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
        playlists: [], // user's all playlist
        currPlayList: {}, //when we are on perticular playlist page this indicates current playlist info with songs also   
    })

    return (
        <PlaylistContext.Provider value={{ dispatch, ...playlist }}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default PlaylistProvider