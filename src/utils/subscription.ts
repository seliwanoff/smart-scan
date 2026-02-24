import { account } from "../lib/appwrite";

export const checkSubscription = async () => {
  const user = await account.get();
  const role = user.prefs?.role;
  const expiry = user.prefs?.subscriptionExpiry;

  const isActiveSubscriber =
    role === "subscriber" && expiry && new Date(expiry) > new Date();

  return {
    role,
    isActiveSubscriber,
    expiry,
  };
};
