import { cookies } from "next/headers";
import { dictionaries, type Locale } from "./i18n";

export async function getDictionary() {
  const jar = await cookies();
  const raw = jar.get("sani_locale")?.value;
  const locale: Locale = raw === "en" || raw === "ar" ? raw : "fr";
  return { locale, t: dictionaries[locale] };
}
