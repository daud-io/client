import { Settings } from "./settings";

const minimapSize = 180;
const minimapMarginBottom = 15;
const minimapMarginRight = 15;

const colors = {
    red: 0xff0000,
    pink: 0xff00cb,
    orange: 0xffa500,
    yellow: 0xffff00,
    cyan: 0x00ffff,
    green: 0x00ff00
};

export class Minimap {
    constructor(stage, size) {
        this.ctx = new PIXI.Graphics();
        this.ctx.position.x = size.width - minimapSize - minimapMarginRight;
        this.ctx.position.y = size.height - minimapSize - minimapMarginBottom;
        stage.addChild(this.ctx);
    }
    size(size) {
        this.ctx.position.x = size.width - minimapSize - minimapMarginRight;
        this.ctx.position.y = size.height - minimapSize - minimapMarginBottom;
    }
    checkDisplay() {
        if (Settings.displayMinimap != this.ctx.visible) this.ctx.visible = Settings.displayMinimap;
    }
    update(data, worldSize, fleetID) {
        this.worldSize = worldSize;
        const startIndex = data.Type === "Team" ? 2 : 0;
        const isCTF = data.Type === "CTF";
        this.ctx.clear();

        if (document.body.classList.contains("alive") || document.body.classList.contains("spectating")) {
            this.ctx
                .lineStyle(1, 0x999999)
                .beginFill(0x000000, 0.5)
                .drawRect(0, 0, minimapSize, minimapSize)
                .endFill()
                .lineStyle(0);
            for (let i = startIndex; i < data.Entries.length; i++) {
                const entry = data.Entries[i];
                const entryIsSelf = entry.FleetID == fleetID;
                this.drawMinimap(entry.Position.X, entry.Position.Y, entry.Color, entryIsSelf, i, isCTF);
            }
        }
    }
    drawMinimap(x, y, color, self, rank, isCTF) {
        const minimapX = ((x + this.worldSize) / 2 / this.worldSize) * minimapSize;
        const minimapY = ((y + this.worldSize) / 2 / this.worldSize) * minimapSize;

        if (self) {
            // mark "self" player
            this.ctx
                .beginFill(0xffffff)
                .lineStyle(1, 0xffffff)
                .drawRect(minimapX - 3, minimapY - 3, 6, 6)
                .endFill();
        } else if (rank === 0 && !isCTF) {
            // mark the king
            //this.ctx.drawImage(crownImg, 0, 0);
            //.beginFill(0xdaa520)
            //.drawRect(minimapX - 3, minimapY - 3, 6, 6)
            //.endFill();
            var x = Math.floor(minimapX - 4);
            var y = Math.floor(minimapY - 2);
            this.ctx
                .beginFill(0xdaa520)
                .lineStyle(1, 0xdaa520)
                .moveTo(x, y)
                .lineTo(2 + x, 2 + y)
                .lineTo(4 + x, 0 + y)
                .lineTo(6 + x, 2 + y)
                .lineTo(8 + x, 0 + y)
                .lineTo(8 + x, 4 + y)
                .lineTo(0 + x, 4 + y)
                .closePath()
                .endFill();
        } else if (isCTF && rank < 2) {
            // draw flags in CTF mode
            this.ctx
                .lineStyle(2, colors[color])
                .drawRect(minimapX - 4, minimapY - 4, 8, 8)
                .endFill();
        } else {
            this.ctx
                .lineStyle(1, colors[color])
                .beginFill(colors[color])
                .drawRect(minimapX - 2, minimapY - 2, 4, 4)
                .endFill();
        }
    }
}
