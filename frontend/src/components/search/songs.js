import React from 'react'
import { useContext } from 'react'
import { searchContext } from '../../pages/search'
import SongTable from '../SongTable'
import { RotatingLines } from 'react-loader-spinner';
import Loading from '../loader';


function Songs() {
  const { songs, loading } = useContext(searchContext)
  return (
    <>
      {
        songs.length ?
          <SongTable songs={songs} /> : "no songs found"
      }
    </>
  )
}

export default Songs