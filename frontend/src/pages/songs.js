import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Loading from '../components/loader';
import SongItem from '../components/songitem';
import SongTable from '../components/SongTable';
import { song } from '../config/api';

function Songs() {

  const [songs, setsongs] = useState(null);
  let [load, setload] = useState(true)

  const fetchSongs = async () => {
    setload(true)
    let res = await fetch(song);
    let data = await res.json();
    if (res.ok) {
      setsongs(data);
    }
    setload(false)
  }

  useEffect(() => {
    fetchSongs();
  }, [])
  return (
    <>
      <div className="right">
        <div className="details">
          <Loading load={load}>
            {
              songs ? <>
                <h2>All Songs</h2 >
                <SongTable songs={songs} />
              </> : ""
            }
          </Loading>
        </div>
      </div>
    </>
  )
}

export default Songs