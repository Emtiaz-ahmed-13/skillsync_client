import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => Promise<void>;
  loading: boolean;
}

export function MeetingRequestModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: MeetingRequestModalProps) {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) {
      setError("Please enter a meeting link");
      return;
    }
    if (!link.startsWith("http")) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    try {
      await onSubmit(link);
      setLink("");
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Meeting</DialogTitle>
          <DialogDescription>
            Provide a Google Meet link for the freelancer to discuss this
            submission.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-link">Google Meet Link</Label>
            <Input
              id="meeting-link"
              placeholder="https://meet.google.com/..."
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
