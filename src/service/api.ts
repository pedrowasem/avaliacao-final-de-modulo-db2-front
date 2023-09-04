import _axios from 'axios';

export const axios = _axios.create({
	baseURL: 'https://notehub-db2.onrender.com',
});
