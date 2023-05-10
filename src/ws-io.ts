export interface IRequest {
    target: string;
    cmd: string;
    param: any;
}

export class Response {
    constructor(
        public type: string,
        public data: number | string | boolean | Array<number | string>,
    ) { }
}

export const RequestTarget = {
    button: 'button',
    questionnaire: 'questionnaire',
    message: 'message',
}
