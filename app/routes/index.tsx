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
import { useQuery } from "@tanstack/react-query";
import {
    createFileRoute,
    useRouteContext,
    useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

async function fetchStock(stonk: string) {
    const response = await fetch(
        `https://api.polygon.io/v1/open-close/${stonk}/2025-01-15?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`
    );
    const json = await response.json();
    console.log(json);
    return json;
}

const getStonk = createServerFn({
    method: "GET",
})
    .validator((data: { stonk: string }) => {
        return {
            stonk: data?.stonk,
        };
    })
    .handler(async ({ data }) => {
        return fetchStock(data?.stonk);
    });

export const Route = createFileRoute("/")({
    component: Home,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData({
            queryKey: ["stonks", "AAPL"],
            queryFn: () => getStonk({ data: { stonk: "AAPL" } }),
        });
        await context.queryClient.ensureQueryData({
            queryKey: ["stonks", "MSFT"],
            queryFn: () => getStonk({ data: { stonk: "MSFT" } }),
        });
    },
});

const StockCard = ({ stonk }: { stonk: string }) => {
    const { data, isLoading, isError, isRefetching } = useQuery({
        queryKey: ["stonks", stonk],
        queryFn: () => {
            return getStonk({ data: { stonk } });
        },
    });

    const value =
        isLoading || isRefetching ? (
            <CircularProgress size="sm" />
        ) : isError ? (
            <Typography level="h2">Error</Typography>
        ) : data.high ? (
            <Typography level="h2">${data.high}</Typography>
        ) : (
            <Typography level="h2">No data</Typography>
        );

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
                    <Typography level="body-md">{stonk}</Typography>
                    {value}
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
    const context = Route.useRouteContext();

    function reloadData() {
        context.queryClient.invalidateQueries({
            queryKey: ["stonks"],
            refetchType: "all",
        });
    }

    return (
        <Stack spacing={2} sx={{ maxWidth: 450 }}>
            <Typography level="h1">Hello react2png</Typography>
            <Typography level="body-md">
                This is a regular ole React component inside a TanStack Start
                app. Full support for css-in-js with a composable design system
                (JoyUI). Loading data from an API.
            </Typography>

            <StockCard stonk="AAPL" />
            <StockCard stonk="MSFT" />

            <Typography level="body-md">
                But look, the server response depends on URL. It can be a plain
                PNG, a fully interactive webapp, or a PDF.
            </Typography>
            <Button variant="soft" onClick={reloadData}>
                Reload Data
            </Button>
        </Stack>
    );
}
