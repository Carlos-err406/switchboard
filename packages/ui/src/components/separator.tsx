import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "../utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  );
}

function SeparatorContent({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] place-items-center gap-1">
      <Separator />
      {children}
      <Separator />
    </div>
  );
}

export { Separator, SeparatorContent };
