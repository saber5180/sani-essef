import { ProjectManager } from "@/components/admin/ProjectManager";
import { readDb } from "@/lib/store";

export default async function ProjectsAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Réalisations</h1>
      <ProjectManager projects={db.projects} products={db.products} />
    </div>
  );
}
