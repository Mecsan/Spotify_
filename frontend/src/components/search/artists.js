import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import ArtistItem from '../artistitem'
import { RotatingLines } from 'react-loader-spinner';
import Loading from '../loader';


function Artist() {
    const { artists, loading } = useContext(searchContext)
    return (
        <div className='full'>
            {artists.length ?
                <>
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
                </> : "no artist found"
            }
        </div>
    )
}

export default Artist