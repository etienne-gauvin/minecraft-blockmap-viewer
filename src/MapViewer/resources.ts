import { worlds } from "../blockmap-images.json";

export interface Chunk {
	x: number;
	y: number;
	file: string;
}

export interface World {
	chunks: Chunk[];
	directory: string;
}

export function addWorldsImagesToLoader(loader: PIXI.Loader): PIXI.Loader {
	for (const world of worlds) {
		for (const chunk of world.chunks) {
			loader.add(getChunkName(world, chunk));
		}
	}

	return loader;
}

export function getChunkName(world: World, chunk: Chunk): string {
	return `worlds/${world.directory}/${chunk.file}`;
}

export function logLoadedResources(
	loader: PIXI.Loader,
	resources: Partial<Record<string, PIXI.LoaderResource>>
) {
	console.groupCollapsed(
		"%c Loaded resources ",
		"color:white;background:blue"
	);

	for (const r in resources) {
		console.log(`Resource %c${r}`, "color:blue");
	}

	console.groupEnd();
}

export const CHUNK_SIZE = 512;
