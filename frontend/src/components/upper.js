import React from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { image } from '../config/api';
import { LikeContext } from '../context/likes';

function Upper({ item, setform, hasPermission = false, song, liked }) {

    // same component has been used to see likes page as well as to see & edit current user's playlist & to see other playlist & just play it.and also to see song details

    // hasPermission will only be true in case of current user seeing his playlist , so he can edit modify dlt etc

    const navigate = useNavigate();

    let { likes } = useContext(LikeContext);

    let countcn = (liked, song, item) => {
        if (song) return 1;
        if (liked) return likes.likes.length
        return item?.songs?.length
    }

    let countTime = (liked, song, item) => {
        if (song) return (item?.duration / 60).toFixed(2)
        if (liked) {
            let time = 0;
            likes?.likes?.forEach(like => {
                time += parseInt(like?.duration)
            });
            return (time / 60).toFixed(2)
        }
        let time = 0;
        item?.songs?.forEach(like => {
            time += parseInt(like?.duration)
        });
        return (time / 60).toFixed(2)

    }

    const data = {
        type: liked ? "likes" : song ? "song" : "playlist",
        name: liked ? "liked songs" : item.name,
        desc: liked ? null : song ? null : item.desc,
        image: liked ? "1667816796524.png" : item.image,
        artist: liked ? null : song ? item.artist?.name : item?.isAdmin ? "✔ Spotify ✔" : item?.user?.name,
        year: liked ? null : item?.createdAt?.substr(0, 4),
        duration: countTime(liked, song, item),
        cn: countcn(liked, song, item)
    }

    const openForm = () => {
        if (hasPermission) {
            setform(true);
        }
    }

    return (
        <div className={hasPermission ? "playlist_cont pointer" : "playlist_cont"
        }>
            <div className="playlist_img" onClick={openForm}>
                <img src={image + data.image} />
            </div>

            {data &&
                <div className="playlist_info">
                    <span>
                        {data.type}
                    </span>
                    <h1 onClick={openForm}>
                        {data.name}
                    </h1>
                    {data.desc ? <div className="playlist_desc" onClick={openForm}>
                        {data.desc}
                    </div> : null}

                    <div className="playlist_extra">
                        {data.artist ? <span onClick={() => {
                            if (item.artist) return;
                            navigate("/user/" + item.user._id);
                        }}>{data.artist}</span> : null}
                        {data.year ? <span>{data.year}</span> : null}
                        <span> {data.cn} songs</span>
                        <span>{data.duration}</span>
                    </div>
                </div>
            }

        </div >
    )
}

export default Upper