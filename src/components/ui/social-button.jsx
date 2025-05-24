import * as React from "react"
import { cn } from "../../lib/utils"
import { Slot } from "@radix-ui/react-slot"

const SocialButton = React.forwardRef(
  (
    { className, variant = "default", size = "default", asChild = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "relative overflow-hidden group",
          {
            "bg-white text-black border border-gray-300 dark:bg-slate-800 dark:text-white dark:border-slate-600":
              variant === "outline",
            "bg-primary text-primary-foreground": variant === "default",
            "bg-destructive text-destructive-foreground": variant === "destructive",
            "bg-secondary text-secondary-foreground": variant === "secondary",
            "bg-transparent text-foreground underline-offset-4 hover:underline": variant === "link",
            "bg-[#4285F4] text-white dark:bg-[#3367D6]": variant === "google",
            "bg-[#24292F] text-white dark:bg-[#1a1e22]": variant === "github",
            "bg-[#1877F2] text-white dark:bg-[#166FE5]": variant === "facebook",
            "bg-[#1DA1F2] text-white dark:bg-[#1A91DA]": variant === "twitter",
            "bg-[#0A66C2] text-white dark:bg-[#0958A5]": variant === "linkedin",
            "bg-[#25D366] text-white dark:bg-[#22C55E]": variant === "whatsapp",
            "bg-[#EA4335] text-white dark:bg-[#DC2626]": variant === "youtube",
            "bg-[#FF4500] text-white dark:bg-[#EA580C]": variant === "reddit",
            "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white":
              variant === "gradient",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">{children}</span>

        {/* Curved Flip Overlay (Half-covered, Faster) */}
        <span
          className={cn(
            "absolute inset-0 z-0 pointer-events-none before:content-[''] before:absolute before:bottom-0 before:right-0 before:w-full before:h-full before:bg-inherit before:origin-bottom-right before:rotate-[100deg] before:rounded-bl-[100%] before:transition-transform before:duration-500 before:ease-in-out group-hover:before:rotate-[0deg]",
            {
              "before:bg-gray-100 dark:before:bg-slate-700": variant === "outline",
              "before:bg-primary/90": variant === "default",
              "before:bg-destructive/90": variant === "destructive",
              "before:bg-secondary/80": variant === "secondary",
              "before:bg-transparent": variant === "link",
              "before:bg-[#4285F4]/90 dark:before:bg-[#3367D6]/90": variant === "google",
              "before:bg-[#24292F]/90 dark:before:bg-[#1a1e22]/90": variant === "github",
              "before:bg-[#1877F2]/90 dark:before:bg-[#166FE5]/90": variant === "facebook",
              "before:bg-[#1DA1F2]/90 dark:before:bg-[#1A91DA]/90": variant === "twitter",
              "before:bg-[#0A66C2]/90 dark:before:bg-[#0958A5]/90": variant === "linkedin",
              "before:bg-[#25D366]/90 dark:before:bg-[#22C55E]/90": variant === "whatsapp",
              "before:bg-[#EA4335]/90 dark:before:bg-[#DC2626]/90": variant === "youtube",
              "before:bg-[#FF4500]/90 dark:before:bg-[#EA580C]/90": variant === "reddit",
              "before:bg-gradient-to-r before:from-purple-600 before:to-pink-600 dark:before:from-purple-500 dark:before:to-pink-500":
                variant === "gradient",
            }
          )}
        />
      </Comp>
    )
  }
)

SocialButton.displayName = "SocialButton"

export { SocialButton }
