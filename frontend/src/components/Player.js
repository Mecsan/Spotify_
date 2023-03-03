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
import { MdKeyboardArrowDown } from 'react-icons/md'
import { image, song } from '../config/api'
import { motion } from 'framer-motion'

function Player() {

    const { likes, dispatch, islike: islikeFun } = useContext(LikeContext);
    const { list, item, dispatch: setactive } = useContext(ActiveContext);
    const { token } = useContext(AuthContext)

    let [isload, setload] = useState(false);
    let [isplay, setplay] = useState(false);

    let [audio, setaudio] = useState({
        currTime: 0,
        volume: 50, // both in percentage for input range 
    });

    let location = useLocation();

    let [isliked, setlike] = useState(false);

    const [isbig, setbig] = useState(false);

    let audioRef = useRef(null);

    const navigate = useNavigate();

    let fetchSongData = async () => {
        setplay(false);
        setload(true);

        if (item) {
            audioRef.current.pause();
        }
        let url = song + "songdata/" + item.song;

        audioRef.current.src = url;
        audioRef.current.volume = audio.volume / 100;

        setload(false);
        setaudio({
            ...audio,
            currTime: 0,
        })

        setplay(true);
        audioRef.current.play();

    }

    const handleNext = () => {
        let curId
        list.forEach((song, idx) => {
            if (song._id == item._id) {
                curId = idx;
                return
            }
        });
        curId = curId + 1 >= list.length ? 0 : curId + 1;
        setactive({ type: "SET_ACTIVE", data: list[curId] })
    }


    const handlePre = () => {
        let curId
        list.forEach((song, idx) => {
            if (song._id == item._id) {
                curId = idx;
                return
            }
        });
        curId = curId - 1 >= 0 ? curId - 1 : list.length - 1;
        setactive({ type: "SET_ACTIVE", data: list[curId] })
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

    useEffect(() => {
        if (item) {
            fetchSongData();
        }
    }, [item])

    useEffect(() => {
        if (token && likes.likes && item) {
            if (islikeFun(item._id)) {
                setlike(true);
            } else {
                setlike(false);
            }
        } else {
            setlike(false);
        }
    }, [item, likes, token])

    let [start, setstart] = useState(0);

    return (
        <>
            {
                item &&
                <>
                    <div className="player">

                        <audio ref={audioRef}
                            onWaiting={() => { setload(true) }}
                            onPlaying={() => { setload(false) }}
                            onEnded={() => handleNext()}
                            onTimeUpdate={updateTime}></audio>

                        <div className="info">
                            <img src={image + item.image} alt="" />
                            <div className="namear" >

                                <div className="name" onClick={() => { navigate("/song/" + item._id) }}>
                                    {item.name}
                                </div>

                                <div className="artist" onClick={() => { navigate("/artist/" + item.artist._id) }}>
                                    {item.artist.name}
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

                                {/* // song can have 3 states  pause,play,loading data */}

                                {
                                    isload ?
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
                                <MdSkipNext
                                    onClick={handleNext} size={26} />
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

                    <div className="small-player" onClick={() => setbig(true)}>
                        <div className="small-info">
                            <img src={image + item.image} alt="" />
                            <div className="namear" >

                                <div className="name" >
                                    {item.name}
                                </div>

                                <div className="artist"  >
                                    {item.artist.name}
                                </div>

                            </div>
                        </div>
                        <div className="small-btns">

                            <div className="like" onClick={LikeSong}>
                                {
                                    isliked ?
                                        <AiFillHeart color='green' size={23} /> :
                                        <AiOutlineHeart color='white' size={23} />
                                }
                            </div>
                            {
                                isplay ?
                                    <MdPauseCircleFilled size={38} color="white" onClick={toggleplay} />
                                    :
                                    <AiFillPlayCircle size={38} color="white" onClick={toggleplay} />
                            }

                        </div>
                    </div>
                    {

                        <motion.div

                            initial={{
                                y: "700px",
                                opacity: 0
                            }}
                            animate={isbig ? {
                                y: "0px",
                                opacity: 1,
                            } : {
                                y: "700px",
                                opacity: 0,
                            }}


                            transition={{
                                type: "just"
                            }}
                            onTouchStart={(e) => {
                                let start = e.touches[0].clientY;
                                setstart(start);
                            }}
                            onTouchEnd={(e) => {
                                let end = e.changedTouches[0].clientY;
                                if (start + 100 < end) {
                                    setbig(false);
                                }
                            }}
                            className="big-player">

                            < div className="close-big" onClick={() => setbig(false)}>
                                <MdKeyboardArrowDown size={40} color="white" />
                            </ div>

                            <div className="big-img">
                                <img src={image + item.image} alt="" />
                            </div>

                            <div className="big-info">
                                <div className="namear" >

                                    <div className="name" onClick={() => {
                                        setbig(false);
                                        navigate("/song/" + item._id)
                                    }}>
                                        {item.name}
                                    </div>

                                    <div className="artist" onClick={() => {
                                        setbig(false);
                                        navigate("/artist/" + item.artist._id)
                                    }}>
                                        {item.artist.name}
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

                            <div className="big-track">
                                <span className="current_time">
                                    {
                                        isNaN(audio.currTime * audioRef?.current?.duration / 6000) ? 0 : (audio.currTime * audioRef?.current?.duration / 6000).toFixed(2)}
                                </span>
                                <span className="total_time">
                                    {
                                        isNaN(audioRef?.current?.duration / 60) ? 0 : (audioRef?.current?.duration / 60).toFixed(2)
                                    }
                                </span>

                                <input className='prevent-drag' type="range" value={audio ? audio?.currTime : '0'} onInput={(e) => {
                                    setaudio((audio) => { return { ...audio, currTime: e.target.value } });
                                    let x = e.target.value * audioRef.current.duration / 100;
                                    audioRef.current.currentTime = x;
                                }} />
                            </div>

                            <div className="controls">
                                <div className="play_btns">
                                    <AiFillStepBackward onClick={handlePre} size={35} />

                                    {/* // song can have 3 states  pause,play,loading data */}

                                    {
                                        isload ?
                                            <Oval
                                                height={50}
                                                color="#4fa94d"
                                                ariaLabel='oval-loading'
                                                secondaryColor="#4fa94d"
                                                strokeWidth={4}
                                                strokeWidthSecondary={3}
                                            /> : <div className="play">

                                                {
                                                    isplay ?
                                                        <MdPauseCircleFilled size={50} onClick={toggleplay} />
                                                        :
                                                        <AiFillPlayCircle size={50} onClick={toggleplay} />
                                                }
                                            </div>

                                    }
                                    <MdSkipNext
                                        onClick={handleNext} size={35} />
                                </div>
                            </div>

                            <div className="extra">
                                <MdQueueMusic size={18} onClick={() => {
                                    setbig(false);
                                    navigate("/playing");
                                }} color={location.pathname == "/playing" ? "green" : "white"} />
                                <div className="sound">
                                    <AiFillSound size={18} />
                                    <input
                                        className='prevent-drag'
                                        type="range" value={audio ? audio?.volume : 50} onInput={(e) => {
                                            setaudio((audio) => { return { ...audio, volume: e.target.value } });
                                            audioRef.current.volume = e.target.value / 100;
                                        }} />
                                </div>
                            </div>
                        </motion.div>
                    }
                </>
            }
        </>

    )
}

export default Player
