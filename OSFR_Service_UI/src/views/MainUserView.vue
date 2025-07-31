<template>
  <div class="user-page-container">
    <h1>Это страница пользователя</h1>
  </div>

  <router-link :to="{ name: 'auth'}">
      <button class="login-button">Войти</button>
    </router-link>
</template>

<style scoped>
.user-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: sans-serif;
  color: #333;
}

h1 {
  font-size: 2.5rem;
}

.login-button {
    background-color: #D6E9FD;
    color: #191F66;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.3125rem;
    cursor: pointer;
    width: 7.6875rem;
    height: 2.9375rem;
    font-size: 1.5625rem;
    
    margin-right: 34px;
}
</style>