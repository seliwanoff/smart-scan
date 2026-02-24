import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../lib/appwrite";
import PaystackPop from "@paystack/inline-js";
import dayjs from "dayjs";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const upgradeUserToSubscriber = async () => {
    const expiry = dayjs().add(1, "month").toISOString();

    await account.updatePrefs({
      role: "subscriber",
      subscriptionExpiry: expiry,
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const user = await account.get();

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: 3000 * 100, // Paystack uses kobo
        currency: "NGN",

        onSuccess: async (transaction: any) => {
          console.log("Payment successful:", transaction);

          await upgradeUserToSubscriber();

          alert("🎉 Payment successful! You are now a Pro subscriber.");
          navigate("/app");
        },

        onCancel: () => {
          alert("Payment cancelled.");
        },
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">Upgrade to Pro</h1>
        <p className="text-center text-gray-500 mb-12">
          Unlock unlimited OCR uploads
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FREE PLAN */}
          <div className="bg-white p-8 rounded-2xl shadow-md border">
            <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
            <p className="text-3xl font-bold mb-6">₦0</p>

            <ul className="space-y-3 text-gray-600 mb-8">
              <li>✅ 5 uploads per day</li>
              <li>✅ Basic OCR</li>
              <li>❌ No priority support</li>
            </ul>

            <button
              disabled
              className="w-full bg-gray-300 text-white py-3 rounded-xl cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500">
            <h2 className="text-2xl font-semibold mb-4">Pro Subscriber</h2>

            <p className="text-3xl font-bold mb-6">
              ₦3,000
              <span className="text-lg font-normal text-gray-500">/month</span>
            </p>

            <ul className="space-y-3 text-gray-600 mb-8">
              <li>🚀 Unlimited uploads</li>
              <li>🚀 Advanced OCR</li>
              <li>🚀 Priority processing</li>
              <li>🚀 Multiple format downloads</li>
            </ul>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all"
            >
              {loading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
