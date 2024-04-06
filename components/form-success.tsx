import { CheckCircledIcon } from "@radix-ui/react-icons"; 

interface FormErrorProps {
    message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
    if(!message) return null;
    return (
        <div className="bg-emerald-500/15 p-3 text-sm rounded-md flex items-center gap-x-2 text-emerald-500">
            <CheckCircledIcon className="h-4 w-4"/>
            <span>{message}</span>
        </div>
    );
}
