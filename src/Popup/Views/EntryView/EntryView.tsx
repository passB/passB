import {Entry} from 'PassB';
import * as React from 'react';

interface Props {
  entry: Entry;
}

export const EntryView = ({entry}: Props) => <div>woop! {entry.label}</div>;
