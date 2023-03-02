import React from 'react'
import { Link,useLocation } from 'react-router-dom'

function Nav() {
  let location = useLocation();
  return (
    <div className="search_option">
          <div className={location.pathname == "/search" ? "filter current" : "filter"}>
            <Link to={`/search${location.search || ""}`} > all </Link>
          </div>
          <div className={location.pathname == "/search/songs" ? "filter current" : "filter"}>
            <Link to={`songs${location.search || ""}`} >songs</Link>
          </div>
          <div className={location.pathname == "/search/playlists" ? "filter current" : "filter"}>
            <Link to={`playlists${location.search || ""}`} >playlists</Link>
          </div>
          <div className={location.pathname == "/search/artists" ? "filter current" : "filter"}>
            <Link to={`artists${location.search || ""}`} >artists</Link>
          </div>
        </div>
  )
}

export default Nav