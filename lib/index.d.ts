// Type definitions

declare class Unrar {
  /**
   * Options:
   *   - `filepath` the rar file path
   *   - `password` optional, password of rar file
   */
  constructor(filepath: string, password?: string);

  /**
   * Descriptions of archive entries
   */
  list(): Promise<Object[]>;

  /**
   * ReadableStream of entry for extracting
   * 
   *  `name` String Name of entry for extracting
   */
  stream(name: string): ReadableStream;
}

export = Unrar