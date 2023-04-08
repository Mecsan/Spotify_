import React from 'react'
import { useContext } from 'react'
import SongTable from '../components/SongTable'
import { ActiveContext } from '../context/active'

function Queue() {
    const { list } = useContext(ActiveContext)
    return (
        <div className="right">
            <div className="details">
                <h2>Now playing</h2>
                <SongTable songs={list} />
            </div>
        </div>
    )
}

export default Queue