"use client";

import { BeatLoader } from "react-spinners";

import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";


export const NewVerificationForm = () => {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }
        newVerification(token)
            .then((res) => {
                if (res.error) {
                    setError(res.error);
                } else {
                    setSuccess(res.success);
                }
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="flex items-center justify-center w-full">
                {!success && !error &&
                    <BeatLoader />
                }
                <FormSuccess message={success} />
                {
                    !success &&
                    <FormError message={error} />
                }
            </div>
        </CardWrapper>
    )
}