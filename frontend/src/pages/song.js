import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { image } from '../config/api';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { LikeContext } from '../context/likes';
import { ActiveContext } from '../context/active';
import { AuthContext } from '../context/auth';
import toast from 'react-hot-toast';
import SongItem from '../components/songitem';
import SongTable from '../components/SongTable';
import Loading from '../components/loader';
import countTime from '../helper/countTime';
import { get as getSong, likeSong } from '../services/song';
import { get } from '../services/artist';

function Song() {

    let { id } = useParams();
    const { likes, dispatch, islike: funIslike } = useContext(LikeContext);
    const { token } = useContext(AuthContext)
    const { dispatch: playSong } = useContext(ActiveContext);

    let [song, setsong] = useState(null);
    const [artist, setartist] = useState(null);
    const [islike, setlike] = useState(false);
    const [load, setload] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let fetchSong = async () => {
            setload(true);
            let { data } = await getSong(id, token);
            setsong(data);
            setload(false)
        }
        if (id) {
            fetchSong();
        }
    }, [id])

    const fetchArtis = async (id) => {
        let { res, data } = await get(id);
        // move current song to 0th idx
        let temp = data?.songs?.filter(one => one._id != song._id)
        data.songs = [song, ...temp];
        setartist(data);
    }

    useEffect(() => {
        if(song && funIslike(song._id)){
            setlike(true);
        }else{
            setlike(false);
        }
    }, [likes])

    useEffect(() => {
        if (song) {
            fetchArtis(song.artist._id);
        }
    }, [song])

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
        let { data, res } = await likeSong(song._id, token);
        if (islike) {
            dispatch({ type: "RM_LIKE", data: song._id })
            toast("Removed from liked", { id: tid })
        } else {
            dispatch({ type: "ADD_LIKE", data: song })
            toast.success("Added to liked", { id: tid })
        }
    }

    const play = () => {
        playSong({ type: "SET_ACTIVE", data: 0 });
        playSong({ type: "SET_LIST", data: artist.songs })
    }

    return (
        <div className="right">
            <div className="details">
                <Loading load={load}>
                    <>
                        {
                            song && <>

                                <div className="playlist_cont">
                                    <div className="playlist_img">
                                        <img src={image + song.image} />
                                    </div>


                                    <div className="playlist_info">
                                        <span>
                                            song
                                        </span>
                                        <h1 >
                                            {song.name}
                                        </h1>

                                        <div className="playlist_extra">
                                            <span onClick={() => {
                                                navigate("/artist/" + song.artist._id);
                                            }}>{song.artist.name}</span>
                                            <span>{song?.createdAt?.substr(0, 4)}</span>
                                            <span>{countTime([song])}</span>
                                        </div>
                                    </div>

                                </div >

                                <div className="play_option">

                                    <div className="play_" onClick={play}>
                                        <BsFillPlayCircleFill color='#43b943' size={50} />
                                    </div>

                                    <div className="like" onClick={handleClick}>
                                        {funIslike(id) ?
                                            <AiFillHeart size={30} color='green' /> :
                                            <AiOutlineHeart size={30} />
                                        }
                                    </div>
                                </div>

                                <SongTable songs={[song]} />

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
                    </>
                </Loading>

            </div>
        </div >
    )
}

export default Song