export interface XmlParser {
  parse: (xml: string) => TbmlData;
}

export interface TbmlData {
  tbml: {
    presentation: {
      table: Table;
    };
    metadata: Metadata;
  };
}

export interface Metadata {
  instance: {
    publicRelatedTableIds: string;
    'xml:lang': string;
    relatedTableIds: string;
    definitionId: number;
  };
  tablesource: string;
  title: string;
  category: string;
  tags: string;
  notes?: Notes;
}

export interface Notes {
  note: Array<Note> | Note;
}

export interface Note {
  noteid: string;
  content: string;
}

interface Table {
  tbody: {
    tr: Array<TableRow>;
  };
  thead: {
    tr: TableRow;
  };
  class: string;
}

export interface TableRow {
  th: Array<string> | number | string;
  td: Array<number> | number | string | PreliminaryData;
}

export interface PreliminaryData {
  class: string;
  content: number;
}
