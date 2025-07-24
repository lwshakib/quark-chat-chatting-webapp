import express from "express";
import prisma from "../services/prisma";

const conversationRouter = express.Router();

conversationRouter.post("/", async (req, res) => {
   
    const {senderId, receiverId} = req.body;
    console.log("senderId, receiverId",senderId, receiverId);

  await prisma.conversation.create({
    data: {
      users: {
        connect: [
          { clerkId: senderId },
          { clerkId: receiverId },
        ],
      },
    },
  });

  res.json({ message: "Conversation created successfully" });
});


conversationRouter.get("/", async (req, res) => {
    const {clerkId} = req.query;
    const conversations = await prisma.conversation.findMany({
        where:{
            users:{
                some:{
                    clerkId: clerkId as string,
                }
            }
        },
        include:{
            users: {
                select: {
                    clerkId: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
            messages:{
                select: {
                    id: true,
                    content: true,
                    senderId: true,
                    receiverId: true,
                    conversationId: true,
                    createdAt: true,
                },
            }
        }
    });
    res.json({ message: "Conversations fetched successfully", conversations });
});


conversationRouter.get("/:conversationId", async (req, res) => {
    const {conversationId} = req.params;
    const conversation = await prisma.conversation.findUnique({
        where:{
            id: conversationId,
        },
        include:{
            users: {
                select: {
                    clerkId: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
            messages: {
                select:{
                    id: true,
                    content: true,
                    senderId: true,
                    receiverId: true,
                    conversationId: true,
                    createdAt: true,
                    sender: {
                        select: {
                            clerkId: true,
                            name: true,
                            email: true,
                            imageUrl: true,
                        },
                    },
                }
            },
        }
    });
    res.json({ message: "Conversation fetched successfully", conversation });
})


conversationRouter.post("/group/create", async (req, res) => {
    const {clerkId, name, description, users} = req.body;
    console.log("clerkId, name, description, users",clerkId, name, description, users);
    
    await prisma.conversation.create({
        data: {
            name,
            description,
            type: "GROUP",
            users: {
                connect: [
                    { clerkId: clerkId },
                    ...users.map((user: any) => ({ clerkId: user })),
                ],
            },
        },
    });
    
    res.json({ message: "Group created successfully" });
})



export default conversationRouter;
