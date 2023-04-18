import React, { useState } from 'react'
import { FiSearch } from "react-icons/fi"
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/search/nav';
import { useEffect } from 'react';
import { search as searchapi } from '../config/api'
import All from '../components/search/all';
import { createContext } from 'react';
import Songs from '../components/search/songs';
import List from '../components/search/list';
import Artist from '../components/search/artists';
import Loading from '../components/loader';
export let searchContext = createContext();

function Search() {

  let [search, setsearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  let [loading, setloading] = useState(false);
  let [lists, setlists] = useState([]);
  let [songs, setsongs] = useState([]);
  let [artists, setartists] = useState([]);
  let [id, setid] = useState();
  let debounceTime = 1500;

  const searchData = async (val) => {
    if (!val) return;
    // console.log("searching for "+val)
    val = val.trim();

    let res = await fetch(searchapi + `?q=${val}`);
    let data = await res.json();

    setartists(data.artists);
    setsongs(data.songs);
    setlists(data.playLists);
  }

  const searchAd = async (search) => {
    clearTimeout(id);
    setloading(true);

    let temp = setTimeout(async () => {
      await searchData(search);
      setloading(false);
    }, debounceTime);

    setid(temp);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let query = queryParams.get('search');
    if (query) {
      setsearch(query);
      setloading(true);
      searchData(query).then(() => setloading(false))
    }
  }, [])

  const handleChange = async (e) => {
    let val = e.target.value;
    setsearch(val);
    searchAd(val);
    val = val.trim();
    navigate("?search=" + val);
    if(val==""){
      setloading(false);      
    }
  }

  return (
    <div className="right">
      <div className="details">

        <div className="search-input">
          <FiSearch color='black' />
          <input placeholder='what do you want to listen' type="text" value={search} onChange={handleChange} />
        </div>

        <Nav />

        <Loading load={loading}>
          {
            search?.trim() ?
              <searchContext.Provider value={{ loading, lists, songs, artists }}>
                <Routes>
                  <Route path='/' element={<All />}
                  />
                  <Route path='/songs' element={<Songs />} />
                  <Route path='/artists' element={<Artist />} />
                  <Route path='/playlists' element={
                    <List />
                  } />
                </Routes>
              </searchContext.Provider> : "Search anything you want"
          }
        </Loading>

      </div>
    </div>

  )
}

export default Search