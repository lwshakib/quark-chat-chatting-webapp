import express from "express";
import prisma from "../services/prisma";

const userRoutes = express.Router();

userRoutes.post('/getOrCreateUser', async (req, res) => {
    const {clerkId, email, name, imageUrl} = req.body;

    const existUser = await prisma.user.findUnique({
        where: {
            clerkId,
        }
    });

    if(existUser){
        return res.json({ message: "User already exists" });
    }
    
    const user = await prisma.user.create({
        data: {
            clerkId,
            email,
            name,
            imageUrl,
        }
    })
    
    res.json({ message: "User created successfully", user });
})

userRoutes.post('/search-users', async (req, res) => {
    const users = await prisma.user.findMany({
        where:{
            NOT: {
                clerkId: req.body.clerkId
            }
        }
    });
    res.json({ message: "Users fetched successfully", users });
})


export default userRoutes;
