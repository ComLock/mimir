/* eslint-disable prettier/prettier */ 
 // WARNING: This file was automatically generated by no.item.xp.codegen. You may lose your changes if you edit it.
export interface Accordion {
  /**
   * Trekkspill
   */
  accordions: Array<{
    /**
     * Tekst til åpne-knapp
     */
    open?: string;

    /**
     * Innhold
     */
    body?: string;

    /**
     * Underpunkt
     */
    items?: Array<{
      /**
       * Tekst til åpneknapp
       */
      title?: string;

      /**
       * Brødtekst
       */
      body?: string;
    }>;
  }>;

  /**
   * GraphQL name. Also used for separating unions in TypeScript
   */
  __typename?: "mimir_Accordion_Data";
}
