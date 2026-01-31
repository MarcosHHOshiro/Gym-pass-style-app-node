export class MaxDistanceError extends Error {
    constructor() {
        super('The maximum distance allowed has been exceeded.');
    }
}