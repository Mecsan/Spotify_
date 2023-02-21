import React, { createContext, useReducer } from 'react'

export const ActiveContext = createContext();
function ActiveProvider(props) {

    let [active, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_ACTIVE": return {
                ...state,
                item: action.data,
            }
            case "SET_LIST": return {
                ...state,
                list: action.data
            }
            case "ADD_TO_QUEUE": return {
                ...state,
                list: [...state.list, action.data]
            }
            default:
                return state;
        }
    }, {
        item: null,
        list: [] //songs of a playlist for next & pre button
    })

    const isQueued = (key) => {
        if(active.list.length == 0 ) return true;
        if (active.list.find(one => one._id == key)) return true;
        return false;
    }

    return (
        <ActiveContext.Provider value={{ ...active, dispatch, isQueued }}>
            {props.children}
        </ActiveContext.Provider>
    )
}

export default ActiveProvider