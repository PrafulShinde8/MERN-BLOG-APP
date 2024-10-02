const jwt = require('jsonwebtoken')
const HttpError = require('../models/errorModel')

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith("Bearer")) {
        const token = Authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if(err) {
                return next(new HttpError("Unauthorized. Invalid token.",403))
            }

            req.user = info;
            next()
        })
    } else {
        return next(new HttpError("Unauthorized. No token", 402))
    }
}



module.exports = authMiddleware

// const jwt = require('jsonwebtoken');
// const HttpError = require('../models/errorModel');

// // const authMiddleware = async (req, res, next) => {
// //     // Authorization header (case-insensitive)
// //     const authorizationHeader = req.headers.authorization;

// //     // Check if authorization header exists and starts with Bearer
// //     if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
// //         const token = authorizationHeader.split(' ')[1]; // Extract the token part

// //         // Verify the token
// //         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //             if (err) {
// //                 return next(new HttpError("Unauthorized. Invalid token.", 403));
// //             }

// //             // Attach user info to request object
// //             req.user = decoded;
// //             next(); // Continue to the next middleware/controller
// //         });
// //     } else {
// //         return next(new HttpError("Unauthorized. No token provided.", 401));
// //     }
// // };
// const authMiddleware = async (req, res, next) => {
//     const authorizationHeader = req.headers.authorization;
//     console.log("Authorization Header:", authorizationHeader); // Log the authorization header
    
//     if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//         const token = authorizationHeader.split(' ')[1];
//         console.log("Token:", token); // Log the token part
        
//         // Token verification
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return next(new HttpError("Unauthorized. Invalid token.", 403));
//             }
            
//             console.log("Decoded token:", decoded); // Log the decoded token
//             req.user = decoded; // Set req.user with decoded token info
//             next();
//         });
//     } else {
//         return next(new HttpError("Unauthorized. No token provided.", 401));
//     }
// };

// const authMiddleware = async (req, res, next) => {
//     // Log the entire headers object to check what's being sent
//     console.log("Headers received:", req.headers);

//     const authorizationHeader = req.headers.authorization;

//     if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//         const token = authorizationHeader.split(' ')[1];
//         console.log("Token extracted:", token);

//         // Verify the token
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 console.error("Token verification error:", err);
//                 return next(new HttpError("Unauthorized. Invalid token.", 403));
//             }

//             // Log the decoded token to confirm the payload
//             console.log("Decoded token:", decoded);

//             // Attach the decoded token (which should contain { id, name }) to req.user
//             req.user = decoded; // Make sure this line is executed
//             console.log("req.user set to:", req.user);
//             next();
//         });
//     } else {
//         return next(new HttpError("Unauthorized. No token provided.", 401));
//     }
// };

// module.exports = authMiddleware;


// const jwt = require('jsonwebtoken');
// const HttpError = require('../models/errorModel');

// const authMiddleware = async (req, res, next) => {
//     const authorizationHeader = req.headers.authorization; // Make sure this is lowercase

//     if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//         const token = authorizationHeader.split(' ')[1];

//         // Log the token for debugging
//         console.log("Token received:", token);

//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 console.error("Token verification error:", err);
//                 return next(new HttpError("Unauthorized. Invalid token.", 403));
//             }

//             // Log the decoded payload
//             console.log("Decoded token:", decoded);
//             req.user = decoded; // Set the user based on the decoded token
//             next();
//         });
//     } else {
//         return next(new HttpError("Unauthorized. No token provided.", 401));
//     }
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const HttpError = require('../models/errorModel');

// const authMiddleware = async (req, res, next) => {
//     const Authorization = req.headers.Authorization || req.headers.authorization;

//     if (Authorization && Authorization.startsWith("Bearer")) {
//         const token = Authorization.split(' ')[1];

//         try {
//             const info = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = info; // Attach user info to request
//             next();
//         } catch (err) {
//             return next(new HttpError("Unauthorized. Invalid token.", 401));
//         }
//     } else {
//         return next(new HttpError("Unauthorized. No token.", 401)); // Changed to 401
//     }
// };

// module.exports = authMiddleware;

