/// <reference path="Rectangle.ts" />

namespace TableauDestroyer {
    export class Viewport extends Rectangle {
        public constructor(private game: Game, x: number = null, y: number = null, width: number = null, height: number = null) {
            super(x, y, width, height);
        }
    }
}