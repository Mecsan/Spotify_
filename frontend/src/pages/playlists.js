import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Playitem from '../components/playItem';
import { playlist } from '../config/api';

function Playlists() {
  const [playlists, setplaylists] = useState(null);
  const fetchPlaylists = async () => {
    let res = await fetch(playlist+"home");
    let data = await res.json();
    if (res.ok) {
      setplaylists(data);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, [])
  return (
    <div className="right">
      <div className="details">
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
      </div>
    </div>
  )
}

export default Playlists