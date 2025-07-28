<script>
import SearchInput from '@/components/SearchInput.vue';
import CategoryDropdown from '../components/CategoryDropdown.vue';
export default {
  name: 'MainView',
  components: {
    SearchInput,
    CategoryDropdown
  }

};
</script>

<template>
    <header class="app-header">
    <div class="header-left">
      <img src="@/assets/icons/Logo_OSFR.jpg" alt="OSFR Logo" class="logo">
      </div>
        <button class="login-button">Войти</button>
  </header>

  <div class="name-banner">
        Корпоративный ресурс ОСФР <br>по г. Москве и Московской области
    </div>

    <div class="search-category">
      <SearchInput/>
      <CategoryDropdown/>
    </div>

    
</template>

<style>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 5.5625rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 3.25rem;
  width: 3.9375rem;
  margin-left: 33px;
}

.login-button {
    background-color: #D6E9FD;
    color: #191F66;
    border: none;
    padding: 0.5625rem 1.5625rem;
    border-radius: 0.3125rem;
    cursor: pointer;
    width: 7.6875rem;
    height: 2.9375rem;
    font-size: 1.5625rem;
    
    margin-right: 34px;
}

.name-banner {
    width: 100%;
    height: 13.125rem;
    background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
    color: #FFFFFF; 
    font-size: 4.3125rem;
    font-family: 'Lato-SemiBold';
    letter-spacing: 0.03rem;

    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    padding: 1.375rem;
    text-align: center;
}
</style>