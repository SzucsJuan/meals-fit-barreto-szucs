"use client";

import * as React from "react";

// util tailwind
function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

type TabsContextType = {
  value: string;
  setValue: (v: string) => void;
};

const TabsCtx = React.createContext<TabsContextType | null>(null);

type TabsProps = {
  value?: string;                
  defaultValue?: string;         
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({ value, defaultValue, onValueChange, className, children }: TabsProps) {
  const [internal, setInternal] = React.useState<string>(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? (value as string) : internal;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const firstTrigger = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!current && firstTrigger.current) setValue(firstTrigger.current);
  }, [current]);

  return (
    <TabsCtx.Provider value={{ value: current, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsCtx);
    if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>");

    const registered = React.useRef(false);
    React.useEffect(() => {
      if (!registered.current && !ctx.value) {
        (firstTrigger as any).current = value;
        registered.current = true;
      }
    }, [ctx.value, value]);

    const active = ctx.value === value;
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx.setValue(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          active
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
        aria-selected={active}
        data-state={active ? "active" : "inactive"}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & { value: string };
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsCtx);
    if (!ctx) throw new Error("TabsContent must be used within <Tabs>");
    const active = ctx.value === value;
    return (
      <div
        ref={ref}
        role="tabpanel"
        hidden={!active}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        data-state={active ? "active" : "inactive"}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

const firstTrigger = { current: null as null | string };
