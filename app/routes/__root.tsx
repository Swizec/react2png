import { CssVarsProvider, ScopedCssBaseline } from "@mui/joy";
import {
    Outlet,
    ScrollRestoration,
    createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { useState, type ReactNode } from "react";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "TanStack Start Starter",
            },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    return (
        <RootDocument>
            <CssVarsProvider>
                <ScopedCssBaseline ref={(element) => setRoot(element)}>
                    <Outlet />
                </ScopedCssBaseline>
            </CssVarsProvider>
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <Meta />
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
