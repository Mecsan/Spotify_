import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import ArtistItem from '../components/artistitem';
import { artist } from '../config/api';

function ARtists() {
  const [artists, setartists] = useState(null);

  const fetchArtists = async () => {
    let res = await fetch(artist);
    let data = await res.json();
    if (res.ok) {
      setartists(data);
    }
  }

  useEffect(() => {
    fetchArtists();
  }, [])


  return (
    <div className="right">
      <div className="details">
        {artists ?
          <>
            <h2>Artists</h2>
            <div className="artist_con full">

              <div className="artists" >
                {
                  artists.map((artist, idx) => {
                    return (
                      <ArtistItem key={idx} artist={artist} />
                    )
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

export default ARtists