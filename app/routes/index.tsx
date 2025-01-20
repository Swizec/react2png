import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

async function fetchAAPL() {
    const response = await fetch(
        `https://api.polygon.io/v1/open-close/AAPL/2025-01-17?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
    );
    const json = await response.json();
    console.log(json);
    return json;
}

const getAAPL = createServerFn({
    method: "GET",
}).handler(() => {
    return fetchAAPL();
});

export const Route = createFileRoute("/")({
    component: Home,
    loader: async () => await getAAPL(),
});

function Home() {
    const router = useRouter();
    const AAPL = Route.useLoaderData();
    const day = "2025-01-17";

    return (
        <>
            <h1>Hello world</h1>
            <p>Plain ole React component in a TanStack Start router.</p>
            <p>
                AAPL stock on {day} fetched from API 👉 ${AAPL.high}
            </p>
            <p>But look, the server response is a PNG.</p>
        </>
    );
}
