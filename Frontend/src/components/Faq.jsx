import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I book an appointment with a lawyer?",
    answer:
      "Simply browse through our list of trusted lawyers, choose your preferred specialist, and click on 'Book Appointment'. You can schedule a video or in-person consultation securely.",
  },
  {
    question: "Can I chat with the AI Legal Assistant for free?",
    answer:
      "Yes, our AI Legal Assistant is available 24/7 to answer general legal queries and guide you through basic procedures — free of charge.",
  },
  {
    question: "Are all lawyers on LawBridge verified?",
    answer:
      "Absolutely. Every lawyer listed on LawBridge undergoes a strict verification process to ensure authenticity, expertise, and trustworthiness.",
  },
  {
    question: "What kind of legal issues can I discuss?",
    answer:
      "You can discuss a wide range of matters — from family and property disputes to corporate, criminal, and civil litigation issues. Our platform covers 10+ specializations.",
  },
  {
    question: "Is my data and conversation secure?",
    answer:
      "Yes. LawBridge uses encrypted communication and follows industry-standard privacy protocols to keep your chats, documents, and personal data fully secure.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-16 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-slate-500 text-lg">
          Answers to the most common questions about booking lawyers, using our
          AI assistant, and platform policies.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center text-left px-6 py-5 focus:outline-none"
            >
              <span className="text-lg font-medium text-slate-800">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-500 ${
                activeIndex === index ? "max-h-40 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-slate-600 text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-slate-500">
          Still have questions?{" "}
          <Link
            to="/contact"
            className="text-primary font-semibold hover:underline"
          >
            Contact our support
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Faq;
