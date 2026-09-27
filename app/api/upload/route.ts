import { NextResponse } from "next/server";
import { denied, requireAdmin } from "@/lib/guard";
import { saveUpload } from "@/lib/upload";

export async function POST(request: Request) {
  if (!(await requireAdmin())) return denied();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  const url = await saveUpload(file);
  return NextResponse.json({ url });
}
