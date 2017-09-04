import {FileFormat} from "./FileFormat";

export type UsernameStyle = "None" | "SecondLine" | "LastPathPart";
interface Options {
  usernameStyle: UsernameStyle;
}

export class FirstLineFileFormat extends FileFormat {
  private options: Options = {
    usernameStyle: "LastPathPart",
  };

  public getPassword(lines: string[], entryName: string): string | undefined {
    return lines[0];
  }

  public getUsername(lines: string[], entryName: string): string | undefined {
    switch (this.options.usernameStyle) {
      case "SecondLine":
        return lines[1];
      case "LastPathPart":
        return entryName.split(/[/\\]/).pop();
      default:
        return void 0;
    }
  }
}
