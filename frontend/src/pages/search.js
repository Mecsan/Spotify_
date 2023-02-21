import React, { useState } from 'react'
import Playitem from '../components/playItem';
import SongTable from '../components/SongTable';
import { FiSearch } from "react-icons/fi"
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ArtistItem from '../components/artistitem';
import { search as searchapi } from '../config/api';

function Search() {
  let [search, setsearch] = useState("");
  let [loading, setloading] = useState(false);
  let [lists, setlists] = useState([]);
  let [songs, setsongs] = useState([]);
  let [artists, setartists] = useState([]);

  let location = useLocation();

  const reset = () => {
    setlists([]);
    setartists([]);
    setsongs([]);
  }

  const handleChange = async (e) => {
    let val = e.target.value;
    setsearch(val);

    if (val == "") {
      reset();
      return;
    }
    setloading(true);
    let res = await fetch(searchapi + `?q=${val}`);
    let data = await res.json();
    setloading(false);
    setartists(data.artists);
    setsongs(data.songs);
    setlists(data.playLists);
  }
  return (
    <div className="right">
      <div className="details">

        <div className="search-input">
          <FiSearch color='black' />
          <input placeholder='what do you want to listen' type="text" value={search} onChange={handleChange} />
        </div>

        <div className="search_option">
          <div className={location.pathname == "/search" ? "filter current" : "filter"}>
            <Link to="" > all </Link>
          </div>
          <div className={location.pathname == "/search/songs" ? "filter current" : "filter"}>
            <Link to="songs" >songs</Link>
          </div>
          <div className={location.pathname == "/search/playlists" ? "filter current" : "filter"}>
            <Link to="playlists" >playlists</Link>
          </div>
          <div className={location.pathname == "/search/artists" ? "filter current" : "filter"}>
            <Link to="artists" >artists</Link>
          </div>
        </div>

        <Routes>
          <Route path='/' element={
            <>
              {
                songs?.length ? <>
                  <h2>top songs</h2>
                  <SongTable songs={songs.map((song, idx) => {
                    //only 4 songs in main search page
                    if (idx < 4) return song;
                  }).filter(song => song)} />
                </> : ""
              }

              {
                lists?.length ?
                  <>
                    <h2>Top playlists</h2>

                    <div className="songs_container">
                      {
                        <div className="songs">
                          {
                            lists.map((song, idx) => {
                              if (idx < 4) {
                                //only 4 playlists in main search page
                                return <Playitem key={idx} item={song} />
                              }
                            }).filter(play => play)
                          }
                        </div>
                      }
                    </div>
                  </>

                  : ""
              }
              {
                artists?.length ? <>
                  <h2>Top artists</h2>

                  <div className="artist_con">

                    <div className="artists" >
                      {
                        artists.map((artist, idx) => {
                          //only 3 artist in main search page
                          if (idx < 3) return artist
                        }).filter(one => one).map((artist) => {
                          return (
                            <ArtistItem artist={artist} />
                          )
                        })
                      }
                    </div>
                  </div>
                </> : null
              }

            </>
          }
          />

          <Route path='/songs' element={<>
            <SongTable songs={songs} />
          </>} />

          <Route path='/artists' element={<div className='full'>
            {artists ?
              <>
                <div className="artist_con">

                  <div className="artists" >
                    {
                      artists.map((artist) => {
                        return (
                          <ArtistItem artist={artist} />
                        )
                      })
                    }
                  </div>
                </div>
              </> : null
            }
          </div>} />

          <Route path='/playlists' element={
            <>
              {
                lists?.length ?
                  <div className="songs_container full">
                    {
                      <div className="songs">
                        {
                          lists.map((song, idx) => {
                            return <Playitem key={idx} item={song} />
                          })
                        }
                      </div>
                    }
                  </div>
                  : ""
              }</>
          } />
        </Routes>
      </div>
    </div>

  )
}

export default Search