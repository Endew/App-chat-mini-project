<template>
  <div class="app">
    <div v-if="loginStatus === 0">
      <login />
    </div>
    <div v-else>
      <chat />
    </div>
  </div>
</template>

<script setup>
  import chat from "./components/chat.vue";
  import login from "./components/login.vue";
  import { loginStatus } from "./loginStatus";
  import { jwtDecode } from "jwt-decode";

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decode = jwtDecode(token);
      console.log("decoded token:", decode);
      if (decode.loginStatus === 1) {
        loginStatus.value = 1;
      } else {
        loginStatus.value = 0;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      loginStatus.value = 0;
    }
  } else if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    loginStatus.value = 0;
  }
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  max-height: 100%;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
