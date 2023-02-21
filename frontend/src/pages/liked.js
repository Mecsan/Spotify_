import React, { useContext, useEffect, useState } from 'react'
import Upper from '../components/upper';
import { BsFillPlayCircleFill } from 'react-icons/bs'
import SongTable from '../components/SongTable';
import { LikeContext } from '../context/likes';
import { ActiveContext } from '../context/active';
import toast from 'react-hot-toast';

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

  return (
    <>
      <div className="right">
        <div className="details">
          {
            likes?.likes && <>

              <Upper liked={true} />

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