export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in validation time limit exceeded (20 minutes).');
    }
}