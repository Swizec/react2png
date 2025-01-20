import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

// const filePath = "count.txt";

// async function readCount() {
//     return parseInt(
//         await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
//     );
// }

// const getCount = createServerFn({
//     method: "GET",
// }).handler(() => {
//     return readCount();
// });

// const updateCount = createServerFn({ method: "POST" })
//     .validator((d: number) => d)
//     .handler(async ({ data }) => {
//         const count = await readCount();
//         await fs.promises.writeFile(filePath, `${count + data}`);
//     });

async function fetchAAPL() {
    const response = await fetch(
        `https://api.polygon.io/v1/open-close/AAPL/2025-01-17?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
    );
    const json = await response.json();
    return json;
}

const getAAPL = createServerFn({
    method: "GET",
}).handler(() => {
    return process.env.POLYGON_API_KEY;
    // return fetchAAPL();
});

export const Route = createFileRoute("/")({
    component: Home,
    loader: async () => await getAAPL(),
    // loader: async () => await getCount(),
});

function Home() {
    const router = useRouter();
    const AAPL = Route.useLoaderData();
    const day = "2025-01-17";

    return (
        <>
            <h1>Hello world</h1>
            <p>Plain ole React component.</p>
            <p>
                AAPL stock on {day} fetched from API for 👉 ${AAPL}
            </p>
        </>
    );
}
