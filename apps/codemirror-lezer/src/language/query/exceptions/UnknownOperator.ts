type PositionParams = {
    from: number;
    to: number;
}

export class UnknownOperatorException extends Error {
    constructor(text: string, pos: PositionParams) {
        super(`Unknown operator "${text}" at position ${pos.from}-${pos.to}`);
    }
}
