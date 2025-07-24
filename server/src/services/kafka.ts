import dotenv from "dotenv";
import fs from "fs";
import { Kafka, Producer } from "kafkajs";
import prisma from "./prisma";
dotenv.config();

const kafka = new Kafka({
  sasl: {
    username: process.env.KAFKA_USERNAME as string,
    password: process.env.KAFKA_PASSWORD as string,
    mechanism: "plain",
  },
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync("./ca.pem")],
  },
  connectionTimeout: 10000,
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  console.log("Consumer is running..");
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`New Message Recv..`);
      try {
        const messageData: any = JSON.parse(message.value.toString()).message;
        console.log(messageData);
        
        
       await prisma.message.create({
        data: {
          conversationId: messageData.conversationId,
          senderId: messageData.senderId,
          content: messageData.content,
          receiverId: messageData.receiverId || null,
        },
       })
       await prisma.conversation.update({
        where: {
          id: messageData.conversationId,
        },
        data: {
          lastMessage: messageData.content,
        },
       })

       
      } catch (err) {
        console.log(err)
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}
export default kafka;