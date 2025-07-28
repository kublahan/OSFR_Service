<script>
export default {
  name: 'SearchInput',

};
</script>

<template>

      <input type="text" class="search-input" placeholder="Поиск..."></input>

</template>

<style>


.search-input {
  width: 66.5rem;
  height: 3.6875rem;
  background-color: #D6E9FD;
  border: none;
  border-radius: 0.625rem;
  margin-left: 9.375rem;
  margin-top: 2.5rem;

  background-image: url('@/assets/icons/Search_Magnifying_Glass.svg');
  background-repeat: no-repeat;
  background-position: 21px center;
  background-size: 1.5rem;
  padding-left: 3rem;

  font-family: 'Inter-Regular';
  font-size: 1.5625rem;

}

.search-input::placeholder {
  font-family: 'Inter-Regular'; /* не работает*/
  font-size: 1.5625rem;
  color: #000000;
  opacity: 0.6;
}
</style>