export const company = {
  name: "STE SANI-ESSEF",
  mark: "ANI ESSEF",
  slogan: "Ça donne envie de rénover",
  phone: "73 664 229",
  phoneTel: "+21673664229",
  gsm: "26 416 564",
  gsmTel: "+21626416564",
  whatsapp: "21626416564",
  address: "Route de Mahdia, Ksour Essef, Tunisie",
  hours: "08:00 - 18:30",
  days: "Ouvert 7/7",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(name: string) {
  return `Bonjour STE SANI-ESSEF, je suis intéressé par le produit ${name}. Pouvez-vous me donner plus d'informations concernant le prix et la disponibilité ?`;
}

export function generalWhatsappMessage() {
  return "Bonjour STE SANI-ESSEF, je souhaite des informations sur vos produits et votre showroom.";
}
