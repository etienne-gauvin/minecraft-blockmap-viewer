import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { getChunkName, World, CHUNK_SIZE } from "./resources";

export class WorldMap extends PIXI.Container {
	private readonly tiles = new PIXI.Container();
	private readonly pointer = new PIXI.Point();
	private readonly origin = new PIXI.Point();

	// create viewport
	private viewport: Viewport;

	constructor(private app: PIXI.Application, private world: World) {
		super();

		this.viewport = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			interaction: app.renderer.plugins.interaction,
		});

		this.viewport
			.drag()
			.pinch()
			.wheel()
			.decelerate();

		this.addChild(this.viewport);
		this.viewport.addChild(this.tiles);

		this.app.ticker.add(() => {
			const worldPointerPos = this.viewport.toWorld(this.pointer);

			const x = Math.floor(worldPointerPos.x - this.origin.x);
			const y = Math.floor(worldPointerPos.y - this.origin.y);

			const $panel = document.querySelector(".panel");

			if ($panel) {
				$panel.innerHTML = `Position : ${x} ; ${y}`;
			}
		});

		this.viewport.addListener("mousemove", event => {
			this.pointer.x = event.data.global.x;
			this.pointer.y = event.data.global.y;
		});

		app.loader.onComplete.add(this.handleLoadComplete.bind(this));
	}

	private handleLoadComplete(
		loader: PIXI.Loader,
		resources: Partial<Record<string, PIXI.LoaderResource>>
	) {
		// Trouver les limites du monde
		const xmin = this.world.chunks
			.map(c => c.x)
			.reduce((x1, x2) => Math.min(x1, x2));

		const ymin = this.world.chunks
			.map(c => c.y)
			.reduce((y1, y2) => Math.min(y1, y2));

		const xmax = this.world.chunks
			.map(c => c.x)
			.reduce((x1, x2) => Math.max(x1, x2));

		const ymax = this.world.chunks
			.map(c => c.y)
			.reduce((y1, y2) => Math.max(y1, y2));

		for (const chunk of this.world.chunks) {
			const res = resources[getChunkName(this.world, chunk)];

			if (res !== undefined) {
				res.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

				const sprite = new PIXI.Sprite(res.texture);

				// Placement du chunk
				sprite.x = (chunk.x - xmin) * sprite.width;
				sprite.y = (chunk.y - ymin) * sprite.height;

				this.tiles.addChild(sprite);

				// Définir le point 0;0 de la carte
				if (+chunk.x === 0 && +chunk.y === 0) {
					this.origin.x = sprite.x;
					this.origin.y = sprite.y;
				}
			}
		}

		this.viewport.worldWidth = (xmax - xmin + 1) * CHUNK_SIZE;
		this.viewport.worldHeight = (ymax - ymin + 1) * CHUNK_SIZE;

		// Limites de déplacement
		this.viewport.clamp({ direction: "all" });

		// Limites de zoom
		this.viewport.clampZoom({
			maxHeight: this.viewport.worldHeight,
			maxWidth: this.viewport.worldWidth,
			minHeight: 32,
			minWidth: 32,
		});

		// Centrer la vue
		this.viewport.snap(
			this.viewport.worldWidth / 2,
			this.viewport.worldHeight / 2,
			{ time: 0, removeOnComplete: true }
		);
	}
}
