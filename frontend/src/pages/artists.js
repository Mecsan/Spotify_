import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import ArtistItem from '../components/artistitem';
import Loading from '../components/loader';
import { getArtists } from '../services/artist';

function ARtists() {
  const [artists, setartists] = useState(null);
  const [load, setload] = useState(true)

  const fetchArtists = async () => {
    setload(true)
    let { res, data } = await getArtists();
    if (res.ok) {
      setartists(data);
    }
    setload(false)
  }

  useEffect(() => {
    fetchArtists();
  }, [])


  return (
    <div className="right">
      <div className="details">
        <Loading load={load}>
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
        </Loading>

      </div>
    </div>
  )
}

export default ARtists