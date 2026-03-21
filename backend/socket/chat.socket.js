// const Message = require('../models/Message.model');
// const Conversation = require('../models/Conversation.model');

// // online users track korar jonno
// const onlineUsers = new Map(); // userId -> socketId

// const makeConversationId = (id1, id2) => {
//     return [id1.toString(), id2.toString()].sort().join('_');
// };

// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('User connected:', socket.id);

//         // ─── USER ONLINE ──────────────────────────────────
//         socket.on('user_online', (userId) => {
//             onlineUsers.set(userId, socket.id);
//             socket.join(userId); // private room e join

//             // sob ke janao ei user online
//             io.emit('online_users', Array.from(onlineUsers.keys()));
//             console.log(`${userId} is online`);
//         });

//         // ─── SEND MESSAGE ─────────────────────────────────
//         socket.on('send_message', async (data) => {
//             const { senderId, receiverId, text } = data;

//             try {
//                 const conversationId = makeConversationId(senderId, receiverId);

//                 // DB te save koro
//                 const message = await Message.create({
//                     conversationId,
//                     sender: senderId,
//                     receiver: receiverId,
//                     text: text.trim(),
//                 });

//                 await message.populate('sender', 'name avatar');

//                 // conversation update
//                 await Conversation.findOneAndUpdate(
//                     { conversationId },
//                     {
//                         conversationId,
//                         participants: [senderId, receiverId],
//                         lastMessage: {
//                             text: text.trim(),
//                             sender: senderId,
//                             createdAt: new Date(),
//                         },
//                         $inc: { [`unreadCount.${receiverId}`]: 1 },
//                     },
//                     { upsert: true, new: true }
//                 );

//                 // receiver ke message pathao
//                 io.to(receiverId).emit('receive_message', {
//                     message,
//                     conversationId,
//                 });

//                 // sender ke confirm pathao
//                 socket.emit('message_sent', {
//                     message,
//                     conversationId,
//                 });

//             } catch (error) {
//                 socket.emit('message_error', { error: error.message });
//             }
//         });

//         // ─── TYPING INDICATOR ─────────────────────────────
//         socket.on('typing', ({ senderId, receiverId }) => {
//             io.to(receiverId).emit('user_typing', { senderId });
//         });

//         socket.on('stop_typing', ({ senderId, receiverId }) => {
//             io.to(receiverId).emit('user_stop_typing', { senderId });
//         });

//         // ─── MESSAGE READ ─────────────────────────────────
//         socket.on('message_read', async ({ conversationId, userId }) => {
//             await Message.updateMany(
//                 { conversationId, receiver: userId, isRead: false },
//                 { isRead: true }
//             );

//             // sender ke janao message read hoyeche
//             const otherUserId = conversationId
//                 .split('_')
//                 .find((id) => id !== userId);

//             io.to(otherUserId).emit('messages_read', { conversationId });
//         });

//         // ─── DISCONNECT ───────────────────────────────────
//         socket.on('disconnect', () => {
//             // online users theke remove koro
//             for (const [userId, socketId] of onlineUsers.entries()) {
//                 if (socketId === socket.id) {
//                     onlineUsers.delete(userId);
//                     io.emit('online_users', Array.from(onlineUsers.keys()));
//                     console.log(`${userId} went offline`);
//                     break;
//                 }
//             }
//         });
//     });
// };










const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');

const onlineUsers = new Map();

const makeConversationId = (id1, id2) => {
    return [id1.toString(), id2.toString()].sort().join('_');
};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // user online
        socket.on('user_online', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.join(userId);
            io.emit('online_users', Array.from(onlineUsers.keys()));
            console.log(userId + ' is online');
        });

        // send message
        socket.on('send_message', async (data) => {
            const { senderId, receiverId, text, replyTo } = data;

            try {
                const conversationId = makeConversationId(senderId, receiverId);

                const message = await Message.create({
                    conversationId,
                    sender: senderId,
                    receiver: receiverId,
                    text: text.trim(),
                    replyTo: replyTo || null,
                });

                await message.populate('sender', 'name avatar');
                await message.populate({ path: 'replyTo', populate: { path: 'sender', select: 'name' } });

                // conversation update
                await Conversation.findOneAndUpdate(
                    { conversationId },
                    {
                        conversationId,
                        participants: [senderId, receiverId],
                        lastMessage: {
                            text: text.trim(),
                            sender: senderId,
                            createdAt: new Date(),
                        },
                        $inc: { ['unreadCount.' + receiverId]: 1 },
                    },
                    { upsert: true, new: true }
                );

                // receiver ke message pathao (room join korle pabe)
                io.to(receiverId).emit('receive_message', {
                    message,
                    conversationId,
                });

                // sender ke confirm pathao
                socket.emit('message_sent', {
                    message,
                    conversationId,
                });

            } catch (error) {
                socket.emit('message_error', { error: error.message });
            }
        });

        // typing
        socket.on('typing', ({ senderId, receiverId }) => {
            io.to(receiverId).emit('user_typing', { senderId });
        });

        socket.on('stop_typing', ({ senderId, receiverId }) => {
            io.to(receiverId).emit('user_stop_typing', { senderId });
        });

        // message read
        socket.on('message_read', async ({ conversationId, userId }) => {
            await Message.updateMany(
                { conversationId, receiver: userId, isRead: false },
                { isRead: true }
            );
            const otherUserId = conversationId
                .split('_')
                .find((id) => id !== userId);
            io.to(otherUserId).emit('messages_read', { conversationId });
        });

        // disconnect
        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit('online_users', Array.from(onlineUsers.keys()));
                    console.log(userId + ' went offline');
                    break;
                }
            }
        });
    });
};