import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Loading from '../components/loader';
import Playitem from '../components/playItem';
import { getAll } from '../services/playlist';

function Playlists() {
  const [playlists, setplaylists] = useState(null);
  const [load, setload] = useState(true)

  const fetchPlaylists = async () => {
    setload(true);
    let { res, data } = await getAll();
    if (res.ok) {
      setplaylists(data);
    }
    setload(false)
  }

  useEffect(() => {
    fetchPlaylists();
  }, [])
  return (
    <div className="right">
      <div className="details">
        <Loading load={load}>
          {
            playlists ?
              <>
                <h2>Playlists</h2>
                <div className="songs_container full">
                  <div className="songs">
                    {
                      playlists.map((song, idx) => {
                        return <Playitem key={idx} item={song} />
                      })
                    }
                  </div>
                </div>
              </> : null
          }
        </Loading>

      </div>
    </div>
  )
}

export default Playlists