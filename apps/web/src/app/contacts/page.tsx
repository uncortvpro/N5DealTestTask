import { MessageSquare } from "lucide-react";

export default function ContactsIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50">
        <MessageSquare size={20} className="text-navy-400" />
      </div>
      <p className="text-sm font-medium text-navy-700">Select a conversation</p>
      <p className="max-w-xs text-sm text-navy-400">
        Choose a conversation from the list to view messages.
      </p>
    </div>
  );
}
