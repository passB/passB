import {Entry} from "PassB";
import * as React from 'react';

import './ListEntry.scss';

interface Props {
  entry: Entry;
  onClick: (entry: Entry) => void;
}

export const ListEntry = ({entry, onClick}: Props) =>
  <div className="list-entry" onClick={() => onClick(entry)}>{entry.label}</div>;
