"use client";

import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreateArticleModal } from "./create-article-modal";

export function BlogHeaderActions() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return null;
  }
  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="gap-2">
        <PenSquare className="w-4 h-4" />
        Write Article
      </Button>

      <CreateArticleModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
