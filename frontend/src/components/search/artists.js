import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import ArtistItem from '../artistitem'
import { RotatingLines } from 'react-loader-spinner';


function Artist() {
    const { artists, loading } = useContext(searchContext)
    return (
        <>
            {loading ?
                <div className="center">
                    <RotatingLines
                        strokeColor="green"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="45"
                        visible={true}
                    />
                </div>
                : <div className='full'>

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
                </div>}
        </>

    )
}

export default Artist