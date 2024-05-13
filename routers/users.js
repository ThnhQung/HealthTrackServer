import express from 'express';
import { body, validationResult } from 'express-validator';
// import {upload} from '../middleware/multer.js';
import {
    userController
} from '../controllers/index.js'

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Get user');
});
router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }), 
    userController.login
    );
router.post('/register', userController.register );

router.post('/update', userController.updateUser );

router.post('/challenge', userController.joinChallenge );

router.post('/challenge/leave', userController.leaveChallenge );

router.get('/friends/:id', userController.getFriends );

router.get('/friends/request/:id', userController.getFriendRequest );

router.get('/friends/myRequest/:id', userController.getMyFriendRequest );

router.get('/:id', userController.getDetailUser );

// router.post('/upload',upload.single('imageData'), userController.uploadProfilePicture );

router.post('/friends/add', userController.addFriend);

router.post('/friends/accept', userController.acceptFriendRequest );

router.post('/friends/decline', userController.declineFriendRequest );

export default router;