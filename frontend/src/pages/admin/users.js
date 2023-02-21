import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { TbUserPlus } from 'react-icons/tb'
import { user } from '../../config/api'
import { AdminContext } from '../../context/admincontent'
import { AuthContext } from '../../context/auth'
import UserForm from './userform'
import UserTable from './usertable'

function Users() {

  const { users, dispatch } = useContext(AdminContext);
  const [isform, setform] = useState(false);
  const [active, setactive] = useState(null);

  const EditUser = (user)=>{
    setactive(user);
    setform(true);
  }  

  return (
    <div className="right">
      <div className="details users">

        <div className="user_head">

          <div className="title">
            <FaUserFriends />
            <span>Users</span>
          </div>

          <div className="add-user" onClick={() => {
            setactive(null);
            setform(true)
          }}>
            <TbUserPlus />
            Add new user
          </div>
        </div>

        {users.length ? <UserTable edit={EditUser} users={users} /> : null}

        {isform ? <UserForm setform={setform} item={active} /> : null}
      </div>
    </div>
  )
}

export default Users