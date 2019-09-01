import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { getChunkName, World } from "./resources";

export class WorldMap extends PIXI.Container {
	private readonly tiles = new PIXI.Container();
	private readonly tilesBorder = new PIXI.Graphics();
	private readonly chunkSize = new PIXI.Point();
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

				const tex = new PIXI.Sprite(res.texture);

				tex.x = (chunk.x - xmin) * tex.width;
				tex.y = (chunk.y - ymin) * tex.height;

				this.chunkSize.x = tex.width;
				this.chunkSize.y = tex.height;

				this.tiles.addChild(tex);

				const border = new PIXI.Graphics();
				border.lineStyle(1, 0x000000, 0.2);
				border.drawRect(
					tex.x + 0.5,
					tex.y + 0.5,
					tex.width - 1,
					tex.height - 1
				);

				const text = new PIXI.Text(`${chunk.x} ; ${chunk.y}`);
				text.position.set(tex.x, tex.y);

				// this.tiles.addChild(border);
				// this.tiles.addChild(text);

				if (+chunk.x === 0 && +chunk.y === 0) {
					this.origin.x = tex.x;
					this.origin.y = tex.y;
				}
			}
		}

		this.tilesBorder.lineStyle(5, 0xff0000);
		this.tilesBorder.drawRect(
			xmin * this.chunkSize.x,
			ymin * this.chunkSize.y,
			(xmax - xmin) * this.chunkSize.x,
			(ymax - ymin) * this.chunkSize.y
		);

		this.viewport.worldWidth = (xmax - xmin) * this.chunkSize.x;
		this.viewport.worldHeight = (ymax - ymin) * this.chunkSize.y;
		this.viewport.clamp({ direction: "all" });
		this.viewport.clampZoom({
			maxHeight: this.viewport.worldHeight,
			maxWidth: this.viewport.worldWidth,
			minHeight: 32,
			minWidth: 32,
		});

		this.viewport.snap(
			this.viewport.worldWidth / 2,
			this.viewport.worldHeight / 2,
			{ time: 0, removeOnComplete: true }
		);

		// this.viewport.fitWorld(false);

		// this.tiles.addChild(this.tilesBorder);
	}
}
