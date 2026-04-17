import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/REPLACE_ME", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-forest/15 bg-forest/[0.03]">
        <div className="w-8 h-px bg-gold mb-6" />
        <p className="font-display italic text-forest text-2xl">Message envoyé !</p>
        <p className="font-sans text-xs text-forest/50 mt-2 tracking-wide">Nous vous répondrons sous 24h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="contact-name"
          className="text-[10px] uppercase tracking-[0.2em] text-forest/60 font-normal font-sans"
        >
          Nom complet
        </Label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Marie Dupont"
          className="rounded-none border-forest/20 bg-transparent h-12 font-sans text-sm text-[#2C1810] placeholder:text-[#2C1810]/30 focus-visible:ring-1 focus-visible:ring-forest/30 focus-visible:border-forest/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="contact-email"
          className="text-[10px] uppercase tracking-[0.2em] text-forest/60 font-normal font-sans"
        >
          Email
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="marie@email.fr"
          className="rounded-none border-forest/20 bg-transparent h-12 font-sans text-sm text-[#2C1810] placeholder:text-[#2C1810]/30 focus-visible:ring-1 focus-visible:ring-forest/30 focus-visible:border-forest/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="contact-message"
          className="text-[10px] uppercase tracking-[0.2em] text-forest/60 font-normal font-sans"
        >
          Message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Votre message…"
          className="rounded-none border-forest/20 bg-transparent resize-none font-sans text-sm text-[#2C1810] placeholder:text-[#2C1810]/30 focus-visible:ring-1 focus-visible:ring-forest/30 focus-visible:border-forest/50"
        />
      </div>

      <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full mt-2 rounded-none bg-forest text-cream hover:bg-[#2E5040] uppercase tracking-[0.18em] text-[10px] h-12 font-normal disabled:opacity-50 transition-colors duration-200"
      >
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
      </Button>

      {status === "error" && (
        <p className="text-center font-sans text-xs text-red-700">
          Une erreur est survenue. Merci de réessayer ou de nous écrire par email.
        </p>
      )}
    </form>
  );
}
