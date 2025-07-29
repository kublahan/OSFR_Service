import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default {
  getCategories() {
    return api.get('/categories');
  },
  getResources() {
    return api.get('/items');
  }
};