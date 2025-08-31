import HTTP_STATUS from "../constants/http.constants";

export abstract class CustomError extends Error{
    abstract status: string
    abstract statusCode: number

    constructor(message: string) {
        super(message)
    }
}

export class BadRequestException extends CustomError {
    status: string = 'error';
    statusCode: number = HTTP_STATUS.BAD_REQUEST

    constructor(message: string) {
        super(message)
    }
}

export class NotFoundExcepton extends CustomError {
    status: string = 'error';
    statusCode: number = HTTP_STATUS.NOT_FOUND

    constructor(message: string) {
        super(message)
    }

}

export class unathorizedException extends CustomError { 
    status: string = 'error';
    statusCode: number = HTTP_STATUS.UNATHORIZED

    constructor(message: string) {
        super(message)
    }
}

export class forbiddenException extends CustomError { 
    status: string = 'error';
    statusCode: number = HTTP_STATUS.FORBIDDEN

    constructor(message: string) {
        super(message)
    }
}

export class internalServerError extends CustomError { 
    status: string = 'error';
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER

    constructor(message: string) {
        super(message)
    }
}