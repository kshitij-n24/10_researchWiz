import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import HistModel  from "../models/HistSchema.js";
import UserModel from "../models/UserSchema.js";
import CommentModel from "../models/CommentSchema.js"

const addComments = async(email,comment,paperid) => {
    const db = CommentModel;
    try {
        await db.updateOne(
            {email : email, paperid : paperid},
            {$push : { comments : comment}},
            {upsert: true})
        return true;
    }
    catch(err){
        return false;
    }
};

const addHistory = async(email,paperid) => {
    const db = HistModel; 

    await db.updateOne({
        "email": email,
        "paperid": paperid,
    }, {
            $set: {
                updatedAt : new Date()
            }
        },{upsert: true});

    return true;
};

const getHistory = async(email) => {
    const db = HistModel;
    let query = await db.find({
        "email" : email,
    });

    let result = []
    let p_res = {}
    for(i in query){
        try {
            p_res = await db.findOne({paperid: i.paperid});
            result.push(p_res.title);
        } catch (err) {
            console.log(`Fetching of ${i.paperid} failed`);
        }
    }

    return result;
}

const getName = async (email) => {
    const db = UserModel;
    let query = await db.findOne({
        "email": email,
    });
    return query;
};

const addUser = async (name, email, password) => {
    const db = UserModel;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await db.create({
        name,
        email,
        password: hashedPassword
    });
};

const checkUser = async (email, password) => {
    const db = UserModel;

    const query = await db.findOne({email: email});
    if (!query){
        throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, query.password);

    if (!passwordMatch) {
      throw new Error('Invalid Credentials');
    }
};

const getCom = async (email,newid)=>{
    const db = CommentModel;
    const paperid = new mongoose.Types.ObjectId(newid)
    const query = await db.find({
        email : email,
        paperid : paperid
    })
    return query
}

export {  getHistory , addComments , addHistory, getName, addUser, checkUser,getCom  };

