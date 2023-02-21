import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Upper from '../components/upper';
import { song as songApi } from '../config/api';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { LikeContext } from '../context/likes';
import { likeSong } from '../util/likesong';
import { ActiveContext } from '../context/active';
import { AuthContext } from '../context/auth';
import Options from '../components/options';
import { PlaylistContext } from '../context/playlist';
import toast from 'react-hot-toast';
import SongItem from '../components/songitem';
import { artist as artistApi } from '../config/api';



function Song() {

    let { id } = useParams();

    const { dispatch, likes, islike: funIslike } = useContext(LikeContext);
    const { token } = useContext(AuthContext)
    const { dispatch: playSong } = useContext(ActiveContext);
    const { playlists } = useContext(PlaylistContext)

    let [song, setsong] = useState(null);
    const [artist, setartist] = useState(null);
    const [islike, setlike] = useState(false);

    useEffect(() => {
        let fetchSong = async () => {
            let res = await fetch(songApi + id);
            let data = await res.json();
            setsong(data);
        }
        if (id) {
            fetchSong();
        }
    }, [id])

    const fetchArtis = async (id) => {
        let res = await fetch(artistApi + id);
        let data = await res.json();
        setartist(data);
    }

    useEffect(() => {
        if (song) {
            fetchArtis(song.artist._id);
        }
    }, [song])

    useEffect(() => {
        if (token && likes.likes) {
            if (funIslike(id)) {
                setlike(true);
            } else {
                setlike(false);
            }
        }
    }, [likes])

    const handleClick = async () => {
        if (token == null) {
            toast.error("Login to continue..")
            return;
        }
        let tid
        if (islike) {
            tid = toast.loading("removing...")
        } else {
            tid = toast.loading("adding");
        }
        await likeSong(song, token);
        if (islike) {
            dispatch({ type: "RM_LIKE", data: song._id })
            toast("Removed from liked", { id: tid })
        } else {
            dispatch({ type: "ADD_LIKE", data: song })
            toast.success("Added to liked", { id: tid })
        }

        setlike(pre => !pre);
    }

    const play = () => {
        playSong({ type: "SET_ACTIVE", data: song });
        playSong({ type: "SET_LIST", data: artist.songs })
    }

    return (
        <div className="right">
            <div className="details">
                {
                    song && <>

                        <Upper item={song} song={true} />

                        <div className="play_option">

                            <div className="play_" onClick={play}>
                                <BsFillPlayCircleFill color='#43b943' size={50} />
                            </div>
                            {/* <span>{song.likes} likes </span> */}

                            <div className="like" onClick={handleClick}>
                                {islike ?
                                    <AiFillHeart size={30} color='green' /> :
                                    <AiOutlineHeart size={30} />
                                }
                            </div>

                            {token && playlists?.length ?
                                <div className="play_">
                                    <div className='addTolist'>Add to
                                        <Options id={song._id} playlists={playlists} />
                                    </div>
                                </div>
                                : ""
                            }

                        </div>

                        {
                            artist && artist.songs.filter((song, idx) => {
                                if (song._id == id) return false;
                                if (idx > 4) return false;
                                return true;
                            }).length ? <>
                                <h2>More by {artist.artist.name}</h2>
                                <div className="songs_container">
                                    <div className="songs">
                                        {
                                            artist.songs.filter((song, idx) => {
                                                if (song._id == id) return false;
                                                if (idx > 4) return false;
                                                return true;
                                            }).map((song, idx) => {
                                                return (
                                                    <SongItem key={idx} song={song}
                                                        songs={artist.songs} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </> : null
                        }
                    </>
                }
            </div>
        </div >
    )
}

export default Song