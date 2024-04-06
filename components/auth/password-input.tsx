import * as React from "react"

import { cn } from "@/lib/utils"
import { AiFillEye } from "react-icons/ai"
import { AiFillEyeInvisible } from "react-icons/ai";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    type = showPassword ? "text" : "password";

    return (
        <div className="relative flex items-center" >
            <input
              type={type}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-8 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              ref={ref}
              {...props}
            />
            {
                showPassword ? 
                <AiFillEyeInvisible className="absolute right-2 cursor-pointer text-muted-foreground" onClick={toggleShowPassword}/> 
                :
                <AiFillEye className="absolute right-2 cursor-pointer text-muted-foreground" onClick={toggleShowPassword}/>
            }
        </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }