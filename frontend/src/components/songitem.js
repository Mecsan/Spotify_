import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { image } from '../config/api';
import { ActiveContext } from '../context/active';
import { BsFillPlayCircleFill } from 'react-icons/bs'

function SongItem({ songs, song }) {

    const navigate = useNavigate();

    const { dispatch } = useContext(ActiveContext);

    return (
        <div className="song" onClick={() => { navigate("/song/" + song._id) }}>
            <img src={image + song?.image} alt="" />
            <div className="name">{song?.name}</div>
            <div className="play_hidden" onClick={(e) => {
                dispatch({ type: "SET_ACTIVE", data: song });
                dispatch({ type: "SET_LIST", data: songs })
                e.stopPropagation();
            }}>
                <BsFillPlayCircleFill color='#43b943' size={40} />
            </div>
        </div>
    )
}

export default SongItem