import React from 'react'
import { useState } from 'react';
import { useContext } from 'react'
import ProfileForm from '../components/profileform';
import { image } from '../config/api';
import Avatar from 'react-avatar';
import { AuthContext } from '../context/auth'

function Profile() {
    const { user } = useContext(AuthContext);
    let [isform, setform] = useState(false);
    return (
        <div className="right">
            <div className="details">
                {user && <>
                    <div className="artist_info pointer" onClick={() => setform(true)}>
                        {
                            user.logo ?
                                <img className='rounded' src={image + user.logo} /> :
                                <Avatar name={user.name} />
                        }
                        <div className="text">
                            <h1>{user.name}</h1>
                            <p>{user.mail}</p>
                        </div>
                    </div>
                    <div className='edit_profile' onClick={() => setform(!isform)}>
                        Edit profile
                    </div>
                </>
                }
                {
                    isform && <ProfileForm close={setform} item={user} />
                }
            </div>
        </div>
    )
}

export default Profile