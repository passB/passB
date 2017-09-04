export abstract class FileFormat {
  public abstract getPassword(lines: string[], entryName: string): string | undefined;
  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}
