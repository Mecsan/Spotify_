import React, { useEffect, useRef, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { AiFillHeart, AiOutlineHeart, AiFillPlayCircle, AiFillStepBackward, AiFillSound } from 'react-icons/ai'
import { MdSkipNext, MdQueueMusic, MdPauseCircleFilled } from 'react-icons/md'
import { Oval } from 'react-loader-spinner'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActiveContext } from '../context/active'
import { AuthContext } from '../context/auth'
import { LikeContext } from '../context/likes';
import { likeSong } from '../util/likesong'
import { image, song } from '../config/api'
import MobilePlayer from './mobileplayer'

function Player() {
    const { likes, dispatch, islike: islikeFun } = useContext(LikeContext);
    const { list, idx, dispatch: setactive } = useContext(ActiveContext);
    const { token } = useContext(AuthContext)

    const [isload, setload] = useState(false);
    const [isplay, setplay] = useState(false);
    const [isliked, setlike] = useState(false);
    const [hasInteracted, setInteract] = useState(false);
    let [audio, setaudio] = useState({
        currTime: 0,
        volume: 50, // both in percentage for input range 
    });

    let audioRef = useRef(null);

    let location = useLocation();
    const navigate = useNavigate();

    const handleNext = () => {
        let curId = (idx + 1) % list.length
        setactive({ type: "SET_ACTIVE", data: curId })
    }


    const handlePre = () => {
        let curId = (idx + list.length - 1) % list.length
        setactive({ type: "SET_ACTIVE", data: curId })
    }

    let toggleplay = (e) => {
        e.stopPropagation();
        if (isplay) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setplay((pre) => !pre);
    }

    const updateTime = () => {
        if (audioRef.current) {
            let x = audioRef.current.currentTime / audioRef.current.duration;
            setaudio({ ...audio, currTime: Number.isNaN(x) ? 0 : x * 100 });
        }
    }

    const getTime = () => {

    }

    const LikeSong = async (e) => {
        e.stopPropagation();
        if (token == null) {
            toast.error("Login to continue");
            return;
        }
        let tid
        if (isliked) {
            tid = toast.loading("removing...")
        } else {
            tid = toast.loading("adding");
        }
        let item = list[idx]
        await likeSong(item, token);
        if (isliked) {
            dispatch({ type: "RM_LIKE", data: item._id })
            toast("Removed from liked", { id: tid })
        } else {
            dispatch({ type: "ADD_LIKE", data: item })
            toast.success("Added to liked", { id: tid })
        }

        setlike(pre => !pre);
    }

    const handleinput = (e) => {
        setaudio((audio) => { return { ...audio, currTime: e.target.value } });
        let x = e.target.value * audioRef.current.duration / 100;
        audioRef.current.currentTime = x;
    }

    let fetchSongData = async () => {
        setplay(false);
        audioRef.current.pause();

        let url = song + "songdata/" + list[idx].song;
        audioRef.current.src = url;
        setaudio({
            ...audio,
            currTime: 0,
        })
        if (hasInteracted) {
            setplay(true);
            audioRef.current.play();
        }
    }

    useEffect(() => {
        const handle = () => {
            if (!hasInteracted) setInteract(true);
        }
        window.addEventListener('keydown', handle)
        window.addEventListener('mousemove', handle)

        return () => {
            window.removeEventListener('keydown', handle)
            window.removeEventListener('mousemove', handle)
        }
    }, [])

    useEffect(() => {
        if (idx > -1) {
            fetchSongData();
        }
    }, [idx])

    useEffect(() => {
        if (token && likes.likes && idx > -1) {
            if (islikeFun(list[idx]._id)) {
                setlike(true);
            } else {
                setlike(false);
            }
        } else {
            setlike(false);
        }
    }, [idx, likes, token])


    return (
        <>
            {
                idx > -1 &&
                <>
                    <div className="player">

                        <audio
                            ref={audioRef}
                            onWaiting={() => { setload(true) }}
                            onPlaying={() => { setload(false) }}
                            onEnded={() => handleNext()}
                            onTimeUpdate={updateTime}>
                        </audio>

                        <div className="info">
                            <img src={image + list[idx].image} alt="" />

                            <div className="namear" >
                                <div className="name" onClick={() => { navigate("/song/" + list[idx]._id) }}>
                                    {list[idx].name}
                                </div>
                                <div className="artist" onClick={() => { navigate("/artist/" + list[idx].artist._id) }}>
                                    {list[idx].artist.name}
                                </div>
                            </div>

                            <div className="like" onClick={LikeSong}>
                                {
                                    isliked ?
                                        <AiFillHeart color='green' size={23} /> :
                                        <AiOutlineHeart color='white' size={23} />
                                }
                            </div>
                        </div>

                        <div className="controls">
                            <div className="play_btns">
                                <AiFillStepBackward onClick={handlePre} size={26} />

                                {isload ?
                                    <Oval
                                        height={38}
                                        color="#4fa94d"
                                        ariaLabel='oval-loading'
                                        secondaryColor="#4fa94d"
                                        strokeWidth={4}
                                        strokeWidthSecondary={3}
                                    /> : <div className="play">
                                        {
                                            isplay ?
                                                <MdPauseCircleFilled size={38} onClick={toggleplay} />
                                                :
                                                <AiFillPlayCircle size={38} onClick={toggleplay} />
                                        }
                                    </div>

                                }

                                <MdSkipNext onClick={handleNext} size={26} />
                            </div>


                            <div className="track">
                                <span className="current_time">
                                    {
                                        isNaN(audio.currTime * audioRef?.current?.duration / 6000) ? 0 : (audio.currTime * audioRef?.current?.duration / 6000).toFixed(2)}
                                </span>

                                <span className="total_time">
                                    {
                                        isNaN(audioRef?.current?.duration / 60) ? 0 : (audioRef?.current?.duration / 60).toFixed(2)
                                    }
                                </span>

                                <input type="range" value={audio ? audio?.currTime : '0'} onInput={handleinput} />

                            </div>
                        </div>

                        <div className="extra">

                            <MdQueueMusic onClick={() => {
                                navigate("/playing");
                            }} color={location.pathname == "/playing" ? "green" : "white"} />
                            <div className="sound">
                                <AiFillSound />
                                <input type="range" value={audio ? audio?.volume : 50} onInput={(e) => {
                                    setaudio((audio) => { return { ...audio, volume: e.target.value } });
                                    audioRef.current.volume = e.target.value / 100;
                                }} />
                            </div>
                        </div>
                    </div>

                    <MobilePlayer
                        item={list[idx]}
                        LikeSong={LikeSong}
                        isliked={isliked}
                        isplay={isplay}
                        toggleplay={toggleplay}
                        audio={audio}
                        audioRef={audioRef}
                        setaudio={setaudio}
                        isload={isload}
                        handleNext={handleNext}
                        handlePre={handlePre}
                    />
                </>
            }
        </>

    )
}

export default Player
