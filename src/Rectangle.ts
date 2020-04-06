namespace TableauDestroyer {
    export class Rectangle {
        private _x: number;
        private _y: number;
        private _width: number;
        private _height: number;
        private _right: number;
        private _bottom: number;
        private _centerX: number;
        private _centerY: number;

        public constructor();
        public constructor(x: number, y: number);
        public constructor(x: number, y: number, width: number, height: number);
        public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this._x = x || 0;
            this._y = y || 0;
            this._width = width || 0;
            this._height = height || 0;
            this._right = this._x + this._width;
            this._bottom = this.y + this._height;
            this._centerX = this.x + (this._width / 2);
            this._centerY = this.y + (this._height / 2);
        }

        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public get left(): number {
            return this._x;
        }

        public get right(): number {
            return this._right;
        }

        public get bottom(): number {
            return this._bottom;
        }

        public get centerX(): number {
            return this._centerX;
        }

        public get centerY(): number {
            return this._centerY;
        }

        public update(x: number, y: number): Rectangle;
        public update(x: number, y: number, width: number, height: number): Rectangle;
        public update(x: number, y: number, width: number = -91823, height: number = -91823): Rectangle {
            if (width === -91823) {
                width = this._width;
            }

            if (height === -91823) {
                height = this._height;
            }

            return new Rectangle(x, y, width, height);
        }

        public isInBounds(x: number, y: number): boolean {
            return x >= this.x && y >= this.y && x <= this.right && y <= this.bottom;
        }

        public collides(rectangle: Rectangle): boolean {
            // TODO:
            return false;
        }
    }
}