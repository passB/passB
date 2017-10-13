import {Service} from 'typedi';
import {memoizeWithTTL} from 'Decorators/memoizeWithTTL';

interface PassReply {
  stdout: string[];
  stderr: string[];
  returnCode: number;
}

@Service()
export class PassCli {
  @memoizeWithTTL(5000) // cache list calls for 5 seconds
  public async list(): Promise<string[]> {
    const response = await this.executeCommand('list-entries');

    return response.stdout;
  }

  public async show(path: string): Promise<string[]> {
    return (await this.executeCommand('show', [path])).stdout;
  }

  private async executeCommand(command: string, args: string[] = []): Promise<PassReply> {
    const response = await browser.runtime.sendNativeMessage('passb', {command, args}) as PassReply;
    if (response.returnCode !== 0) {
      throw new Error(response.stderr.join('\n'));
    }
    return response;
  }
}
