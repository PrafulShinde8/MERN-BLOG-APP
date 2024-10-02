const Post = require("../models/postModel")
const User = require("../models/userModel")
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')
// ================== CREATE A POST
// POST: api/posts
// PROTECTED
const createPost = async (req, res, next) => {
   try {
    let {title, category, description} = req.body;
    if(!title || !category || !description || !req.files){
        return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
    }
    const {thumbnail} = req.files;
    // check the file size
    if(thumbnail.size > 2000000) {
        return next(new HttpError("Thumbnail too big. File should be less than 2mb."))
    }
    let fileName = thumbnail.name;
    let splittedFilename = fileName.split('.')
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
    thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async (err) => {
        if(err) {
            return next(new HttpError(err))
        } else {
            const newPost = await Post.create({title, category, description, thumbnail: newFilename, creator: req.user.id})
            if(!newPost) {
                return next(new HttpError("Post couldn't be created.", 422))
            }
            //find user and increase post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

            res.status(201).json(newPost)
        }
    })
   } catch (error) {
    return next(new HttpError(error))
   }
}


// ================== GET ALL POSTS
// GET: api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        
    }
}


// ================== GET SINGLE POST
// GET: api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) {
            return next(new HttpError("Post not found.", 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ================== GET POSTS BY CATEGORY
// POST: api/posts/categories/:category
// PROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ================== GET USER/AUTHOR POST
// POST: api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ================== EDIT POST
// PATCH: api/posts/:id
// PROTECTED
// const editPost = async (req, res, next) => {
//     try {
//         let fileName;
//         let newFilename;
//         let updatedPost;
//         const postId = req.params.id;
//         const {title, category, description} = req.body;
//         //ReactQuill has a paragraph opening and closing tag with a break tag in between soi there are 11 characters in there already
//         if(!title || !category || description.length < 12){
//             return next (new HttpError("Fill in all fields.", 422))
//         }
//         //get old post from database
//         const oldPost = await Post.findById(postId);
//         if(req.user.id ==oldPost.creator) {
//           if(!req.files) {
//             updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true})
//         } else {
//             //delete old thumbnail from upload
//             fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail),async (err) =>{
//                 if(err) {
//                     return next(new HttpError(err))
//                 }
//             })
//                 //upload new thumbnail
//                 const {thumbnail} = req.files;
//                 //check file size
//                 if(thumbnail.size > 2000000) {
//                     return next(new HttpError("Thumbnail too big. Should be less than 2mb"))
//                 }
//                 fileName = thumbnail.name;
//                 let splittedFilename = fileName.split('.')
//                 newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
//                 thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
//                     if(err) {
//                         return next (new HttpError(err))
//                     }
//           })
//           updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFilename}, {new: true})
//         }
        
//         if(!updatedPost) {
//             return next(new HttpError("Couldn't update post.", 400))
//         }
//     }
//         res.status(200).json(updatedPost)
//     } catch (error) {
//         return next(new HttpError(error))
//     }
// }

const editPost = async (req, res, next) => {
    try {
      const postId = req.params.id;
      let { title, category, description } = req.body;
  
      // Validate the required fields
      if (!title || !category || description.length < 12) {
        return next(new HttpError("Fill in all fields.", 422));
      }
  
      // Get the old post from the database
      const oldPost = await Post.findById(postId);
      if (!oldPost) {
        return next(new HttpError("Post not found.", 404));
      }
  
    //   // Log values for debugging
    //   console.log("Requesting User ID:", req.user.id);
    //   console.log("Post Creator ID:", oldPost.creator);
  
    //   // Check if the logged-in user is the creator of the post
      if (req.user.id !== oldPost.creator.toString()) {
        return next(new HttpError("Unauthorized action.", 403));  // Still show unauthorized if different user
      }
  
      let updatedPost;
  
      // If no new thumbnail is uploaded, update only the post details
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description },
          { new: true }
        );
      } else {
        // If a new thumbnail is uploaded, handle the file deletion and replacement
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
          return next(new HttpError("Thumbnail too big. Should be less than 2mb.", 413));
        }
  
        // Delete old thumbnail
        fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
          if (err) {
            return next(new HttpError(err, 500));
          }
        });
  
        // Upload the new thumbnail
        const fileName = thumbnail.name;
        const newFilename = fileName.split('.')[0] + uuid() + "." + fileName.split('.').pop();
        thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
          if (err) {
            return next(new HttpError(err, 500));
          }
        });
  
        // Update post details and new thumbnail
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFilename },
          { new: true }
        );
      }
  
      // If the post couldn't be updated, send an appropriate message
      if (!updatedPost) {
        return next(new HttpError("Couldn't update post.", 400));
      }
  
      res.status(200).json(updatedPost);
    } catch (error) {
      return next(new HttpError(error.message, 500));
    }
  };

// ================== DELETE POST
// DELETE: api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if(!postId) {
            return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if(req.user.id == post.creator) {
        //delete thumbnail from uploads folder
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                await Post.findByIdAndDelete(postId);
                //find user and reduce po9st count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
                res.json(`Post ${postId} deleted successfully.`)
            }
        })
    } else {
        return next(new HttpError("Post couldn't be deleted", 403))
    }
    } catch (err) {
        return next(new HttpError(err))
    } 
}

// const deletePost = async (req, res, next) => {
//     try {
//         // Trim the postId to ensure there are no extra characters
//         const postId = req.params.id.trim(); // Trim spaces and newline characters

//         if (!postId) {
//             return next(new HttpError("Post unavailable.", 400));
//         }

//         // Find the post by ID
//         const post = await Post.findById(postId);
//         if (!post) {
//             return next(new HttpError("Post not found.", 404));
//         }

//         const fileName = post.thumbnail;
//         if(req.user.id == post.creator) {
//         // Delete thumbnail from uploads folder
//         fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
//             if (err) {
//                 return next(new HttpError(err.message, 500));
//             } else {
//                     await Post.findByIdAndDelete(postId);
//                     // Find the user and reduce post count by 1
//                     const currentUser = await User.findById(req.user.id);
//                     const userPostCount = currentUser.posts - 1;
//                     await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
//                     // Send a success response
//                     res.json({ message: `Post ${postId} deleted successfully.` });
        
//             }
//         });
//         } else {
//             return next(new HttpError("Post couldn't be deleted", 403))
//         }
//     } catch (err) {
//         return next(new HttpError(err.message, 500));
//     }
// };


module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost}
