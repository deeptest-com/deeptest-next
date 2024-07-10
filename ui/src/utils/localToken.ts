import localforage from 'localforage';
import settings from '@/config/settings';

export const getToken = async (): Promise<string | null> => {
  return await localforage.getItem(settings.siteTokenKey);
};

export const setToken = async (token: string): Promise<boolean> => {
  try {
    await localforage.setItem(settings.siteTokenKey, token);
    return true;
  } catch (error) {
    return false;
  }
};

export const removeToken = async (): Promise<boolean> => {
  try {
    await localforage.removeItem(settings.siteTokenKey);
    return true;
  } catch (error) {
    return false;
  }
};
