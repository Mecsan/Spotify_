import React from 'react'
import Playitem from '../components/playItem'
import { useEffect, useState } from 'react';
import SongItem from '../components/songitem';
import ArtistItem from '../components/artistitem';
import { artist, playlist, song } from '../config/api';
import { useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import Loading from '../components/loader';

function Home() {
    const [songs, setsongs] = useState(null);
    const [artists, setartists] = useState(null);
    const [playlists, setplaylists] = useState(null);
    const [load, setload] = useState(true)

    const navigate = useNavigate();

    let songLimit = 5;
    let playlistlimit = 5;
    let artistlimit = 3;

    const fetchSongs = async () => {
        let res = await fetch(song + "?limit=" + songLimit);
        let data = await res.json();
        if (res.ok) {
            setsongs(data);
        }
    }

    const fetchArtists = async () => {
        let res = await fetch(artist + "?limit=" + artistlimit);
        let data = await res.json();
        if (res.ok) {
            setartists(data);
        }
    }

    const fetchPlaylists = async () => {
        let res = await fetch(playlist + "home?limit=" + playlistlimit);
        let data = await res.json();
        if (res.ok) {
            setplaylists(data);
        }
    }

    useEffect(() => {
        Promise.all([
            fetchSongs(),
            fetchArtists(),
            fetchPlaylists(),]).
            then(() => {
                setload(false)
            })
    }, [])

    return (
        <>
            <div className="right">
                <div className="details">
                    <Loading load={load}>
                        <>
                            {
                                playlists ?
                                    <>
                                        <div className="home-title">
                                            <h2>Top playlists</h2>
                                            <span onClick={() => navigate("/playlists")}>See all</span>
                                        </div>
                                        <div className="songs_container">
                                            <div className="songs">
                                                {
                                                    playlists.map((song, idx) => {
                                                        return <Playitem
                                                            key={idx}
                                                            item={song} />
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </> : null
                            }

                            {
                                songs ? <>
                                    <div className="home-title">
                                        <h2>Latest songs</h2>
                                        <span onClick={() => navigate("/songs")}>See all</span>
                                    </div>
                                    <div className="songs_container">
                                        <div className="songs">
                                            {
                                                songs.map((song, idx) => {
                                                    return (
                                                        <SongItem key={idx} idx={idx} song={song} songs={songs} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </> : ""
                            }

                            {artists ?
                                <>
                                    <div className="home-title">

                                        <h2>Popular artists</h2>
                                        <span onClick={() => navigate("/artists")}>See all</span>
                                    </div>
                                    <div className="artist_con">

                                        <div className="artists" >
                                            {
                                                artists.map((artist) => {
                                                    return (
                                                        <ArtistItem key={artist._id} artist={artist} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </> : ""
                            }
                        </>
                    </Loading>

                </div>
            </div>
        </>
    )
}

export default Home