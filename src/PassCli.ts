import {injectable} from 'inversify';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {memoizeWithTTL} from 'Decorators/memoizeWithTTL';
import {setLastError, ErrorType} from './State/HostApp/index';

interface PassReply {
  stdout: string[];
  stderr: string[];
  returnCode: number;
}

@injectable()
export class PassCli implements Interfaces.PassCli {
  @lazyInject(Symbols.State)
  protected state: Interfaces.State;

  @memoizeWithTTL(5000) // cache list calls for 5 seconds
  public async list(): Promise<string[]> {
    const response = await this.executeCommand('list-entries');

    return response.stdout;
  }

  public async show(path: string): Promise<string[]> {
    return (await this.executeCommand('show', [path])).stdout;
  }

  private async executeCommand(command: string, args: string[] = []): Promise<PassReply> {
    try {
      const response = await browser.runtime.sendNativeMessage('passb', {command, args}) as PassReply;

      if (response.returnCode !== 0) {
        this.state.getStore().dispatch(setLastError({message: response.stderr.join('\n'), type: ErrorType.PASS_EXECUTION_ERROR}));
      }
      return response;
    } catch (e) {
      this.state.getStore().dispatch(setLastError({message: e.message, type: ErrorType.HOST_APP_ERROR}));
      return {stdout: [], stderr: [], returnCode: -1};
    }
  }
}
