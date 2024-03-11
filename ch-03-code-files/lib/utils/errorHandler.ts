
export class HttpException extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = 'Not Found') {
        super(404, message);
    }
}
