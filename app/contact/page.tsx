import type { Metadata } from "next";
import { ContactActions, ContactForm } from "@/components/contact/ContactForm";
import { company } from "@/lib/company";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact",
  description: "STE SANI-ESSEF, Route de Mahdia, Ksour Essef. Téléphone 73 664 229, WhatsApp 26 416 564. Ouvert 7/7.",
};

export default async function ContactPage() {
  const db = await readDb();
  const settings = db.settings;
  const map = "https://maps.google.com/maps?q=Route%20de%20Mahdia%20Ksour%20Essef&z=15&output=embed";
  return (
    <div className="mx-auto grid max-w-page gap-12 px-4 py-12 md:px-8 lg:grid-cols-2 lg:py-16">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-wood">{company.mark}</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">{company.name}</h1>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-stone">Adresse</dt>
            <dd>{settings.address}</dd>
          </div>
          <div>
            <dt className="text-stone">Téléphone</dt>
            <dd><a href={`tel:${settings.phoneTel}`}>{settings.phone}</a></dd>
          </div>
          <div>
            <dt className="text-stone">GSM / WhatsApp</dt>
            <dd><a href={`https://wa.me/${settings.whatsapp}`}>{settings.gsm}</a></dd>
          </div>
          <div>
            <dt className="text-stone">Horaires</dt>
            <dd>
              {settings.days}
              <br />
              {settings.hours}
            </dd>
          </div>
        </dl>
        <ContactActions />
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
      <div className="min-h-[420px] overflow-hidden bg-mist">
        <iframe title="STE SANI-ESSEF sur Google Maps" src={map} className="h-full min-h-[520px] w-full border-0" loading="lazy" />
      </div>
    </div>
  );
}
