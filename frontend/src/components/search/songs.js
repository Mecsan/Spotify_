import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import SongTable from '../SongTable'
import { RotatingLines } from 'react-loader-spinner';


function Songs() {
  const { songs, loading } = useContext(searchContext)
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
            songs.length ?
              <SongTable songs={songs} /> : "no songs found"
          }</>
      }
    </>
  )
}

export default Songs