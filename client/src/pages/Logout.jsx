import  {useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../context/userContext'

const Logout = () => {
  const {setCurrentUser} = useContext(UserContext)
  const navigate = useNavigate();

useEffect(() => {
  setCurrentUser(null); // Clear the current user context
  navigate('/login');   // Redirect to the login page
}, [setCurrentUser, navigate]);

return null; // Return null instead of an empty fragment
}

export default Logout
