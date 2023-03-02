import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import Playitem from '../playItem';
import { RotatingLines } from 'react-loader-spinner';


function List() {
    const { lists, loading } = useContext(searchContext);
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
                : <>
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
                    }</>}
        </>

    )
}

export default List