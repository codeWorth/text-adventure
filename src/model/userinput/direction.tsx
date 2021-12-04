enum Direction {
    NOTRTH = "north", 
    SOUTH = "south", 
    EAST = "east",
    WEST = "west"
};

export function oppositeDirection(direction: Direction) {
    switch (direction) {
        case Direction.EAST:
            return Direction.WEST;
        case Direction.WEST:
            return Direction.EAST;
        case Direction.NOTRTH:
            return Direction.SOUTH;
        case Direction.SOUTH:
            return Direction.NOTRTH;
    }
}

export default Direction;