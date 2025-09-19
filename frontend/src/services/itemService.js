import axios from 'axios';

const API_URL = 'http://localhost:8080/api/items';

const getAuth = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  return { auth: { username, password } };
};

export const getAllItems = async () => {
  const response = await axios.get(API_URL, getAuth());
  return response.data;
};

export const createItem = async (name, quantity) => {
  const response = await axios.post(API_URL, { name, quantity }, getAuth());
  return response.data;
};

export const updateItem = async (id, name, quantity) => {
  const response = await axios.put(`${API_URL}/${id}`, { name, quantity }, getAuth());
  return response.data;
};

export const deleteItem = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuth());
};
