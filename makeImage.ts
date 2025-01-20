import nodeHtmlToImage from "node-html-to-image";

const res = await fetch("https://react2png.vercel.app/");
const html = await res.text();

await nodeHtmlToImage({
    output: "./image.png",
    html,
});

console.log("Check ./image.png");
