namespace TableauDestroyer {
    export class Mouse {
        private static _container: HTMLElement;
        private static _viewport: Viewport;
        private static _previousState: MouseState;
        private static _currentState: MouseState;
        private static _lastKnownMousePosition: { x: number, y: number } = { x: -1, y: -1 };
        private static _isLeftButtonPressed = false;
        private static _isMiddleButtonPressed = false;
        private static _isRightButtonPressed = false;
        
        static hook(container: HTMLElement, viewport: Viewport) {
            this._container = container;
            this._viewport = viewport;

            container.onmousemove = this.onMouseMove;
            container.onmousedown = this.onMouseDown;
            container.onmouseup = this.onMouseUp;
            container.oncontextmenu = this.onContextMenu;
        }

        static unhook() {
            this._container.onmousemove = null;
            this._container.onmousedown = null;
            this._container.onmouseup = null;
            this._container.oncontextmenu = null;
            this._container = null;
        }

        static get previousState(): MouseState {
            return this._previousState;
        }

        static get currentState(): MouseState {
            return this._currentState || new MouseState(0, 0, false, false, false);
        }

        static updateState() {
            this._previousState = this.currentState;
            this._currentState = new MouseState(
                this._lastKnownMousePosition.x - this._viewport.x,
                this._lastKnownMousePosition.y - this._viewport.y,
                this._isLeftButtonPressed,
                this._isMiddleButtonPressed,
                this._isRightButtonPressed
            );
        }

        private static onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();

            Mouse._lastKnownMousePosition = {
                x: ev.pageX - Mouse._container.offsetLeft,
                y: ev.pageY - Mouse._container.offsetTop
            };
        }

        private static onMouseDown = (ev: MouseEvent) => {
            ev.preventDefault();

            const buttonId = typeof ev.buttons !== "undefined" ? ev.buttons : (ev.which || ev.button);

            Mouse._isLeftButtonPressed = (buttonId & MouseButtons.Left) === MouseButtons.Left;
            Mouse._isMiddleButtonPressed = (buttonId & MouseButtons.Middle) === MouseButtons.Middle;
            Mouse._isRightButtonPressed = (buttonId & MouseButtons.Right) === MouseButtons.Right;
        }

        private static onMouseUp = (ev: MouseEvent) => {
            ev.preventDefault();

            const buttonId = typeof ev.buttons !== "undefined" ? ev.buttons : (ev.which || ev.button);

            Mouse._isLeftButtonPressed = (buttonId & MouseButtons.Left) === MouseButtons.Left;
            Mouse._isMiddleButtonPressed = (buttonId & MouseButtons.Middle) === MouseButtons.Middle;
            Mouse._isRightButtonPressed = (buttonId & MouseButtons.Right) === MouseButtons.Right;
        }

        private static onContextMenu = (ev: PointerEvent): boolean => {
            ev.preventDefault();

            return false;
        }
    }
}