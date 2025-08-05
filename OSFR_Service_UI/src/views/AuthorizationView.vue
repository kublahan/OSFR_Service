<template>
  <div class="background">
    <div class="name-banner">
      Корпоративный ресурс ОСФР <br />по г. Москве и Московской области
    </div>

    <div class="auth-form">
      <img src="/Logo_OSFR.svg" alt="logo" class="logo-auth" />
      <div class="auth-title">Авторизация</div>
      <div class="input-group">
        <input type="text" placeholder="Логин" class="login-input" v-model="username" />
      </div>
      <div class="input-group">
        <input type="password" placeholder="Пароль" class="password-input" v-model="password" />
      </div>
      <button class="enter-btn" @click="handleLogin">Войти</button>
      <button class="back-btn" @click="goBack">Назад</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { loginAdmin } from '@/api/auth';
import { setAuthToken } from '../api/auth';

export default {
  name: 'AuthorizationView',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async handleLogin() {
    this.error = null;
    try {
      const data = await loginAdmin(this.username.trim(), this.password.trim());
      localStorage.setItem('adminToken', data.token);
      
      setAuthToken(data.token);

      this.$router.push({ name: 'admin' });
      
    } catch (err) {
      console.error('Ошибка входа:', err);
      this.error = err.response?.data?.msg || 'Неверные учетные данные или ошибка сервера.';
    }
  },
  },
};
</script>

<style scoped>
.background {
  background: linear-gradient(
    to right,
    #FFFFFF,
    #D6E9FD
  );
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.name-banner {
  width: 100%;
  height: 13.125rem;
  background: linear-gradient(
    to right,
    #0983fe 12%,
    #124aa7 41%,
    #1a185c 100%
  );
  color: #ffffff;
  font-size: 4.3125rem;
  font-family: 'Lato-SemiBold';
  letter-spacing: 0.03rem;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  padding: 1.375rem;
  text-align: center;

  position: absolute;
  top: 0;
  left: 0;
  margin-top: 0;

  margin-top: 89px;
}

.auth-form {
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 400px;
  margin-top: 89px;
}

.logo-auth {
  width: 80px;
  height: auto;
  margin-bottom: 10px;
}

.auth-title {
  font-size: 28px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group input {
  width: calc(100% - 40px);
  padding: 12px 15px 12px 40px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
}

.input-group .input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #888888;
}

.input-group .password-toggle-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #888888;
}

.enter-btn {
  background-color: #007bff;
  color: #ffffff;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}

.enter-btn:hover {
  background-color: #0056b3;
}

.back-btn {
  background-color: transparent;
  color: #007bff;
  padding: 10px 15px;
  border: 1px solid #007bff;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: auto;
  box-sizing: border-box;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.back-btn:hover {
  background-color: #e0f2f7;
}
</style>