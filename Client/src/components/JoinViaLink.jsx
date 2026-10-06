import { useRef, useState } from "react";
import { Link2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@base-ui/react";

import { toast } from "sonner";

export function JoinViaLink() {
  const linkRef = useRef();
  const [joining, setJoining] = useState(false);

  const handleJoin = () => {
    if (joining) return;

    if (!linkRef.current || linkRef.current.value === "") {
      toast.error("Link is required");
      return;
    }
    setJoining(true);
    window.location.href = linkRef.current.value;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="xl">
          Join via Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden p-0 gap-0">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-error/30" />
            <div className="w-3 h-3 rounded-full bg-primary-container/30" />
            <div className="w-3 h-3 rounded-full bg-secondary/30" />
          </div>
          <div className="text-xs font-label text-on-surface-variant  tracking-widest">DevHive</div>
          <div className="w-12" />
        </div>

        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
                <Link2 className="text-primary-container" size={18} />
              </div>
              <DialogTitle className="text-2xl font-headline font-bold tracking-tight">
                Join the room via Link
              </DialogTitle>
            </div>
            <DialogDescription className="text-on-surface-variant font-body leading-relaxed">
              Paste the room link you received to jump straight into the hive.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-6">
            <Label
              htmlFor="join-link"
              className="text-xs font-label uppercase tracking-widest text-on-surface-variant"
            >
              Invite link
            </Label>
            <div className="relative">
              <Input
                ref={linkRef}
                id="join-link"
                type="text"
                disabled={joining}
                className="w-full bg-surface-container rounded-lg border border-outline-variant/20 px-4 py-3 font-mono text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container/50 focus:border-primary-container/50 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-container/60 animate-pulse" />
            </div>
          </div>

          <DialogFooter>
            <Button size="xl" className="w-full gap-2" onClick={handleJoin} disabled={joining}>
              {joining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entering…
                </>
              ) : (
                <>
                  Enter Hive <ArrowRight size={18} />
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}