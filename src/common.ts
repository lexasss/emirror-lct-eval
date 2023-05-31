export const SettingsName = 'emirrorquest';

export interface ISettings {
    ip: string;
    maxScore: number;
}

export interface IRequest {
    target: string;
    cmd: string;
    param: any;
}

export const ResponseType = {
    questionnaire: 'questionnaire',
    target: 'target',
}

export class Response {
    constructor(
        public type: string,
        public data: number | string | boolean | Array<number | string>,
    ) { }
}

export const RequestType = {
    button: 'button',
    questionnaire: 'questionnaire',
    message: 'message',
    score: 'score',
}
