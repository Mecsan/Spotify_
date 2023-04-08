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
export let searchContext = createContext();

function Search() {

  let [search, setsearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  let [loading, setloading] = useState(true);
  let [lists, setlists] = useState([]);
  let [songs, setsongs] = useState([]);
  let [artists, setartists] = useState([]);
  let [id, setid] = useState();
  let debounceTime = 1500;


  const searchData = async (val) => {
    //console.log("searching")

    let res = await fetch(searchapi + `?q=${val}`);
    let data = await res.json();

    setartists(data.artists);
    setsongs(data.songs);
    setlists(data.playLists);
  }

  const reset = () => {
    setartists([]);
    setlists([]);
    setsongs([]);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let query = queryParams.get('search');
    let temp;
    if (query) {
      setsearch(query);
      setloading(true);
      clearTimeout(id);

      temp = setTimeout(async () => {
        await searchData(query);
        setloading(false);
      }, debounceTime);

      setid(temp);
    }

    return () => clearTimeout(temp)
  }, [location.search])

  const handleChange = async (e) => {

    let val = e.target.value;
    setsearch(val);
    val = val.trim();

    navigate("?search=" + val);
    if (val == "") {
      reset();
      return;
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

        {
          search.trim() ?
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

      </div>
    </div>

  )
}

export default Search