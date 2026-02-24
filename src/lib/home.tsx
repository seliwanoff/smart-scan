import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className=" from-blue-600 to-indigo-700 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Convert Screenshots & Photos <br /> Into Editable Text in Seconds
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Extract text from screenshots, receipts, notes, and documents
            instantly. Built for students, business owners, and professionals.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to={"/auth"}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Try for Free
            </Link>
            <Link
              to={"/pricing"}
              className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful Features Built For You
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to extract and manage text effortlessly.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <FeatureCard
              title="Instant OCR Processing"
              desc="Upload any screenshot or photo and extract text in seconds."
            />
            <FeatureCard
              title="Clean Formatting"
              desc="Automatically removes unnecessary spaces and messy line breaks."
            />
            <FeatureCard
              title="Copy & Export"
              desc="Copy text instantly or export to PDF and Word (Pro)."
            />
            <FeatureCard
              title="Bulk Upload"
              desc="Upload multiple images and extract text in one go."
            />
            <FeatureCard
              title="Secure & Private"
              desc="Your uploads are processed securely and never shared."
            />
            <FeatureCard
              title="Fast & Lightweight"
              desc="Optimized for speed with minimal loading time."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <StepCard
              number="1"
              title="Upload Image"
              desc="Drag and drop your screenshot or document."
            />
            <StepCard
              number="2"
              title="Extract Text"
              desc="Our OCR engine scans and converts it instantly."
            />
            <StepCard
              number="3"
              title="Copy or Export"
              desc="Edit, copy, or download your extracted text."
            />
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Simple Pricing</h2>

          <div className="grid md:grid-cols-2 gap-10 mt-16 max-w-4xl mx-auto">
            <PricingCard
              title="Free"
              price="₦0"
              features={[
                "2 uploads per day",
                "Basic OCR",
                "Copy text only",
                "Ads supported",
              ]}
            />

            <PricingCard
              title="Pro"
              price="₦1,000/month"
              highlight
              features={[
                "Unlimited uploads",
                "Bulk upload",
                "Export to PDF & Word",
                "No ads",
                "Priority processing",
              ]}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by Students & Businesses
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Testimonial
              text="This saved me hours typing lecture notes!"
              name="University Student"
            />
            <Testimonial
              text="We use this to scan receipts for accounting."
              name="Small Business Owner"
            />
            <Testimonial
              text="Very clean and fast tool. Highly recommend."
              name="Office Administrator"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Convert Your Screenshots?
        </h2>
        <p className="mt-4 text-blue-100">Start extracting text in seconds.</p>

        <button className="mt-8 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition">
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p>© {new Date().getFullYear()} Smart Scanner. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* COMPONENTS */

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-gray-600">{desc}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
        {number}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-gray-600">{desc}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  highlight,
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-10 rounded-2xl shadow-lg ${
        highlight ? "bg-blue-600 text-white scale-105" : "bg-white"
      }`}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-3xl font-bold">{price}</p>

      <ul className="mt-6 space-y-3 text-left">
        {features.map((feature, index) => (
          <li key={index}>✓ {feature}</li>
        ))}
      </ul>

      <button
        className={`mt-8 w-full py-3 rounded-xl font-semibold ${
          highlight ? "bg-white text-blue-600" : "bg-blue-600 text-white"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
}

function Testimonial({ text, name }: { text: string; name: string }) {
  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      <p className="italic">"{text}"</p>
      <p className="mt-4 font-semibold">{name}</p>
    </div>
  );
}
