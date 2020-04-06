namespace TableauDestroyer {
    export class Tableau implements IGameComponent {
        tiles: Tile[] = [];
        x: number;
        y: number;
        width: number;
        height: number;
        img: HTMLImageElement;

        private _imgLoaded: boolean = false;
        private _tileColors: string[] = ["red", null, "yellow", null, "blue", null, "black", null, "red", null, "yellow", null, "blue", null, "black", null];

        constructor(public game: Game) {
        }

        initialize(): void {
            this.x = 20;
            this.y = 20;

            this.img = new Image();
            this.img.src = "img/tableau_1.png";
            this.img.addEventListener("error", (e) => {
                console.error(e);
            });
            this.img.addEventListener("load", () => {
                console.log("Tableau_1.png loaded.");
                this._imgLoaded = true;
                
                this.width = this.img.width;
                this.height = this.img.height;
            });
            
            this.setupTiles();
        }

        setupTiles() {
            this.tiles = [
                new Tile(0, 0, 301, 233).withPoints(2),
                new Tile(306, 0, 185, 157).withPoints(4),
                new Tile(496, 0, 303, 71).withPoints(5),
                new Tile(804, 0, 272, 157).withPoints(3),
                new Tile(1081, 0, 71, 71).withPoints(10),
                new Tile(496, 76, 303, 81).withPoints(5),
                new Tile(306, 162, 292, 71).withPoints(5),     
                new Tile(603, 162, 382, 351).withPoints(1),
                new Tile(990, 162, 86, 351).withPoints(4),
                new Tile(1081, 76, 71, 437).withPoints(4),
                new Tile(0, 238, 108, 258).withPoints(4),
                new Tile(113, 238, 41, 410).withPoints(8),
                new Tile(159, 238, 261, 143).withPoints(3),
                new Tile(425, 238, 173, 143).withPoints(6),
                new Tile(159, 386, 172, 110).withPoints(7),
                new Tile(336, 386, 262, 203).withPoints(2),
                new Tile(0, 501, 108, 147).withPoints(7),
                new Tile(159, 501, 172, 147).withPoints(5),
                new Tile(336, 594, 475, 54).withPoints(5),
                new Tile(603, 518, 320, 71).withPoints(6),
                new Tile(816, 594, 107, 54).withPoints(10),
                new Tile(928, 518, 224, 130).withPoints(4)
            ];
        }

        uninitialize(): void {
            this.img = undefined;
            this._imgLoaded = false;
            this.tiles = [];
            this.width = 0;
            this.height = 0;
        }

        update(updateTime: number): void {
            for (let i=0; i<this.tiles.length; i++) {
                const tile = this.tiles[i];

                if (tile.refreshInTicks === undefined || this.game.ticks % tile.refreshInTicks === 0) {
                    tile.refreshInTicks = 300 + Math.floor(Math.random() * 500);
                    tile.color = this._tileColors[Math.floor(Math.random() * this._tileColors.length)];
                }
            }
        }

        draw(): void {
            if (!this._imgLoaded) {
                return;
            }
            
            const context = this.game.canvas.getContext("2d");
            context.drawImage(this.img, this.x, this.y);
            this.drawTiles(context);
        }

        drawTiles(context: CanvasRenderingContext2D): void {            
            for (let i=0; i<this.tiles.length; i++) {
                const tile = this.tiles[i];

                if (tile.isColored) {
                    context.fillStyle = tile.color;
                    context.fillRect(this.x + tile.x, this.y + tile.y, tile.width, tile.height);
                }
            }
        }
    }
}