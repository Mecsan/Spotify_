import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import Playitem from '../playItem';
import { RotatingLines } from 'react-loader-spinner';
import Loading from '../loader';


function List() {
    const { lists, loading } = useContext(searchContext);
    return (
        <>
            {
                lists.length ?
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
                    : "No playlists found"
            }
        </>

    )
}

export default List