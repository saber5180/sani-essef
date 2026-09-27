import { SettingsForms } from "@/components/admin/SettingsForms";
import { readDb } from "@/lib/store";

export default async function BannersAdmin() {
  const db = await readDb();
  const banner = db.banners[0];
  if (!banner) return null;
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Bannières</h1>
      <SettingsForms banner={banner} settings={db.settings} />
    </div>
  );
}
