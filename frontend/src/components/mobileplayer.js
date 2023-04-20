import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { image } from '../config/api';
import { AiFillHeart, AiOutlineHeart, AiFillPlayCircle, AiFillStepBackward, AiFillSound } from 'react-icons/ai'
import { MdSkipNext, MdQueueMusic, MdPauseCircleFilled } from 'react-icons/md'
import { Oval } from 'react-loader-spinner'
import { MdKeyboardArrowDown } from 'react-icons/md'

function MobilePlayer({ item, LikeSong, isliked, isplay, toggleplay, audio, audioRef, setaudio, isload, handleNext, handlePre }) {

    const [isbig, setbig] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const variants = {
        open: { opacity: 1, y: "0%" },
        closed: { opacity: 0, y: "100%" },
    }
    return (
        < >
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
                isbig ?
                    <div
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

                    </div> : null
            }
        </>
    )
}

export default MobilePlayer