import express from "express";
import {generateToken} from "../utils.js";
import expressAsyncHandler from 'express-async-handler';
import User from "../models/userModal.js";
import bcrypt from 'bcryptjs';

const userRouter = express.Router();

userRouter.post('/signin', expressAsyncHandler(async (req,res) => {
        const user = await User.findOne({email: req.body.email});
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                });
                return;
            } else {
                res.status(401).send({message: 'Email ori parola sunt incorecte.'});
            }
        }
    })
);

export default userRouter;