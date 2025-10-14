// src/services/lists.js
import api from './api';

export const createList = async (payload) => {
  try {
    const response = await api.post('/media/listas/create', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const addItemToList = async (payload) => {
  try {
    const response = await api.post('/media/listas/item/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding item to list:', error);
    throw error;
  }
};

export const removeItemFromList = async (payload) => {
  try {
    const response = await api.delete('/media/listas/item/delete', { data: payload });
    return response.data;
  } catch (error) {
    console.error('Error removing item from list:', error);
    throw error;
  }
};

export const getList = async (payload) => {
  try {
    const response = await api.post('/media/listas/get', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching list:', error);
    throw error;
  }
};

export const getUserLists = async (payload) => {
  try {
    const response = await api.post('/media/listas/user/get', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching user lists:', error);
    throw error;
  }
};

export const deleteList = async (payload) => {
  try {
    const response = await api.delete('/media/listas/delete', { data: payload });
    return response.data;
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};