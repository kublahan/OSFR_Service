<template>
  <div class="background">
  <div class="name-banner">
    Корпоративный ресурс ОСФР <br />по г. Москве и Московской области
  </div>

  <div class="auth-form">
    <img src="/Logo_OSFR.svg" alt="logo" class="logo-auth" />
    <div class="auth-title">Авторизация</div>
    <div class="input-group">
      <!-- <img src="/icons/user-icon.svg" alt="Login Icon" class="input-icon" /> -->
      <input type="text" placeholder="Логин" class="login-input" />
    </div>
    <div class="input-group">
      <!-- <img src="/icons/lock-icon.svg" alt="Password Icon" class="input-icon" /> -->
      <input type="password" placeholder="Пароль" class="password-input" />
      <!-- <img
        src="/icons/eye-icon.svg"
        alt="Show Password Icon"
        class="password-toggle-icon"
      /> -->
    </div>
    <button class="enter-btn">Войти</button>
    <button class="back-btn" @click="goBack">Назад</button>
  </div>
  </div>

</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  name: 'AuthorizationView',
  components: {},
};
</script>

<style scoped>
.background {
  background: linear-gradient(
    to right,
    #FFFFFF,
    #D6E9FD
  );
  min-height: 100vh; /* Растягиваем на всю высоту окна просмотра */
  width: 100vw; /* Растягиваем на всю ширину окна просмотра */
  display: flex; /* Используем flexbox для центрирования содержимого */
  flex-direction: column; /* Элементы внутри будут располагаться в колонку */
  align-items: center; /* Центрируем по горизонтали */
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