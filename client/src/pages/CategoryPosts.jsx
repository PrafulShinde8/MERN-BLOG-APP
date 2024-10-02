// import React, { useState } from 'react'
// import { DUMMY_POSTS } from '../data'
// import PostItem from '../components/PostItem'
// const CategoryPosts = () => {
//   const [posts, setPosts] = useState(DUMMY_POSTS)
//   return (
//     <section className="posts">
//     {posts.length > 0 ? <div className="container posts__container">
//     {
//         posts.map(({id, thumbnail, category, title, desc, authorID}) =>
//         <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} 
//         title= {title} description={desc} authorID={authorID}/>)
//     }
//     </div> : <h2 className='center'>No posts found</h2>}
 
// </section>
//   )
// }

// export default CategoryPosts


import React, { useState, useEffect } from 'react'
import PostItem from '../components/PostItem'
import Loader from '../components/Loader'
import {useParams} from 'react-router-dom'
import axios from 'axios'
const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const {category} = useParams()
  useEffect(() => {
    const fetchPosts = async () => {
       setIsLoading(true);
       try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setPosts(response?.data)
       } catch (err) {
        console.log(err)
       }

       setIsLoading(false)
    }
    fetchPosts();
  },[category])

  if(isLoading) {
    return <Loader/>
  }
return (

  <section className="posts">
      {posts.length > 0 ? <div className="container posts__container">
      {
          posts.map(({_id:id, thumbnail, category, title, description, creator, createdAt}) =>
          <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} 
          title= {title} description={description} authorID={creator} createdAt={createdAt}/>)
      }
      </div> : <h2 className='center'>No posts found</h2>}
   
  </section>
);
//   const [posts, setPosts] = useState(DUMMY_POSTS)
}

export default CategoryPosts