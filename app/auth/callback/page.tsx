"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/utils/supabase/client";
import { Container, Spinner } from "react-bootstrap";

function AuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get("code");
            const next = searchParams.get("next") ?? "/";

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(
                    code
                );
                if (error) {
                    console.error(
                        "Error exchanging code for session:",
                        error.message
                    );
                    router.push("/auth/auth-code-error");
                    return;
                }
            }

            // Successfully exchanged code or no code (already signed in perhaps)
            router.push(next);
        };

        handleAuthCallback();
    }, [searchParams, router]);

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="text-center">
                <Spinner animation="border" variant="info" className="mb-3" />
                <p className="text-muted">Completing authentication...</p>
            </div>
        </Container>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <Container
                    className="d-flex align-items-center justify-content-center"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="text-center">
                        <Spinner
                            animation="border"
                            variant="info"
                            className="mb-3"
                        />
                        <p className="text-muted">Loading...</p>
                    </div>
                </Container>
            }
        >
            <AuthCallbackHandler />
        </Suspense>
    );
}
