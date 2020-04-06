namespace TableauDestroyer {
    export class MouseState {
        private _x: number = -1;
        private _y: number = -1;
        private _leftButtonPressed: boolean = false;
        private _middleButtonPressed: boolean = false;
        private _rightButtonPressed: boolean = false;

        constructor(x: number, y: number, leftButtonPressed: boolean, middleButtonPressed: boolean, rightButtonPressed: boolean) {
            this._x = x;
            this._y = y;
            this._leftButtonPressed = leftButtonPressed;
            this._middleButtonPressed = middleButtonPressed;
            this._rightButtonPressed = rightButtonPressed;
        }

        get x(): number {
            return this._x;
        }

        get y(): number {
            return this._y;
        }

        get isLeftButtonPressed(): boolean {
            return this._leftButtonPressed;
        }

        get isMiddleButtonPressed(): boolean {
            return this._middleButtonPressed;
        }

        get isRightButtonPressed(): boolean {
            return this._rightButtonPressed;
        }        
    }
}