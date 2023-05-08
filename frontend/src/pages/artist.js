import React, { useEffect } from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import SongTable from '../components/SongTable';
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { artist as artistApi, image as imageApi } from '../config/api';
import { ActiveContext } from '../context/active';
import toast from 'react-hot-toast';
import Loading from '../components/loader';
function Artist() {

    let { id } = useParams();
    let [artist, setartist] = useState(null);
    let [load, setload] = useState(true)

    const { dispatch } = useContext(ActiveContext);

    const fetchArtist = async () => {
        setload(true)
        let res = await fetch(artistApi + id);
        let data = await res.json();
        setartist(data);
        setload(false)
    }

    useEffect(() => {
        fetchArtist();
    }, [id])

    const play = () => {
        if (artist.songs.length == 0) {
            toast.error("artist has no songs yet");
            return;
        }
        dispatch({ type: "SET_LIST", data: artist.songs })
        dispatch({ type: "SET_ACTIVE", data: 0 })
    }

    return (
        <div className="right">
            <div className="details">
                <Loading load={load}>
                    {
                        artist && <>
                            <div className="artist_info">
                                <img className='rounded' src={imageApi + artist.artist.logo} />
                                <div className="text">
                                    <h1>{artist.artist.name}</h1>
                                </div>
                            </div>

                            <div className="play_option">
                                <div className="play_" onClick={play}>
                                    <BsFillPlayCircleFill color='#43b943' size={50} />
                                </div>
                            </div>

                            <SongTable songs={artist.songs} />
                        </>
                    }
                </Loading>
            </div>
        </div>
    )
}

export default Artist