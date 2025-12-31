import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ChatClient from "@/components/features/chat/chat-client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <ChatClient />;
}
