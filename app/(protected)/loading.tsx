"use client"
import { ClipLoader} from "react-spinners";

export default function Loader() {
    return (
        <div className="fixed z-50 flex items-center justify-center w-full h-full bg-black/20">
            <ClipLoader/>
        </div>
    );
}
