module.exports = (io) => {
    io.on('connection', (socket) => {

        // ─── VIDEO CALL SIGNALING (WebRTC) ────────────────

        // Call request pathano
        socket.on('call_user', ({ to, from, roomId, callerName }) => {
            io.to(to).emit('incoming_call', {
                from,
                roomId,
                callerName,
            });
        });

        // Call accept
        socket.on('call_accepted', ({ to, from, roomId }) => {
            io.to(to).emit('call_accepted', { from, roomId });
        });

        // Call reject
        socket.on('call_rejected', ({ to }) => {
            io.to(to).emit('call_rejected');
        });

        // Call end
        socket.on('call_ended', ({ to }) => {
            io.to(to).emit('call_ended');
        });

        // WebRTC offer
        socket.on('webrtc_offer', ({ to, offer }) => {
            io.to(to).emit('webrtc_offer', { offer, from: socket.id });
        });

        // WebRTC answer
        socket.on('webrtc_answer', ({ to, answer }) => {
            io.to(to).emit('webrtc_answer', { answer });
        });

        // ICE candidate exchange
        socket.on('ice_candidate', ({ to, candidate }) => {
            io.to(to).emit('ice_candidate', { candidate });
        });
    });
};
