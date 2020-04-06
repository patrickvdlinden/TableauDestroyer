namespace TableauDestroyer {
    export class Tile {
        color?: string;
        refreshInTicks: number;
        points: number = 1;
        
        constructor(
            public x: number,
            public y: number,
            public width: number,
            public height: number) {
        }

        get isColored(): boolean {
            return this.color !== undefined && this.color !== null && this.color !== "";
        }

        withPoints(points: number): Tile {
            this.points = points;
            return this;
        }
    }
}