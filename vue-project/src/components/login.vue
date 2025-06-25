<template>
    <div class="login-container">
        <h1>Chit Chat</h1>
        <div class="login-form">
            <input
                type="text"
                v-model="username"
                placeholder="Username"
                @keyup.enter="login"
            />
            <input
                type="password"
                v-model="password"
                placeholder="Password"
                @keyup.enter="login"
            />
            <button class="btn-login" @click="login">Login</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { loginStatus } from '../loginStatus'

const username = ref('')
const password = ref('')

const login = async () => {
    try {
        if (username.value && password.value) {
            const response = await axios.post('http://localhost:3001/login', {
                username: username.value,
                password: password.value
            })

            console.log('token=', response.data.token)
            localStorage.setItem('token', response.data.token)
            const token = localStorage.getItem('token')

            const decode = jwtDecode(token)
            loginStatus.value = decode.loginStatus

            const user_id = decode.user_id
            localStorage.setItem('user_id', user_id)

            console.log('decoded token:', decode)
        } else {
            console.error('Username and password are required')
        }
    } catch (error) {
        console.error('Error during login:', error)
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
}
.login-form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
    padding: 20px;
}
.login-form input {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.btn-login {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}
</style>