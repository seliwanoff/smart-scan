import { Client, Account, Storage, Databases } from "appwrite";
export const baseURL = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const projectID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const client = new Client()
  .setEndpoint(baseURL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
export const account = new Account(client);
export const storage = new Storage(client);

export const databases = new Databases(client);
