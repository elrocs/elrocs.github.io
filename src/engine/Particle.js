export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    inbounds(grid, x, y) {
        return (
            Array.isArray(grid) &&
            y >= 0 && y < grid.length &&
            Array.isArray(grid[y]) &&
            x >= 0 && x < grid[y].length
        );
    }

    move_to(grid, new_x, new_y) {
        if (this.inbounds(grid, new_x, new_y) && grid[new_y][new_x] === null) {
            grid[this.y][this.x] = null;
            this.x = new_x;
            this.y = new_y;
            grid[new_y][new_x] = this;
        }
    }

}