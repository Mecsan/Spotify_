import React, { createContext, useReducer } from 'react'
import { useEffect } from 'react';

export const ActiveContext = createContext();
const lid = localStorage.getItem('activeidx');
const llist = localStorage.getItem('activeList');

function ActiveProvider(props) {

    let [active, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_ACTIVE": return {
                ...state,
                idx: action.data,
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
        idx: lid ? JSON.parse(lid) : -1,
        list: llist ? JSON.parse(llist) : [] // list of songs
    })

    useEffect(() => {
        let list = JSON.stringify(active.list);
        localStorage.setItem('activeList', list);
    }, [active.list])

    useEffect(() => {
        let item = JSON.stringify(active.idx);
        localStorage.setItem('activeidx', item);
    }, [active.idx])

    const isQueued = (key) => {
        if (active.list.length == 0) return true;
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