<script>

export default {
  name: 'MainView',

};
</script>

<template>
    <header class="app-header">
    <div class="header-left">
      <img src="@/assets/icons/Logo_OSFR.jpg" alt="OSFR Logo" class="logo">
      </div>
    <div class="header-right">
        <button class="login-button">Войти</button>
      </div>
  </header>

  <div class="name-banner">
    <h1 class="name-text"> 
        Корпоративный ресурс ОСФР по г. Москве и Московской области
    </h1>
    </div>
</template>

<style>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 89px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 52px;
  width: 63px;
}

.login-button {
    background-color: #D6E9FD;
    color: #191F66;
    border: none;
    padding: 9px, 25px;
    border-radius: 5px;
    cursor: pointer;
    width: 123px;
    height: 47px;
    font-size: 25px;
}

.name-banner {
    width: 100%;
    height: 210px;
    text-align: center;
    background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
    color: #FFFFFF; 
    font-size: 69px;
}
</style>