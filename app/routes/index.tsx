import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/joy";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

async function fetchAAPL() {
    const response = await fetch(
        `https://api.polygon.io/v1/open-close/AAPL/2025-01-15?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
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

const StockCard = ({ data }: { data: any }) => {
    return (
        <Card variant="solid" color="primary" invertedColors>
            <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate value={20}>
                    <SvgIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                            />
                        </svg>
                    </SvgIcon>
                </CircularProgress>
                <CardContent>
                    <Typography level="body-md">AAPL</Typography>
                    {data.high ? (
                        <Typography level="h2">${data.high}</Typography>
                    ) : (
                        <Typography level="h2">Loading...</Typography>
                    )}
                </CardContent>
            </CardContent>
            <CardActions>
                <Button variant="soft" size="sm">
                    Add to Watchlist
                </Button>
                <Button variant="solid" size="sm">
                    See breakdown
                </Button>
            </CardActions>
        </Card>
    );
};

function Home() {
    const router = useRouter();
    const AAPL = Route.useLoaderData();
    const day = "2025-01-15";

    return (
        <Stack spacing={2} sx={{ maxWidth: 450 }}>
            <Typography level="h1">Hello react2png</Typography>
            <Typography level="body-md">
                This is a regular ole React component inside a TanStack Start
                app. Full support for css-in-js with a composable design system
                (JoyUI). Loading data from an API.
            </Typography>
            <StockCard data={AAPL} />
            <Typography level="body-md">
                But look, the server response is a PNG.
            </Typography>
        </Stack>
    );
}
