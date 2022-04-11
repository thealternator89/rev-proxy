import {bold, red, yellow, underline} from 'colors/safe';
import {v4} from 'uuid';

const CR = '\r';
const LF = '\n';

const GetLines = (text: string) => text.replace(CR, LF).replace(`${CR}${LF}`, LF).split(LF);

export class Output {

    private requestId: string;

    public constructor(idBase: number) {
        const requestId = v4().substring(0, 8);
        this.requestId = `${idBase}-${requestId}`;
    }

    public Error(message: string): void {
        Output.Print(bold(red(`${underline('Error Occurred:')} ${message}`)));
    }

    public Warn(message: string): void {
        Output.Print(yellow(message));
    }

    public static Print(message: string) {
        console.log(message);
    }

    public LogRequestMessage(message: string) {
        this.LogDirectionalMessage(message, '>');
    }

    public LogResponseMessage(message: string) {
        this.LogDirectionalMessage(message, '<');
    }

    public LogBody(message: string) {
        this.LogDirectionalMessage(message, '|');
    }

    public LogDirectionalMessage(message: string, direction: '>'|'<'|'|') {
        GetLines(message).forEach((line) => Output.Print(`${this.requestId} ${direction} ${line}`));
    }

    public PrintLine(char: string = '=', length: number = 50) {
        Output.Print(new Array(length).join(' ').split(' ').map(_ => char).join(''))
    }

    public BlankLine() {
        console.log();
    }
}
