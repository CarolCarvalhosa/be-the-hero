import axios from 'axios';

const api = axios.create({
    baseURL: 'http://YOUR_IP_HERE:3333'
});

export default api;