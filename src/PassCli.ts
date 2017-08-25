interface PassReply {
  stdout: string[];
  stderr: string[];
  returnCode: number;
}

export class PassCli {
  public static async list(): Promise<string[]> {
    const REGEX_LINE = /^((?:(?:[|`]-{0,2})\s*)+)(.*$)/;
    const REGEX_TREENODE = /([|`]-{0,2})/g;
    const response = await PassCli.executeCommand('list');
    const list = [];
    const stack = [];

    for (const line of response.stdout) {
      const match = REGEX_LINE.exec(line);
      if (!match) {
        continue;
      }
      const currentPrefix = match[1];
      const currentEntry = match[2];
      let nodeCount = 0;
      while (REGEX_TREENODE.exec(currentPrefix) !== null) {
        nodeCount++;
      }

      while (stack.length > Math.max(nodeCount - 1, 0)) {
        stack.pop();
      }
      stack.push(currentEntry);

      list.push(stack.join('/'));
    }

    return list;
  }

  public static async show(path: string): Promise<string[]> {
    return (await PassCli.executeCommand('show', [path])).stdout;
  }

  private static async executeCommand(command: string, args: string[] = []): Promise<PassReply> {
    const response = await browser.runtime.sendNativeMessage("passb", {command, args}) as PassReply;
    if (response.returnCode !== 0) {
      throw new Error(response.stderr.join("\n"));
    }
    return response;
  }
}
