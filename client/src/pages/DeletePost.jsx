import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const removePost = async () => {
    setIsLoading(true);
    setError(''); // Clear previous errors
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0); // Reload the current page
        } else {
          navigate('/'); // Redirect to home
        }
      }
    } catch (error) {
      setError("Couldn't delete post");
      console.error(error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {error && <p className="form__error-message">{error}</p>}
      <Link className="btn sm danger" onClick={removePost}>Delete</Link>
    </>
  );
};

export default DeletePost;
