import { Client, Account, Storage, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT!) // https://cloud.appwrite.io/v1
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID!)
  .setDevKey(import.meta.env.VITE_APPWRITE_API_KEY!); // <-- add your API key here

export const account = new Account(client);
export const storage = new Storage(client);
export const db = new Databases(client);
