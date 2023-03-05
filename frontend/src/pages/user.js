import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import Playitem from '../components/playItem';
import { image, profile } from '../config/api';
import Avatar from 'react-avatar';

function User() {

    const [user, setuser] = useState(null);
    let { id } = useParams();

    useEffect(() => {
        let fetchUser = async () => {
            let res = await fetch(profile + id);
            let data = await res.json();
            setuser({ ...data })
        }

        fetchUser();
    }, [id])

    return (
        <div className="right">
            <div className="details">
                {
                    user && <>
                        <div className="artist_info">
                            {
                                user?.userinfo?.logo ?
                                    <img className='rounded' src={image + user.userinfo?.logo} />
                                    :
                                    <Avatar name={user?.userinfo?.name} />
                            }
                            <div className="text">
                                <h1>{user?.userinfo?.name}</h1>
                            </div>
                        </div>
                        {
                            user?.playlists?.length &&
                            <>
                                <h2>Public playlists</h2>
                                <div className="songs_container full">
                                    <div className="songs">
                                        {
                                            user?.playlists.map((song, idx) => {
                                                return <Playitem key={idx} item={song} />
                                            })
                                        }
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }

            </div>


        </div>
    )
}

export default User