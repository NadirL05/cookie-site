import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-none border-forest/20 bg-transparent h-12 font-sans text-sm text-[#2C1810] placeholder:text-[#2C1810]/30 focus-visible:ring-1 focus-visible:ring-forest/30 focus-visible:border-forest/50";
const labelClass =
  "text-[10px] uppercase tracking-[0.2em] text-forest/60 font-normal font-sans";
const selectClass =
  "rounded-none border border-forest/20 bg-transparent h-12 w-full px-3 font-sans text-sm text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-forest/30 focus:border-forest/50 cursor-pointer";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      /* ⚙️ Pour activer le formulaire : créer un compte sur formspree.io
         et remplacer VOTRE_ID_FORMSPREE par l'ID du formulaire (ex : xoqkjeyo) */
      const res = await fetch("https://formspree.io/f/VOTRE_ID_FORMSPREE", {
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
        <p className="font-display italic text-forest text-2xl">Demande envoyée !</p>
        <p className="font-sans text-xs text-forest/50 mt-2 tracking-wide">Nous vous répondrons sous 24h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom + Prénom */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-nom" className={labelClass}>Nom</Label>
          <Input
            id="contact-nom"
            name="nom"
            type="text"
            required
            placeholder="Dupont"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-prenom" className={labelClass}>Prénom</Label>
          <Input
            id="contact-prenom"
            name="prenom"
            type="text"
            required
            placeholder="Marie"
            className={inputClass}
          />
        </div>
      </div>

      {/* Téléphone + Email */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className={labelClass}>Téléphone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className={labelClass}>Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="marie@email.fr"
            className={inputClass}
          />
        </div>
      </div>

      {/* Date + Lieu */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-date" className={labelClass}>Date de l'événement</Label>
          <Input
            id="contact-date"
            name="date"
            type="date"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-lieu" className={labelClass}>Lieu de l'événement</Label>
          <Input
            id="contact-lieu"
            name="lieu"
            type="text"
            placeholder="Marseille, Aix-en-Provence…"
            className={inputClass}
          />
        </div>
      </div>

      {/* Invités + Type */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-invites" className={labelClass}>Nombre d'invités</Label>
          <Input
            id="contact-invites"
            name="invites"
            type="number"
            min="1"
            placeholder="50"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-type" className={labelClass}>Type d'événement</Label>
          <select id="contact-type" name="type" className={selectClass}>
            <option value="">Sélectionnez…</option>
            <option value="Mariage">Mariage</option>
            <option value="Anniversaire">Anniversaire</option>
            <option value="Entreprise">Entreprise / Corporate</option>
            <option value="Baptême / Baby shower">Baptême / Baby shower</option>
            <option value="EVJF / EVG">EVJF / EVG</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="contact-message" className={labelClass}>Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Décrivez votre projet, vos attentes, toute information utile…"
          className="rounded-none border-forest/20 bg-transparent resize-none font-sans text-sm text-[#2C1810] placeholder:text-[#2C1810]/30 focus-visible:ring-1 focus-visible:ring-forest/30 focus-visible:border-forest/50"
        />
      </div>

      <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full mt-2 rounded-none bg-forest text-cream hover:bg-[#2E5040] uppercase tracking-[0.18em] text-[10px] h-12 font-normal disabled:opacity-50 transition-colors duration-200"
      >
        {status === "sending" ? "Envoi en cours…" : "Recevoir mon devis gratuit →"}
      </Button>

      {status === "error" && (
        <p className="text-center font-sans text-xs text-red-700">
          Une erreur est survenue. Merci de réessayer ou de nous écrire directement à{" "}
          <a href="mailto:contact@cooksbrad.fr" className="underline">contact@cooksbrad.fr</a>.
        </p>
      )}
    </form>
  );
}
