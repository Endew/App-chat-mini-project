import db from '../db.js';

const user = {
    login: (username, password) => {
        return db('user')
            .where({ 
                user_username: username,
                user_pass: password
            })
            .select('user_id', 'user_username')
            .first();
    },
    showChat: () => {
        return db('chat')
                .join('user', 'chat.user_id', '=', 'user.user_id')
                .select(
                    'chat.chat_id',
                    'user.user_id',
                    'user.user_username',
                    'chat.chat_text',
                    'chat.chat_time'
                )
                .orderBy('chat.chat_time', 'asc');
    },
    sendChat: (user_id, chat_text) => {
        return db('chat').insert({
                user_id,
                chat_text,
                chat_time: new Date()
            }).returning('*');
    }
}

export default user;