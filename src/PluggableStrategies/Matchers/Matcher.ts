import {Entry} from "PassB";
import {OptionsReceiver} from "../../Options/OptionsReceiver";

export abstract class Matcher<OptionType> extends OptionsReceiver<OptionType> {
  public abstract filterEntries(url: string, entries: Entry[]): Promise<Entry[]>;
}
