import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import SongItem from '../components/songitem';
import SongTable from '../components/SongTable';
import { song } from '../config/api';

function Songs() {

  const [songs, setsongs] = useState(null);

  const fetchSongs = async () => {
    let res = await fetch(song);
    let data = await res.json();
    if (res.ok) {
      setsongs(data);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, [])
  return (
    <>
      <div className="right">
        <div className="details">
          {
            songs ? <>
              <h2>All Songs</h2 >
              <SongTable songs={songs} />
            </> : ""
          }
        </div>
      </div>
    </>
  )
}

export default Songs