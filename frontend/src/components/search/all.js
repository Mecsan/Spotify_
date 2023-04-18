import React from 'react'
import { useContext } from 'react';
import { searchContext } from '../../pages/search';
import ArtistItem from '../artistitem';
import Playitem from '../playItem';
import { RotatingLines } from 'react-loader-spinner';
import SongTable from '../SongTable';
import Loading from '../loader';

function All() {

    let { songs, lists, artists, loading } = useContext(searchContext)
    return (
        <>
            {
                songs.length == 0 && artists.length == 0 && lists.length == 0 ?
                    "No result found"
                    : <>
                        {
                            songs.length ? <>
                                <h2>top songs</h2>
                                <SongTable songs={songs.map((song, idx) => {
                                    //only 4 songs in main search page
                                    if (idx < 4) return song;
                                }).filter(song => song)} />
                            </> : ""
                        }

                        {
                            lists.length ?
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
                            artists.length ? <>
                                <h2>Top artists</h2>

                                <div className="artist_con">

                                    <div className="artists" >
                                        {
                                            artists.map((artist, idx) => {
                                                //only 3 artist in main search page
                                                if (idx < 3) return artist
                                            }).filter(one => one).map((artist) => {
                                                return (
                                                    <ArtistItem key={artist._id} artist={artist} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </> : null
                        }

                    </>
            }
        </>

    )
}

export default All