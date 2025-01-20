/// <reference types="vinxi/types/server" />
import {
    createStartHandler,
    defaultRenderHandler,
    StartServer,
} from "@tanstack/start/server";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import ReactDOMServer from "react-dom/server";
import nodeHtmlToImage from "node-html-to-image";

import { createRouter } from "./router";

const pngRenderHandler: typeof defaultRenderHandler = async ({
    router,
    responseHeaders,
}) => {
    let html = ReactDOMServer.renderToString(<StartServer router={router} />);
    html = html.replace(
        `</body>`,
        `${router.injectedHtml.map((d) => d()).join("")}</body>`
    );

    const image = await nodeHtmlToImage({ html, quality: 100 });

    return new Response(image, {
        status: router.state.statusCode,
        headers: {
            "Content-Type": "image/png",
        },
    });

    return new Response(`<!DOCTYPE html>${html}`, {
        status: router.state.statusCode,
        headers: responseHeaders,
    });
};

export default createStartHandler({
    createRouter,
    getRouterManifest,
})(pngRenderHandler);
