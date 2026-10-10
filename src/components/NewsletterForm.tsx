"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl items-center justify-center gap-3 border border-ember bg-ember/10 px-6 py-5">
        <Check size={18} className="text-ember" />
        <p className="font-mono text-xs tracking-[0.25em] text-paper">
          YOU&apos;RE ON THE LIST — DROP 003 GETS SENT TO YOU FIRST
        </p>
      </div>
    );
  }

  return (
    <form
      className="mx-auto flex max-w-xl border border-line bg-coal focus-within:border-ember"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="YOUR@EMAIL.COM"
        className="w-full bg-transparent px-5 py-4 font-mono text-xs tracking-[0.2em] text-paper placeholder:text-smoke focus:outline-none"
      />
      <button
        type="submit"
        className="btn-press flex items-center gap-2 bg-ember px-6 font-mono text-xs font-bold tracking-[0.25em] text-ink hover:bg-paper"
      >
        JOIN <ArrowRight size={14} />
      </button>
    </form>
  );
}
