<template>
    <div class="chat-container">
        <div class="chat-header">
            <h2 style="padding-left: 1rem;">Chat Messages</h2>
            <button class="btn-logout" @click="logoutConfirm = true">Logout</button>
        </div>
        <div class="chat-box" ref="chatBox">
            <ul>
                <li 
                    v-for="(message, index) in chatMessages"
                    :key="index"
                    :class="message.user_id === user_id ? 'my-message' : 'other-message'"
                >
                    <div v-if="message.user_id !== user_id">
                        <strong>{{ message.user_username }}</strong><br>
                    </div>
                    <div v-if="message.user_id === user_id">
                        <span style="margin-right: 10px;">
                            {{ formatTime(message.chat_time) }}
                        </span>
                        <div class="chat-text" style="margin-bottom: -1rem; margin-top: -1rem;">
                           <div>{{ message.chat_text }}</div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="chat-text">
                            <div>{{ message.chat_text }}</div>
                        </div>
                        <span style="margin-left: 10px;">
                            {{ formatTime(message.chat_time) }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="chat-input">
            <input type="text" v-model="newMessage" placeholder="Message" @keyup.enter="sendMessage" />
            <button @click="sendMessage">Send</button>
        </div>
        <div v-if="logoutConfirm" class="modal-overlay">
            <div class="modal">
                <p>Logout ?</p>
                <button @click="logout" style="background-color: #3be15f;">Yes</button>
                <button @click="logoutConfirm = false" style="background-color: #ea4545;">No</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { loginStatus } from '../loginStatus'

const chatMessages = ref([])
const chatMessagesOld = ref('')
const newMessage = ref('')
const chatBox = ref(null)
const user_id = ref('')
const logoutConfirm = ref(false)

const scrollToBottom = () => {
    nextTick(() => {
        if (chatBox.value) {
            chatBox.value.scrollTop = chatBox.value.scrollHeight
        }
    })
}

const sendMessage = async () => {
    if (newMessage.value.trim() === '') return

    try {
        await axios.post('http://localhost:3001/sendChat', {
            chat_text: newMessage.value,
            user_id: user_id.value,
            chat_time: new Date().toISOString()
        }, 
        { headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        newMessage.value = ''
        await loadChatMessages()
        scrollToBottom()
    } catch (error) {
        console.error('Error sending message:', error)
    }
};

const loadChatMessages = async () => {
    try {
        let response = await axios.get('http://localhost:3001/showChat', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        chatMessages.value = response.data
        // console.log('Chat messages:', chatMessages.value)
    } catch (error) {
        console.error('Error fetching chat messages:', error)
    }
};

const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
}

const loadUserId = () => {
    user_id.value = Number(localStorage.getItem('user_id'))
    // console.log('User ID:', user_id.value)
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    loginStatus.value = 0
    window.location.reload()
}

let realTimeChat = null

onMounted(async () => {
    loadUserId()
    await loadChatMessages()
    chatMessagesOld.value = JSON.stringify(chatMessages.value)
    scrollToBottom()

    realTimeChat = setInterval(async () => {
        await loadChatMessages()
        if (JSON.stringify(chatMessages.value) !== chatMessagesOld.value) {
            chatMessagesOld.value = JSON.stringify(chatMessages.value)
            scrollToBottom()
            console.log('Chat messages update!: ', chatMessages.value)
        }
    }, 3000)
});

</script>

<style lang="scss" scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    padding: 0px;
    margin: 0px;
    font-family: Arial, sans-serif;
    background-color: #ffffff;
}
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
}
.btn-logout {
    padding: 10px 20px;
    background-color: #ea4545;
    color: white;
    border: none;
    border-radius: 5px;
}
.modal-overlay {
    position: fixed;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background-color: white;
    padding: 30px;
    border-radius: 5px;
    text-align: center;
}
.modal button {
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
}
.chat-box {
    padding: 0px;
    height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
    margin-bottom: 10px;
}
.chat-box ul {
    list-style-type: none;
    padding: 0;
}
.chat-box li {
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 10px;
}
.chat-box strong {
    font-size: 16px;
}
.chat-box span {
    font-size: 10px;
    color: #777;
}
.chat-text {
    display: inline-block;
    padding: 10px;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: -1rem;
    word-break: break-word;
    max-width: 70%;
    font-size: 12px;
    padding-right: 14px;
}
.my-message {
    align-self: flex-end;
    text-align: right;

    .chat-text {
    background-color: #007bff;
    color: white;
    text-align: left;
  }
}
.other-message {
    align-self: flex-start;
    text-align: left;

    .chat-text {
    background-color: #f0f0f0;
    color: black;
  }
}
.chat-input {
    display: flex;
    justify-content: space-between;
    // margin-top: 10px;
    position: sticky;
    bottom: 0;
    padding: 1rem;
}
.chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 12px;
}
.chat-input button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}
</style>