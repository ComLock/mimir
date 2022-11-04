// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface Header {
  /**
   * Meny
   */
  menuContentId: string;

  /**
   * Topp lenker i meny
   */
  globalLinks?: Array<{
    /**
     * Lenketittel
     */
    linkTitle: string;

    /**
     * Lenkemål
     */
    urlSrc?:
      | {
          /**
           * Selected
           */
          _selected: "manual";

          /**
           * Url lenke
           */
          manual: {
            /**
             * Kildelenke
             */
            url?: string;
          };
        }
      | {
          /**
           * Selected
           */
          _selected: "content";

          /**
           * Lenke til internt innhold
           */
          content: {
            /**
             * Relatert innhold
             */
            contentId?: string;
          };
        };
  }>;

  /**
   * Landingsside for søk
   */
  searchResultPage?:
    | {
        /**
         * Selected
         */
        _selected: "manual";

        /**
         * Url lenke
         */
        manual: {
          /**
           * Kildelenke
           */
          url?: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "content";

        /**
         * Lenke til internt innhold
         */
        content: {
          /**
           * Relatert innhold
           */
          contentId?: string;
        };
      };
}
