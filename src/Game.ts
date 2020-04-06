namespace TableauDestroyer {
    export class Game implements IGameComponent {
        tableau: Tableau;
        canvas: HTMLCanvasElement;
        
        private _viewport: Viewport;
        private _isStarted: boolean = false;
        private _updateInterval: number;
        private _ticks: number = 0;
        private _lastUpdateTime: number;
        private _isCountdown: boolean = false;
        private _countdownStartTime: number;
        private _countdownNumber: number;
        private _score: number = 0;
        private _gameOver: boolean = false;
        private _hiscores: Hiscore[];
        private _timer: number = 0;
        private _backgroundMusicCycler: AudioCycler;
        private _logo: HTMLImageElement;

        constructor(public gameContainer: HTMLElement) {
        }

        get viewport(): Viewport {
            return this._viewport;
        }

        get ticks(): number {
            return this._ticks;
        }

        get score(): number {
            return this._score;
        }

        initialize(): void {
            this._viewport = new Viewport(
                this,
                this.gameContainer.clientLeft,
                this.gameContainer.clientTop,
                this.gameContainer.clientWidth,
                this.gameContainer.clientHeight);

            this.canvas = document.createElement("canvas");
            this.gameContainer.append(this.canvas);
            this.tableau = new Tableau(this);
            this.tableau.initialize();
            
            this.canvas.width = this.gameContainer.clientWidth;
            this.canvas.height = this.gameContainer.clientHeight;

            this._hiscores = <Hiscore[]>JSON.parse(window.localStorage.getItem("hiscores") || "[]");
            this._hiscores = this._hiscores.sort((a: Hiscore, b: Hiscore) => b.score - a.score);

            this._lastUpdateTime = performance.now();
            this._updateInterval = setInterval(() => {
                const curDate = performance.now();
                this.update(curDate - this._lastUpdateTime);
                this._lastUpdateTime = curDate;
            }, 10);

            window.requestAnimationFrame(() => this.draw());
            Mouse.hook(this.gameContainer, this._viewport);
            this.gameContainer.addEventListener("resize", this.onGameContainerResize);

            this._logo = new Image();
            this._logo.src = "img/logo.png";
            this._logo.addEventListener("error", (e) => {
                console.error(e);
            });

            this._backgroundMusicCycler = new AudioCycler([
                "music/Blue Surprise.mp3",
                "music/Carousing every night.mp3",
                "music/Cheerful Piano.mp3",
                "music/Claim to fame.mp3",
                "music/Hypnotic.mp3",
                "music/In the circus.mp3",
                "music/Life Is A Pulse.mp3",
                "music/Missing Mysteries.mp3",
                "music/Out of my dreams.mp3",
                "music/The dance of the happy.mp3",
                "music/The lame duck.mp3",
                "music/This is war.mp3",
            ]);
            this._backgroundMusicCycler.volume = .5;
            this._backgroundMusicCycler.shuffle = true;
            this._backgroundMusicCycler.preload(() => {
                console.log("Background music loaded.");
                this._backgroundMusicCycler.play();
            }, (e: ErrorEvent) => {
                console.error(e);
            });
        }

        start(): void {
            this._isStarted = true;
            this._gameOver = false;
            this._score = 0;
            this._timer = 0;
            this._ticks = 0;
            this.tableau.setupTiles();       
            this._countdownStartTime = performance.now();
            this._isCountdown = true;
            this._countdownNumber = 3;
        }

        stop(): void {
            this._isStarted = false;
        }

        uninitialize(): void {            
            clearInterval(this._updateInterval);
            this.canvas.remove();
            this.tableau.uninitialize();
            this.tableau = null;
            Mouse.unhook();
            this.gameContainer.removeEventListener("resize", this.onGameContainerResize);
        }

        update(updateTime: number): void {
            Mouse.updateState();

            if (this._isCountdown && performance.now() - this._countdownStartTime >= 1000) {
                this._countdownNumber--;
                this._countdownStartTime = performance.now();

                if (this._countdownNumber === 0) {
                    this._isCountdown = false;
                }
            }

            if (this._isStarted && !this._isCountdown) {                
                if (!this._gameOver) {
                    this.tableau.update(updateTime);

                    if (this._timer >= 1000) {
                        this._score--;
                        this._timer = this._timer - 1000;
                    }

                    const mouse = Mouse.currentState;
                    for (let i=0; i<this.tableau.tiles.length; i++) {
                        const tile = this.tableau.tiles[i];
                        if (mouse.x >= this.tableau.x + tile.x
                            && mouse.y >= this.tableau.y + tile.y
                            && mouse.x <= this.tableau.x + tile.x + tile.width
                            && mouse.y <= this.tableau.y + tile.y + tile.height
                            && !Mouse.previousState.isLeftButtonPressed
                            && mouse.isLeftButtonPressed) {
                                this.onTileTapped(tile);
                            }
                    }

                    this._timer += updateTime;
                } else {
                    if (!Mouse.previousState.isLeftButtonPressed && Mouse.currentState.isLeftButtonPressed) {
                        this.stop();
                        this.start();
                    }
                }
            }
            else if (!this._isStarted) {
                if (!Mouse.previousState.isLeftButtonPressed && Mouse.currentState.isLeftButtonPressed) {
                    this.start();
                }
            }

            this._ticks++;
        }

        draw(): void {
            let context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.gameContainer.clientWidth, this.gameContainer.clientHeight);
            context.imageSmoothingEnabled = true;

            this.tableau.draw();

            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.textBaseline = "top";

            if (!this._isStarted) {
                context.drawImage(
                    this._logo,
                    this.tableau.x + (this.tableau.width / 2) - (this._logo.width / 2),
                    this.tableau.y + (this.tableau.height / 2) - (this._logo.height / 2));

                const clickText = "Click to start";
                context.font = "72px Comic Sans MS";
                const clickTextMeasure = context.measureText(clickText);
                const clickTextX = this.tableau.x + (this.tableau.width / 2) - (clickTextMeasure.width / 2);
                const clickTextY = this.tableau.y + (this.tableau.height / 2) + 50;
                
                context.fillText(clickText, clickTextX, clickTextY);
                context.strokeText(clickText, clickTextX, clickTextY);
            }

            if (this._isCountdown) {
                const countdownText = this._countdownNumber.toString();
                context.font = "100px Arial";
                const measure = context.measureText(countdownText);
                const textX = this.tableau.x + (this.tableau.width / 2) - (measure.width / 2)
                const textY = this.tableau.y + (this.tableau.height / 2) - 20;

                context.fillText(countdownText, textX, textY);
                context.strokeText(countdownText, textX, textY);
            }

            if (this._gameOver) {
                const gameOverText = "Game Over";
                context.font = "100px Arial";
                const measure = context.measureText(gameOverText);
                const textX = this.tableau.x + (this.tableau.width / 2) - (measure.width / 2)
                const textY = this.tableau.y + (this.tableau.height / 2) - 20;

                context.fillText(gameOverText, textX, textY);
                context.strokeText(gameOverText, textX, textY);
            }

            context.font = "32px Comic Sans MS";
            context.fillText("Score: " + this._score, this.tableau.x + this.tableau.width + 20, this.tableau.y);
            context.fillText("Hiscores", this.tableau.x + this.tableau.width + 20, this.tableau.y + 50);

            context.font = "24px Comic Sans MS";
            for (let i=1; i<=10; i++) {
                const hiscore = this._hiscores.length >= i ? this._hiscores[i - 1] : null;
                let name = hiscore?.name || "";
                const score = hiscore?.score || "";
                if (name) {
                    name += ": ";
                }

                context.fillText(i + ". " + name.substring(0, 10) + score, this.tableau.x + this.tableau.width + 20, this.tableau.y + 60 + (i * 30));
            }

            window.requestAnimationFrame(() => this.draw());
        }

        private onGameContainerResize = (e: UIEvent): any => {
            this.canvas.width = this.gameContainer.clientWidth;
            this.canvas.height = this.gameContainer.clientHeight;
            this._viewport.update(
                this.gameContainer.clientLeft,
                this.gameContainer.clientTop,
                this.gameContainer.clientWidth,
                this.gameContainer.clientHeight);
        }

        private onTileTapped(tile: Tile) {
            if (tile.color === "purple") {
                this._score--;
                return;
            }

            if (tile.color === "black") {
                this._gameOver = true;

                this._hiscores.push(new Hiscore(this._score, Date.now(), "Anonymous"));
                this._hiscores = this._hiscores.sort((a: Hiscore, b: Hiscore) => b.score - a.score);
                window.localStorage.setItem("hiscores", JSON.stringify(this._hiscores));
                return;
            }
            
            if (tile.color === undefined || tile.color === null || tile.color === "") {
                this._score -= tile.points;
            } else {
                this._score += tile.points;
                tile.color = "purple";
            }
        }
    }
}