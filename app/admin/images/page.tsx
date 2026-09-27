import fs from "fs";
import path from "path";
import { ImageLibrary } from "@/components/admin/ImageLibrary";
import { readDb } from "@/lib/store";

export default async function ImagesAdmin() {
  const db = await readDb();
  const fromData = [
    ...db.products.flatMap((product) => product.images.map((image) => image.url)),
    ...db.projects.map((project) => project.image),
    ...db.categories.map((category) => category.image),
    ...db.banners.map((banner) => banner.image),
    ...db.quotes.map((quote) => quote.imageUrl || ""),
  ].filter(Boolean);
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploaded = fs.existsSync(uploadDir)
    ? fs
        .readdirSync(uploadDir)
        .filter((file) => file !== ".gitkeep")
        .map((file) => `/uploads/${file}`)
    : [];
  const urls = Array.from(new Set([...uploaded, ...fromData]));
  return (
    <div>
      <h1 className="mb-3 font-serif text-5xl">Images</h1>
      <p className="mb-8 text-sm text-stone">Cliquez une image pour copier son adresse, puis collez-la dans une fiche produit.</p>
      <ImageLibrary urls={urls} />
    </div>
  );
}
