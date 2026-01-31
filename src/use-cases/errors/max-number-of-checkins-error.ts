export class MaxNumberOfCheckinsError extends Error {
    constructor() {
        super('Maximum number of check-ins reached for today.');
    }
}