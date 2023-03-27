import React, { useContext, useEffect, useState } from 'react'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import SongTable from '../components/SongTable';
import { LikeContext } from '../context/likes';
import { ActiveContext } from '../context/active';
import toast from 'react-hot-toast';
import { image } from '../config/api';

function Liked() {

  const { likes } = useContext(LikeContext);
  const { dispatch: setactive } = useContext(ActiveContext);

  const playPlaylist = () => {
    if (likes.likes.length) {
      setactive({ type: "SET_LIST", data: likes.likes });
      setactive({ type: "SET_ACTIVE", data: likes.likes[0] })
    } else {
      toast.error("No song in liked")
    }
  }

  let countTime = (songs) => {
    let time = 0;
    songs?.forEach(like => {
      time += parseInt(like?.duration)
    });
    return (time / 60).toFixed(2)
  }


  return (
    <>
      <div className="right">
        <div className="details">
          {
            likes?.likes && <>
              <div className="playlist_cont">
                <div className="playlist_img" >
                  <img src={image + "1667816796524.png"} />
                </div>
                <div className="playlist_info">
                  <span>
                    likes
                  </span>
                  <h1 >
                    liked songs
                  </h1>
                  <div className="playlist_extra">
                    <span> {likes?.likes.length} songs</span>
                    <span>{countTime(likes?.likes)}</span>
                  </div>
                </div>

              </div >

              <div className="play_option" style={{ cursor: "pointer" }} onClick={playPlaylist}>
                {

                  <BsFillPlayCircleFill color='#43b943' size={50} />

                }
              </div>

              <SongTable songs={likes.likes} />
            </>
          }
        </div>
      </div>
    </>


  )
}

export default Liked