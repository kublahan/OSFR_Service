<template>
  <div class="background">
    <div class="name-banner">
      Корпоративный ресурс ОСФР <br />по г. Москве и Московской области
    </div>

    <div class="auth-form">
      <img src="@/assets/icons/Logo_OSFR.svg" alt="logo" class="logo-auth" />
      <div class="auth-title">Авторизация</div>
      <div class="input-group">

        <input type="text" placeholder="Логин" class="login-input" v-model="username" />
      </div>
      <div class="input-group">

        <input type="password" placeholder="Пароль" class="password-input" v-model="password" />
      </div>
      <button class="enter-btn" @click="handleLogin">Войти</button>
      <div class="back-btn-container">
        <button class="back-btn" @click="goBack">Назад</button>
      </div>
      
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

  top: 0;
  left: 0;
  margin-top: 0;

  margin-top: 89px;
}

.auth-form {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 5px 10px rgba(26, 25, 92, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38.563rem;
  height: 36.125rem;
  margin-top: 4.625rem;
}

.logo-auth {
  width: 4.25rem;
  height: 3.5rem;
  margin-bottom: 8px;
  margin-top: 45px;
}

.auth-title {
  font-size: 48px;
  font-family: 'Inter-Medium';
  color: #1A1A5F;
}



.login-input {
  margin: 28px 83px 0px 80px;
  background-image: url('@/assets/icons/User_alt.svg');
  background-repeat: no-repeat;
  background-position: 21px center;
  background-size: 1.5rem;
  padding-left: 1.313rem;
  position: relative;

  display: flex;
  justify-content: center;
}

.password-input {
  margin: 28px 83px 40px 80px;
  background-image: url('@/assets/icons/Unlock.svg');
  background-repeat: no-repeat;
  background-position: 21px center;
  background-size: 1.5rem;
  padding-left: 1.313rem;
  display: flex;
  justify-content: center;
} 


.input-group input {
  font-family: 'Inter-Light';
  border: 1px solid #0D6BDA;
  border-radius: 40px;
  font-size: 28px;
  color: #000000;
  outline: none;
  background-color: #F9F9F9;
  padding-left: 50px;
  width: 28.375rem;
  height: 4.125rem;
}

.input-icon {
  position: absolute;
  margin: 216px 492px 338px 101px;
  width: 24px;
  height: 24px;
  color: #888888;
  z-index: 10;
}


.enter-btn {
  background-color: #114EAE;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 28px;
  font-family: 'Inter-Regular';
  cursor: pointer;
  width: 28.375rem;
  height: 4.125rem;

}

.auth-form .back-btn-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 83px;
}

.back-btn {
  background-color: transparent;
  color: #124AA7;
  border: 1px solid #0D6BDA;
  border-radius: 8px;
  font-size: 22px;
  font-family: 'Inter-Light';
  cursor: pointer;
  width: 8.375rem;
  height: 2.188rem;
  box-sizing: border-box;
  margin-top: 10px;
  align-items: center;
}


</style>