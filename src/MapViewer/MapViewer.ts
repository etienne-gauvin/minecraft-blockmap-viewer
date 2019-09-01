import * as PIXI from "pixi.js";
import { worlds } from "../blockmap-images.json";
import { addWorldsImagesToLoader, logLoadedResources } from "./resources";
import { WorldMap } from "./WorldMap";
import { Viewport } from "pixi-viewport";

const view = document.querySelector(
	"canvas#viewer"
) as HTMLCanvasElement | null;

if (!view) {
	throw new Error(`Cannot find the HTMLCanvasElement for the map viewer.`);
}

const app = new PIXI.Application({ view, backgroundColor: 0x07081b });
addWorldsImagesToLoader(app.loader);
app.loader.load(logLoadedResources);

app.resizeTo = window;
app.resize();

const worldName = "overworld";
const world = worlds.find(w => w.directory === worldName);

if (!world) {
	throw new Error(`Cannot find world ${worldName}.`);
}

const map = new WorldMap(app, world);
app.stage.addChild(map);
