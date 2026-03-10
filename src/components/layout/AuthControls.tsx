"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthControlsProps {
  className?: string;
  mobile?: boolean;
}

export function AuthControls({ className, mobile = false }: AuthControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        mobile && "flex-col items-stretch",
        className,
      )}
    >
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button
            variant={mobile ? "outline" : "ghost"}
            className={cn(mobile && "w-full")}
          >
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className={cn(mobile && "w-full")}>Sign up</Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className={cn(mobile && "flex justify-center")}>
          <UserButton />
        </div>
      </Show>
    </div>
  );
}
