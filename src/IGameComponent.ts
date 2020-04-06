namespace TableauDestroyer {
    export interface IGameComponent {
        initialize(): void;
        uninitialize(): void;
        update(updateTime: number): void;
        draw(): void;
    }
}