import Exception from "../exceptions/Exception.js"
import {Challenge, User} from '../models/index.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const login = async ({email,password}) => { 
        // debugger
        const existingUser = await User.findOne({email}).exec()
        if (!!existingUser) { 
            // debugger
            let isMatch = await bcrypt.compare(password,existingUser.password)
            if (!!isMatch) {
                // Create java web token
                let token = jwt.sign(
                    {
                        data: existingUser
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "7 days",
                    })
                    return {...existingUser.toObject(),
                            password : "not show",
                            token: token
                        }
            }
            else {
                throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD)
            }

        } else {
            throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD)
        }
        
        
    
}
const register = async ({
    email, password, name
    }) => { 
    try {
        debugger
        const existingUser = await User.findOne({email}).exec()
        if (!!existingUser) { 
            throw new Exception("User already exists")
        }
        // encrypt password with salt rounds
        const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS))
        const newUser = await User.create({
            name, email, password: hashedPassword
        })
        return {...newUser._doc,password: 'Not show'}
    } catch (error) {
        // check model validation
        
        throw new Exception(Exception.CANNOT_REGISTER_USER)
        
    }
    
}



const joinChallenge = async ({userId, userName,idChallenge}) => { 
    try {
        debugger
        const user = await User.findById(userId)
        user.idChallenges.push(idChallenge)
        const challenge = await Challenge.findById(idChallenge)
        challenge.listMember.push({userId, userName, accept : true})
        challenge.userRecords.push({userId, userName})
        await user.save()
        await challenge.save()

    return challenge
        
    } catch (error) {
        // check model validation   
        debugger
        throw new Exception("Can not join challenge")
        
    }
    
}

const leaveChallenge = async ({userId,idChallenge}) => { 
    try {
        const user = await User.findById(userId)
        const index = user.idChallenges.indexOf(idChallenge)
        if (index > -1) {
            user.idChallenges.splice(index, 1)
        }
        await user.save()

        const challenge = await Challenge.findById(idChallenge)
        const memberIndex = challenge.listMember.findIndex(member => member.userId === userId)
        if (memberIndex > -1) {
            challenge.listMember.splice(memberIndex, 1)
        }
        const recordIndex = challenge.userRecords.findIndex(member => member.userId === userId)
        if (recordIndex > -1) {
            challenge.userRecords.splice(recordIndex, 1)
        }
        await challenge.save()
    } catch (error) {
        // check model validation   
        debugger
        throw new Exception("Can not leave challenge")
    }

    
}

const updateUser = async ({_id, email, profilePicture,password, name, gender, badges, friends, dateOfBirth, healthActivity, idChallenges, level, exp, friendList,friendMyRequest,friendRequest }) => {
    const user = await User.findById(_id)
    user.name = name ?? user.name
    user.profilePicture = profilePicture ?? user.profilePicture
    user.gender = gender ?? user.gender
    user.badges = badges ?? user.badges
    user.friends = friends ?? user.friends
    user.dateOfBirth = dateOfBirth ?? user.dateOfBirth
    user.healthActivity = healthActivity ?? user.healthActivity
    user.idChallenges = idChallenges ?? user.idChallenges
    user.level = level ?? user.level
    user.exp = exp ?? user.exp
    user.friendList = friendList ?? user.friendList
    user.friendMyRequest = friendMyRequest ?? user.friendMyRequest
    user.friendRequest = friendRequest ?? user.friendRequest

    await user.save()
    return user
}

const getDetailUser = async (userId) => {
    try {
        debugger
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Exception("Failed to get detail user");
    }
};
const addFriend = async ({userId, friendId}) => {
    const user = await User.findById(userId)
    const friend = await User.findById(friendId)
    if (!friend || !user ) throw new Error('Người dùng không tồn tại');

    user.friendMyRequest.push(friendId);
    friend.friendRequest.push(userId);

    await user.save()
    await friend.save()
    return user
}

const uploadProfilePicture = async ({ userId, imageData, contentType }) => {
    try {
        debugger
        const user = await User.findById(userId);
        user.profilePicture.data = imageData;
        user.profilePicture.contentType = contentType;
        await user.save();
        return user;
    } catch (error) {
        debugger
        throw new Exception("Failed to upload profile picture");
    }
};

const getFriends = async ({ userId}) => {
    try {
        debugger
        const user = await User.findById(userId);
        const users = await User.find({ _id: { $in: user.friendList } });
        return users;
    } catch (error) {
        debugger
        throw new Exception("Failed to upload profile picture");
    }
};

const getFriendRequest = async ({ userId}) => {
    try {
        debugger
        const user = await User.findById(userId);
        const users = await User.find({ _id: { $in: user.friendRequest } });
        return users;
    } catch (error) {
        debugger
        throw new Exception("Failed to upload profile picture");
    }
};

const getMyFriendRequest = async ({ userId}) => {
    try {
        debugger
        const user = await User.findById(userId);
        const users = await User.find({ _id: { $in: user.friendMyRequest } });
        return users;
    } catch (error) {
        debugger
        throw new Exception("Failed to upload profile picture");
    }
};

const acceptFriendRequest = async ({ userId, friendId }) => {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!friend || !user) {
            throw new Exception("User does not exist");
        }

        // Add friend to user's friend list
        user.friendList.push(friendId);
        // Remove friend request from user's friendRequest list
        const requestIndex = user.friendRequest.indexOf(friendId);
        if (requestIndex > -1) {
            user.friendRequest.splice(requestIndex, 1);
        }

        // Add user to friend's friend list
        friend.friendList.push(userId);
        // Remove user from friend's friendMyRequest list
        const myRequestIndex = friend.friendMyRequest.indexOf(userId);
        if (myRequestIndex > -1) {
            friend.friendMyRequest.splice(myRequestIndex, 1);
        }

        await user.save();
        await friend.save();
        return user;
    } catch (error) {
        throw new Exception("Failed to accept friend request");
    }
};

const declineFriendRequest = async ({ userId, friendId }) => {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!friend || !user) {
            throw new Exception("User does not exist");
        }

        // Remove friend request from user's friendRequest list
        const requestIndex = user.friendRequest.indexOf(friendId);
        if (requestIndex > -1) {
            user.friendRequest.splice(requestIndex, 1);
        }

        // Remove user from friend's friendMyRequest list
        const myRequestIndex = friend.friendMyRequest.indexOf(userId);
        if (myRequestIndex > -1) {
            friend.friendMyRequest.splice(myRequestIndex, 1);
        }

        await user.save();
        await friend.save();
        return user;
    } catch (error) {
        throw new Exception("Failed to decline friend request");
    }
};


export default {
    login,
    register,
    joinChallenge,
    leaveChallenge,
    updateUser,
    uploadProfilePicture,
    addFriend,
    getFriendRequest,
    getMyFriendRequest,
    getFriends,
    acceptFriendRequest,
    declineFriendRequest,
    getDetailUser
}
