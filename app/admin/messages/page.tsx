import { MessageList } from "@/components/admin/MessageList";
import { readDb } from "@/lib/store";

export default async function MessagesAdmin() {
  const db = await readDb();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Messages</h1>
      <MessageList messages={db.messages} />
    </div>
  );
}
