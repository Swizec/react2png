/// <reference types="vinxi/types/server" />
import {
    createStartHandler,
    defaultRenderHandler,
    StartServer,
} from "@tanstack/start/server";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import ReactDOMServer from "react-dom/server";
import nodeHtmlToImage from "node-html-to-image";
import puppeteer from "puppeteer";
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
};

const pdfRenderHandler: typeof defaultRenderHandler = async ({
    router,
    responseHeaders,
}) => {
    let html = ReactDOMServer.renderToString(<StartServer router={router} />);
    html = html.replace(
        `</body>`,
        `${router.injectedHtml.map((d) => d()).join("")}</body>`
    );

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    return new Response(pdf, {
        status: router.state.statusCode,
        headers: {
            "Content-Type": "application/pdf",
        },
    });
};

const switchingHandler: typeof defaultRenderHandler = async ({
    request,
    router,
    responseHeaders,
}) => {
    const url = new URL(request.url);
    const format = url.searchParams.get("f");

    if (format === "png") {
        return pngRenderHandler({ request, router, responseHeaders });
    } else if (format === "pdf") {
        return pdfRenderHandler({ request, router, responseHeaders });
    } else {
        return defaultRenderHandler({ request, router, responseHeaders });
    }
};

export default createStartHandler({
    createRouter,
    getRouterManifest,
})(switchingHandler);
