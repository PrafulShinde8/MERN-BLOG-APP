const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require("uuid")
const User = require('../models/userModel')
const HttpError = require("../models/errorModel")




// ================== REGISTER A NEW USER
//POST: api/users/register

// const registerUser = async (req, res, next) => {
//     res.json("Register User")
// }



//UNPROTECTED
const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        const newEmail = email.toLowerCase()
         
        const emailExists = await User.findOne({email: newEmail})
        if(emailExists) {
            return next(new HttpError("Email already exists.", 422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password should be at least 6 characters.", 422))
        }

        if(password != password2) {
            return next(new HttpError("Passwords do not match.", 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email:newEmail, password: hashedPass})
        res.status(201).json(`New User ${newUser.email} registered.`)
    } catch (error) {
        return next(new HttpError("User registration failed.", 422))
    }
}

// const loginUser = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
        
//         if (!email || !password) {
//             return next(new HttpError("Fill in all fields", 422));
//         }

//         const newEmail = email.toLowerCase();

//         const user = await User.findOne({ email: newEmail });
//         if (!user) {
//             return next(new HttpError("Invalid credentials.", 422));
//         }

//         const comparePass = await bcrypt.compare(password, user.password);
//         if (!comparePass) {
//             return next(new HttpError("Invalid credentials.", 422));
//         }

//         const { _id: id, name } = user;
        
//         // Sign the token
//         const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });

//         // Log the token and payload to verify it's correct
//         console.log("Token created:", token);
//         console.log("Token payload:", { id, name });

//         // Send response
//         res.status(200).json({ token, id, name });
//     } catch (error) {
//         return next(new HttpError("Login failed. Please check your credentials", 422));
//     }
// };









// ================== LOGIN A REGISTERED USER
// POST: api/users/login
// UNPROTECTED
// const loginUser = async (req, res, next) => {
//     try {
//         const {email, password} = req.body;
//         if(!email || !password) {
//             return next(new HttpError("Fill in all fields", 422))
//         }
//         const newEmail = email.toLowerCase();

//         const user = await User.findOne({email: newEmail})
//         if(!user) {
//             return next(new HttpError("Invalid credentials.", 422))
//         }

//         const comparePass = await bcrypt.compare(password, user.password)
//         if(!comparePass){
//             return next(new HttpError("Invalid credentials.", 422))
//         }

//         const {_id: id, name} = user;
//         const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"});
        
//         res.status(200).json({token, id, name})
//     } catch (error) {
//         return next(new HttpError("Login failed. Please check your credentials", 422))
        
//     }
// }

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail})
        if(!user) {
            return next(new HttpError("Invalid credentials.", 422))
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials.", 422))
        }

        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"});
        
        res.status(200).json({token, id, name})
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials", 422))
        
    }
}




// ================== USER PROFILE
//POST: api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user) {
            return next(new HttpError("User not found.", 404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}









// ================== CHANGE USER AVATAR (profile picture)
//POST: api/users/change-avatar
//PROTECTED
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError("Please choose an image.", 422));
        }
        
        //find user from database
        const user = await User.findById(req.user.id);
        //delete old avatar if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if(err) {
                    return next(new HttpError(err))
                }
            })
        }
        
        const {avatar} = req.files;
        //check file size
        if(avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb.", 422));
        }

        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError(err))
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFilename}, {new: true})
            if(!updatedAvatar) {
                return next(new HttpError("Avatar couldn't ben changed.", 422))
            }
            res.status(200).json(updatedAvatar)

        })
    } catch (error) {
        return next(new HttpError(err))
    }
}
           // Ensure the directory exists
//         const uploadDir = path.join(__dirname, '..', 'uploads');
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         // Delete old avatar if it exists
//         const oldAvatarPath = path.join(uploadDir, user.avatar);
//         if (user.avatar && fs.existsSync(oldAvatarPath)) {
//             try {
//                 fs.unlinkSync(oldAvatarPath);
//                 console.log("Old avatar deleted successfully.");
//             } catch (err) {
//                 console.error("Error deleting old avatar:", err);
//                 return next(new HttpError("Error deleting old avatar.", 500));
//             }
//         }

//         const { avatar } = req.files;
//         console.log("Uploading avatar:", avatar.name);

//         if (avatar.size > 500000) {
//             return next(new HttpError("Profile picture too big. Should be less than 500kb.", 422));
//         }

//         const newFilename = `${uuid()}-${avatar.name}`;
//         const uploadPath = path.join(uploadDir, newFilename);

//         console.log("Uploading to path: ", uploadPath);
//         try {
//         avatar.mv(uploadPath, async (err) => {
//             if (err) {
//                 console.error("Error saving new avatar:", err);
//                 return next(new HttpError("Error saving new avatar.", 500));
//             }

//             const updatedUser = await User.findByIdAndUpdate(
//                 req.user.id,
//                 { avatar: newFilename },
//                 { new: true }
//             );

//             if (!updatedUser) {
//                 return next(new HttpError("Avatar couldn't be changed.", 422));
//             }

//             res.status(200).json(updatedUser);
//         });
//     } catch (error) {
//         console.error("Error in file upload process:", error);
//         return next(new HttpError("Unexpected error while uploading avatar.", 500));
//     }
//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return next(new HttpError("An unexpected error occurred.", 500));
//     }
// };





// ================== EDIT USER DETAILS (from profile)
// POST: api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, newConfirmPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        //get user from database
        const user = await User.findById(req.user.id);
        if(!user) {
            return next(new HttpError("User not found.", 403))
        }

        //make sure new email doesn't already 
        const emailExist = await User.findOne({email});
        //we want to update other details with/without changing the email (which is a unique id because we use it to login).
        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email already exist.", 422))
        }
        //compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword) {
            return next(new HttpError("Invalid current password", 422))
        }

        //compare new password
        if(newPassword !== newConfirmPassword) {
            return next(new HttpError("New passwords do not match.", 422))
        }

        //hash new password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt);

        //update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// const editUser = async (req, res, next) => {
//     try {
//         const { name, email, currentPassword, newPassword, newConfirmPassword } = req.body;
        
//         // Check if required fields are filled
//         if (!name || !email || !currentPassword || !newPassword || !newConfirmPassword) {
//             return next(new HttpError("Fill in all fields.", 422));
//         }

//         // Get user from the database
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return next(new HttpError("User not found.", 403));
//         }

//         // Check if new email is already taken
//         const emailExist = await User.findOne({ email });
//         if (emailExist && (emailExist._id != req.user.id)) {
//             return next(new HttpError("Email already exists.", 422));
//         }

//         // Validate current password
//         const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
//         if (!validateUserPassword) {
//             return next(new HttpError("Invalid current password", 422));
//         }

//         // Check new password confirmation
//         if (newPassword !== newConfirmPassword) {
//             return next(new HttpError("New passwords do not match.", 422));
//         }

//         // Validate new password strength (optional)
//         const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Example: At least 8 characters, 1 letter, 1 number
//         if (!newPassword.match(passwordCriteria)) {
//             return next(new HttpError("New password must be at least 8 characters long, contain at least one letter and one number.", 422));
//         }

//         // Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(newPassword, salt);

//         // Update user information in the database
//         const updatedUser = await User.findByIdAndUpdate(
//             req.user.id,
//             { name, email, password: hash },
//             { new: true }
//         );

//         res.status(200).json({ message: "User updated successfully.", user: updatedUser });
//     } catch (error) {
//         return next(new HttpError(error.message || "Something went wrong.", 500));
//     }
// };



// ================== GET AUTHORS
//POST: api/users/authors
//UNPROTECTED
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors}