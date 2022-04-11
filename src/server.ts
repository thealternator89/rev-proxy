import Koa from 'koa';
import axios from 'axios';

import { Output } from './output';

export class Server {

    private app: Koa;

    constructor (private port: number, private remote: string, private contextId: number) { }

    public up() {
        this.app = new Koa();
        this.app.use((ctx) => this.proxyRequest(ctx));
        this.app.listen(this.port, () => Output.Print(`Proxying HTTP on port ${this.port} to ${this.remote} (${this.contextId}-)`));
    }

    private async proxyRequest(ctx: Koa.ParameterizedContext) {
        const output = new Output(this.contextId);

        output.LogRequestMessage(`${ctx.method} ${ctx.url}`);
        output.LogRequestMessage(this.getHeaderBlob(ctx.headers));

        if (ctx.body) {
            output.LogBody(ctx.body as string);
        }

        output.BlankLine();

        // Clone the headers and delete the 'host' - so Axios will set its own.
        const headersToPass = {...ctx.headers};
        delete headersToPass.host;

        const response = await axios({
            url: `${this.remote}${ctx.url}`,
            method: ctx.method as any,
            headers: headersToPass as any,
            // Prevent parsing
            responseType: 'text',
            transformResponse: [v => v]
        });

        output.LogResponseMessage(`${response.status} ${response.statusText}`);
        output.LogResponseMessage(this.getHeaderBlob(response.headers));

        if (response.data) {
            output.LogBody(response.data);
        }
        
        output.BlankLine();

        ctx.status = response.status;
        ctx.body = response.data;
    }

    private getHeaderBlob(headers: any) {
        return Object.keys(headers).map((key) => `${this.formatHeaderKey(key)}: ${headers[key]}`).join('\n');
    }

    private formatHeaderKey(key: string) {
        return key.split('-').map(this.capitalise).join('-');
    }

    private capitalise(value: string) {
        if (!value){
            return value;
        }

        return `${value[0].toLocaleUpperCase()}${value.substring(1).toLocaleLowerCase()}`;
    }
}