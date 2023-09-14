import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { songToPlaylist } from '../config/api';
import { AuthContext } from '../context/auth';
import { addSong } from '../services/playlist';

function Options({ id, setoption = null, playlists, cuurentPid = null }) {
    // id = songid
    // playlists = user's playlists / admin playlist
    // currentPid if any 

    const { token } = useContext(AuthContext);

    const addToPlayList = async (pid) => {
        const { res, data } = await addSong(pid, id, token);
        if (data?.success == false) {
            toast(`${data.msg}`);
        } else {
            toast.success(`Added in ${data.name}`);
            if (setoption) {
                setoption(-1);
            }
        }
    }

    return (
        <>
            {
                playlists &&
                < div className="allplaylists" >
                    {
                        playlists.map((play) => {
                            if (cuurentPid == play._id) return ""
                            return <div key={play._id} onClick={() => addToPlayList(play._id)}>{play.name}</div>
                        })
                    }
                </div >

            }
        </>
    )
}

export default Options