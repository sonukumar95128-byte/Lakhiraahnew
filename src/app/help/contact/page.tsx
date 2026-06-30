"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Lakshiraah, my name is ${name || "[name]"}.\n\n${message || "[message]"}`
  )}`;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="font-heading italic text-3xl text-brand mb-2">Contact us</h1>
      <p className="text-sm text-ink/60 mb-8">
        Questions about an order, sizing, or a custom piece? Reach out and we&apos;ll get back to you.
      </p>

      <div className="rounded-xl border border-beige bg-white p-5 mb-8 space-y-2 text-sm">
        <p>
          <span className="text-ink/50">Phone / WhatsApp:</span>{" "}
          <span className="text-brand font-medium">+91 12345 67890</span>
        </p>
        <p>
          <span className="text-ink/50">Email:</span>{" "}
          <span className="text-brand font-medium">hello@lakshiraah.in</span>
        </p>
        <p>
          <span className="text-ink/50">Hours:</span> Mon-Sat, 10am-7pm IST
        </p>
      </div>

      <form className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={5}
          className="w-full rounded-lg border border-beige px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white hover:bg-[#1ebe5b] transition-colors"
        >
          Send via WhatsApp
        </a>
      </form>
    </div>
  );
}
