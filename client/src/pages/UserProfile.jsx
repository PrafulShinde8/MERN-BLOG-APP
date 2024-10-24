import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (error) {
        setError(error.message); // Set error message
      }
    };

    getUser();
  }, [currentUser.id, token]);

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvatar(response?.data.avatar);
      setSuccessMessage('Avatar updated successfully!'); // Success message
    } catch (error) {
      setError(error.message); // Set error message
    }
  };

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
              <input 
                type="file" 
                name="avatar" 
                id="avatar" 
                onChange={e => setAvatar(e.target.files[0])}
                accept="image/png, image/jpg, image/jpeg" 
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button className="profile__avatar-btn" onClick={changeAvatarHandler}>
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{name}</h1> {/* Use name from state */}
          <p>{email}</p> {/* Display email */}
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
