import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import Playitem from '../playItem';


function List() {
    const { lists } = useContext(searchContext);
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