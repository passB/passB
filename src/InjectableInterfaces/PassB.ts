import {Extension, FileFormat, Filler, Matcher} from '.';

export interface PassB {
  getAllExtensions(): Array<Extension<{}>>;

  getExtension(name: string): Extension<{}>;

  getMatcher(): Matcher<{}>;

  getAllMatchers(): Array<Matcher<{}>>;

  getFiller(): Filler<{}> ;

  getAllFillers(): Array<Filler<{}>> ;

  getFileFormat(): FileFormat<{}>;

  getAllFileFormats(): Array<FileFormat<{}>> ;

  reloadEntries(): Promise<this> ;

  reloadExtension(): Promise<{}>;
}
