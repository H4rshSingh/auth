"use client"
import { ClipLoader} from "react-spinners";

export default function Loader() {
    return (
        <div className="flex items-center justify-center w-full h-full ">
            <ClipLoader/>
        </div>
    );
}