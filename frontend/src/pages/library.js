import React, { useContext } from 'react'
import Playitem from '../components/playItem';
import { PlaylistContext } from '../context/playlist';
import { HiViewGridAdd } from 'react-icons/hi'
import { playlist } from '../config/api';
import { AuthContext } from '../context/auth';
import toast from 'react-hot-toast';
import Loading from '../components/loader';

function Library() {
    let { playlists, dispatch, load } = useContext(PlaylistContext);

    const { token } = useContext(AuthContext)
    const addPlaylist = async () => {
        let res = await fetch(playlist,
            {
                method: "POST",
                headers: {
                    "authorization": "berear " + token
                }
            })
        let data = await res.json();
        dispatch({ type: "ADD_PLAYLIST", data: data })
        toast.success("Playlist added");
        // can be navigate to newly created playlist
    }

    return (
        <div className="right">

            <div className="details">
                <Loading load={load}>
                    <>
                        <h2>Liked playlists</h2>
                        <div className="songs_container">

                            <div className="songs">
                                {
                                    playlists?.length ? playlists.map((song, idx) => {
                                        if (song.like) {
                                            return <Playitem key={idx} item={song} />
                                        }
                                    }).filter(one => one) : null
                                }
                            </div>
                        </div>
                        <h2>Your playlists</h2>


                        <div className="songs_container full">

                            <div className="songs">

                                <div className="small-add-playlist" onClick={addPlaylist}>
                                    <HiViewGridAdd size={60} />
                                    <h2>Add playlist</h2>
                                </div>
                                {
                                    playlists?.length ? playlists.map((song, idx) => {
                                        if (song.like) return;
                                        return <Playitem key={idx} item={song} />
                                    }).filter(one => one) : null
                                }
                            </div>
                        </div>
                    </>
                </Loading>

            </div>
        </div>
    )
}

export default Library