import React, { useState } from 'react'
import Songrow from './songrow'


function SongTable({ songs, removeFrom = () => { }, permission = false }) {

  let [isoption, setoption] = useState(-1);

  return (
    <>
      {
        songs?.length ?

          <div className="table"  >
            {
              songs && songs.map((song, idx) => {
                return <Songrow key={song._id}
                  songs={songs}
                  song={song}
                  id={idx + 1}
                  isoption={isoption}
                  setoption={setoption}
                  removeFrom={removeFrom}
                  permission={permission} />
              })
            }

          </div> : ""
      }

    </>

  )
}

export default SongTable