/* eslint-disable prettier/prettier */ 
 // WARNING: This file was automatically generated by no.item.xp.codegen. You may lose your changes if you edit it.
export interface KeyFigure {
  /**
   * Tittel
   */
  title?: string;

  /**
   * Nøkkeltall
   */
  figure?: Array<string> | string;

  /**
   * Vis i kolonner
   */
  columns: boolean;

  /**
   * Kilde
   */
  source?: {
    /**
     * Tittel
     */
    title?: string;

    /**
     * URL
     */
    url?: string;
  };
}