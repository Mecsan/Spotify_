import React, { useEffect, useState, useContext } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BsThreeDots, BsFillCaretRightFill } from 'react-icons/bs'
import Options from './options';
import { LikeContext } from '../context/likes';
import { ActiveContext } from '../context/active';
import { likeSong } from '../util/likesong'
import { PlaylistContext } from '../context/playlist';
import { AuthContext } from '../context/auth';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { image } from '../config/api';
import countTime from '../helper/countTime';

function Songrow({ songs, id, song, removeFrom, isoption, setoption, permission }) {
    const { dispatch, likes, islike: funIslike } = useContext(LikeContext);
    const { dispatch: setactive, idx, isQueued, list } = useContext(ActiveContext);
    const { playlists } = useContext(PlaylistContext);
    const { token } = useContext(AuthContext)
    let [islike, setlike] = useState(false);

    const { id: pid } = useParams();

    const navigate = useNavigate();

    const handleclick = async () => {
        if (token == null) {
            toast.error("Please login to continue");
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

    const playThis = () => {
        setactive({ type: "SET_ACTIVE", data: id - 1 });
        setactive({ type: "SET_LIST", data: songs });
    }
    useEffect(() => {
        if (token && likes.likes) {
            if (funIslike(song._id)) {
                setlike(true);
            } else {
                setlike(false);
            }
        } else {
            setlike(false);
        }
    }, [likes])


    useEffect(() => {

        return () => {
            setoption(-1);
        }
    }, [])

    const addToQueue = () => {
        setactive({ type: "ADD_TO_QUEUE", data: song });
        toast.success("added to queue");
    }



    return (
        <>
            <div className={song._id == list[idx]?._id ? "song_row playing" : "song_row"}
                onMouseLeave={() => setoption(-1)}
            >
                <span>{id}</span>
                <div className='small_song t_name' onClick={playThis}>
                    <img src={image + song.image} />
                    <span>
                        {song.name}
                        <div className='small_artist' onClick={(e) => {
                            e.stopPropagation();
                            navigate("/artist/" + song.artist._id)
                        }}>
                            <span>
                                {song.artist.name}
                            </span>
                        </div>
                    </span>
                </div>
                <div className='t_artist' onClick={() => {
                    navigate("/artist/" + song.artist._id)
                }}>
                    <span>
                        {song.artist.name}
                    </span>
                </div>

                <div className='likegr' onClick={handleclick}>
                    {
                        <>
                            <div className="small_like">
                                <AiOutlineHeart />
                            </div>
                            {
                                islike &&
                                <div className="small_liked">
                                    <AiFillHeart color='green' />
                                </div>
                            }
                        </>
                    }
                </div>
                <div>{
                    countTime([song])
                }</div>

                <div className="playlist_option" >
                    <BsThreeDots onClick={(e) => {
                        setoption(id)
                    }
                    } />
                    {
                        isoption == id &&
                        <div className="options">

                            {

                                playlists?.length ?
                                    < div >
                                        {
                                            permission &&
                                            <div onClick={() => {
                                                removeFrom(song._id)
                                            }}>remove from this playlist</div>
                                        }
                                        <div className='addTolist'>
                                            add to playlist <BsFillCaretRightFill />
                                            <Options
                                                playlists={playlists.filter(one => !one.like)}
                                                id={song._id}
                                                setoption={setoption}
                                                cuurentPid={pid}
                                            />
                                        </div>
                                    </div> : null
                            }

                            {
                                !isQueued(song._id) &&
                                <div className="add-to-queue" onClick={addToQueue}>
                                    add to queue
                                </div>
                            }

                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Songrow