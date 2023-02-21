import React, { useContext } from 'react'
import { ActiveContext } from '../context/active';
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { image, playlist } from '../config/api';

function Playitem({ item }) {

    const { dispatch } = useContext(ActiveContext)

    const fetchSongs = async () => {
        let res = await fetch(playlist + item._id);
        let data = await res.json();
        if (data.playlists.songs.length == 0) {
            toast.error("no songs in playlist");
            return;
        }
        dispatch({ type: "SET_LIST", data: data.playlists.songs })
        dispatch({ type: "SET_ACTIVE", data: data.playlists.songs[0] })
    }

    const navigate = useNavigate();

    return (
        <div className="song" onClick={() => { navigate("/playlist/" + item._id) }}>
            <img src={image + item.image} alt="" />
            <div className="name">{item?.name}</div>
            <div className="desc">{
                item?.desc.length < 30 ? item?.desc : item?.desc.substr(0, 30) + "..."
            }</div>
            <div className="play_hidden" onClick={(e) => {
                fetchSongs();
                e.stopPropagation();
            }}>
                <BsFillPlayCircleFill color='#43b943' size={40} />
            </div>
        </div>
    )
}

export default Playitem