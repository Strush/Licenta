import express from "express";
import {generateToken, isAdmin, isAuth} from "../utils.js";
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

userRouter.get('/', 
    isAuth, 
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users  = await User.find({});
        res.send(users);
    })
)

userRouter.get('/:id', 
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if(user){
            res.send(user);
        } else {
            res.status(404).send({message: 'Utilizatorul nu a fost gasit'})
        }
    })
);

userRouter.put('/:id', 
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name,
            user.email = req.body.email || user.email,
            user.isAdmin = Boolean(req.body.isAdmin)
            const updateUser = await user.save();
            res.send({message: 'Utilizatorul a fost modficat cu success', updateUser});
        } else {
            res.status(404).send({message: 'Utilizatorul nu a fost gasit'});
        }
    })
);

userRouter.post('/signup', expressAsyncHandler(async (req,res) => {
    const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();

    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
    });

}));

userRouter.put('/profile', isAuth, expressAsyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name;
        user.email = req.body.email;
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updateUser = await user.save();
        res.send({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser)
        });
    } else { 
        res.status(404).send({message: 'Nu exista asa utilizator'});
    }
}));

userRouter.delete('/:id', 
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if(user){
            if(user.email === "vinagapetru11@gmail.com"){
                res.send({message: 'Nu poti stergi administratorul'});
                return;
            } else {
                await user.remove();
                res.send({message: 'Utilizatorul a fost sters cu success'});
            }
        } else {
            res.status(404).send({message: 'Nu exista asa utilizator'})
        }
    })
)

export default userRouter;