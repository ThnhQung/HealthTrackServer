import { body, validationResult } from 'express-validator';
import {userRepository} from '../repositories/index.js'
import {EventEmitter} from 'node:events'
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import user from '../repositories/user.js';
const myEvent = new EventEmitter()
myEvent.on('event.register.user', (params) => {
 console.log('They talk about param :'+ JSON.stringify(params))
})

const login = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: error.array() });
    }
    const {email, password} = req.body;
    try {
        let user = await userRepository.login({email, password})
        res.status(HttpStatusCode.OK).json({message: "Login successfully", data : user});
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : error.message});
    }
    
    
}

const register = async (req, res) => { 
    const {email,password, name} = req.body
    myEvent.emit('event.register.user', req.body)
    try {
        debugger
        const user = await userRepository.register({
            email,password, name
        }) 
        res.status(HttpStatusCode.INSERT_OK).json({message : 'Post register user', data : user});
    } catch (error) {
        debugger
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : error.message});
    }

}



const getDetailUser = async (req, res) => {
    const userId = req.params.id;
    try {
        debugger
        const user = await userRepository.getDetailUser(userId);
        res.status(HttpStatusCode.OK).json({ message: 'Get user detail successfully', data: user });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}



const joinChallenge = async (req, res) => { 
    const {userId, userName, idChallenge} = req.body
    try {
        debugger
        const challenge = await userRepository.joinChallenge({userId, userName, idChallenge}) 
        res.status(HttpStatusCode.INSERT_OK).json({message : 'Join challenge successfully ', data : challenge});
    } catch (error) {
        debugger
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : error.message});
    }

}

const leaveChallenge = async (req, res) => { 
    const {userId, idChallenge} = req.body
    try {
        const challenge = await userRepository.leaveChallenge({userId, idChallenge}) 
        res.status(HttpStatusCode.INSERT_OK).json({message : 'Leave challenge successfully ', data : challenge});
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : error.message});
    }

}

const updateUser = async (req, res) => {
    const { _id, email,profilePicture, password, name, gender, badges, friends, dateOfBirth, healthActivity, idChallenges, level, exp, friendList,friendMyRequest,friendRequest} = req.body;
    try {
        const updatedUser = await userRepository.updateUser({_id, email, profilePicture,password, name, gender, badges, friends, dateOfBirth, healthActivity, idChallenges, level, exp, friendList,friendMyRequest,friendRequest });
        res.status(HttpStatusCode.INSERT_OK).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const uploadProfilePicture= async(req, res) =>{
    try {
        debugger
        const { userId } = req.body;
        const imageData = req.file.buffer;
        const contentType = req.file.mimetype;
        await userRepository.uploadProfilePicture({userId, imageData, contentType});
        res.json({ message: 'Profile picture uploaded successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const addFriend = async (req, res) => { 
    const {userId, friendId} = req.body
    try {
        debugger
        const challenge = await userRepository.addFriend({userId,friendId}) 
        res.status(HttpStatusCode.INSERT_OK).json({message : 'Add friend successfully ', data : challenge});
    } catch (error) {
        debugger
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message : error.message});
    }

}

const getFriendRequest = async (req, res) => { 
    try {
        let userId = req.params.id
        let friends = await userRepository.getFriendRequest({userId})
        if (!friends) {
            throw new Exception('Can not get friend ' + id)
        }
        res.status(HttpStatusCode.OK).json({
            message : 'Get friends request successfully',
            data : friends
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message : error.message,
        })
    }
}
const getFriends = async (req, res) => { 
    try {
        let userId = req.params.id
        let friends = await userRepository.getFriends({userId})
        if (!friends) {
            throw new Exception('Can not get friend ' + id)
        }
        res.status(HttpStatusCode.OK).json({
            message : 'Get friend list successfully',
            data : friends
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message : error.message,
        })
    }
}

const getMyFriendRequest = async (req, res) => { 
    try {
        let userId = req.params.id
        let friends = await userRepository.getMyFriendRequest({userId})
        if (!friends) {
            throw new Exception('Can not get friend ' + id)
        }
        res.status(HttpStatusCode.OK).json({
            message : 'Get my friends request successfully',
            data : friends
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message : error.message,
        })
    }
}

const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const result = await userRepository.acceptFriendRequest({ userId, friendId });
        res.status(HttpStatusCode.OK).json({ message: 'Friend request accepted successfully', data: result });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const declineFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const result = await userRepository.declineFriendRequest({ userId, friendId });
        res.status(HttpStatusCode.OK).json({ message: 'Friend request declined successfully', data: result });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}



export default {
    login,
    register,
    getDetailUser ,
    joinChallenge ,
    leaveChallenge,
    updateUser,
    uploadProfilePicture,
    addFriend,
    getFriendRequest,
    getMyFriendRequest,
    getFriends,
    acceptFriendRequest,
    declineFriendRequest,
    
}
