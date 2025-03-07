import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Message from "../models/message.js";
import ChatRoom from "../models/chatRoom.js";
import connectDB from "../db.js";

connectDB();

const seedDB = async () => {
  try {
    await User.deleteMany();
    await ChatRoom.deleteMany();
    await Message.deleteMany();

    // Create Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push(
        new User({
          username: faker.internet.username(),
          name: faker.person.fullName(),
          avatar: faker.image.avatar(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
      );
    }
    const createdUsers = await User.insertMany(users);

    // Create Chat Rooms
    const chats = [];
    for (let i = 0; i < 12; i++) {
      const randomUsers = faker.helpers.arrayElements(createdUsers, 3);
      const chatRoom = new ChatRoom({
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        image: faker.image.url(),
        host: randomUsers[0]._id,
        users: randomUsers.map((user) => user._id),
      });

      await chatRoom.save();

      // Create Messages for Each Chat Room
      const messages = [];
      for (let j = 0; j < 20; j++) {
        messages.push(
          new Message({
            message: faker.lorem.sentence(),
            sender: faker.helpers.arrayElement(randomUsers)._id,
            chatRoom: chatRoom._id,
          })
        );
      }
      await Message.insertMany(messages);

      chats.push(chatRoom);
    }

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error}`);
    process.exit(1);
  }
};

seedDB();
