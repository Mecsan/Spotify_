import React from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { user } from '../../config/api'
import { useContext } from 'react'
import { AdminContext } from '../../context/admincontent'
import toast from 'react-hot-toast'
import { AuthContext } from '../../context/auth'
import { delete_ } from '../../services/user'

function UserTable({ users, edit }) {

  const { dispatch } = useContext(AdminContext)
  const { token } = useContext(AuthContext)

  const deleteUser = async (key) => {
    let ans = window.confirm("are u sure wanted to delete?");
    if (ans == false) return;
    let tid = toast.loading("deleting user ...")
    const { res, data } = await delete_(key, token);
    if (res.ok) {
      dispatch({ type: "DELETE_USER", data: key })
      toast.success("user deleleted", { id: tid });
    } else {
      toast.error("something went wrong", { id: tid })
    }
  }

  return (
    <div className="usertable">

      <div className="heading">
        <span>idx</span>
        <div>Mail</div>
        <div>Name</div>
        <div>Role</div>
        <div>option</div>
      </div>

      {
        users.map((user, idx) => {
          return (
            <div key={idx} className='userrow'>
              <span>{idx + 1}</span>
              <div>{user.mail}</div>
              <div>{user.name}</div>
              <div>{user.isAdmin ? "admin" : "user"}</div>
              <div className='user-option'>
                <div className="dlt" onClick={() => deleteUser(user._id)}>
                  <MdDeleteOutline />
                </div>
                <div className="up" onClick={() => edit(user)}>
                  <FaUserEdit />
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default UserTable