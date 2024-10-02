// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'

// import Avatar1 from '../images/avatar1.jpg'
// import Avatar2 from '../images/avatar2.jpg'
// import Avatar3 from '../images/avatar3.jpg'
// import Avatar4 from '../images/avatar4.jpg'
// import Avatar5 from '../images/avatar5.jpg'

// const authorsData = [
//   {id:1, avatar: Avatar1, name: 'Praful Shinde', posts: 3},
//   {id:2, avatar: Avatar2, name: 'John Doe', posts: 5},
//   {id:3, avatar: Avatar3, name: 'Jenny Jane', posts: 0},
//   {id:4, avatar: Avatar4, name: 'Charles Peter', posts: 2},
//   {id:5, avatar: Avatar5, name: 'Bob Mathew', posts: 1},

// ]
// const Authors = () => {
//   const [authors, setAuthors] = useState(authorsData)
//   return (
//     <section className="authors">
//     {authors.length > 0 ? <div className="container authors__container">
//       {
//         authors.map(({id, avatar, name, posts}) => {
//           return <Link to={`/posts/users/${id}`} className='author'>
//             <div className="author__avatar">
//             <img src={avatar} alt={`Image of ${name}`} />
//             </div>
//             <div className="author__info">
//               <h4>{name}</h4>
//               <p>{posts}</p>
//             </div>
//           </Link>
//         })
//       }
//     </div> : <h2 className='center'>No users/authors found.</h2>}
//     </section>
//   )
// }

// export default Authors


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

// import Avatar1 from '../images/avatar1.jpg';
// import Avatar2 from '../images/avatar2.jpg';
// import Avatar3 from '../images/avatar3.jpg';
// import Avatar4 from '../images/avatar4.jpg';
// import Avatar5 from '../images/avatar5.jpg';

// const authorsData = [
//   { id: 1, avatar: Avatar1, name: 'Praful Shinde', posts: 3 },
//   { id: 2, avatar: Avatar2, name: 'John Doe', posts: 5 },
//   { id: 3, avatar: Avatar3, name: 'Jenny Jane', posts: 0 },
//   { id: 4, avatar: Avatar4, name: 'Charles Peter', posts: 2 },
//   { id: 5, avatar: Avatar5, name: 'Bob Mathew', posts: 1 },
// ];

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const getAuthors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
      setAuthors(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }
  getAuthors();
  },[])
  if(isLoading) {
    return <Loader/>
  }
  return (
    <section className="authors">
    {authors.length > 0 ? <div className="container authors__container">
      {
        authors.map(({_id: id, avatar, name, posts}) => {
          return <Link to={`/posts/users/${id}`} className='author'>
            <div className="author__avatar">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`Image of ${name}`} />
            </div>
            <div className="author__info">
              <h4>{name}</h4>
              <p>{posts}</p>
            </div>
          </Link>
        })
      }
    </div> : <h2 className='center'>No users/authors found.</h2>}
    </section>
  );
};

export default Authors;
