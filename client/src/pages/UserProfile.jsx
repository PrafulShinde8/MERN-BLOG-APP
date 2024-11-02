import React, { useState, useContext, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../context/userContext'
import axios from 'axios';
const UserProfile = () => {
  const [avatar, setAvatar] = useState('')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)

  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  //redirect to login page for any user who isn't logged in
  useEffect(() => { 
    if(!token) {
      navigate('/login')
    }
  }, [])


  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});

      const {name, email, avatar} = response.data; 
      setName(name);
      setEmail(email);
      setAvatar(avatar);  
    }
    getUser();
  },[])
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/change-avatar`, postData,{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
    setAvatar(response?.data.avatar)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My posts</Link>

        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
            </div>
            {/* Form to update avatar */}
            <form className="avatar__form">
             <input type="file" name="avatar" id="avatar" onChange={e => setAvatar(e.target.files[0])}
             accept="png, jpg, jpeg" /> 
             <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit/></label>
            </form>
           {isAvatarTouched && <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck/></button>}
          </div>
          <h1>{currentUser.name}</h1>
        </div>
      </div>
    </section>
  )
}

export default UserProfile