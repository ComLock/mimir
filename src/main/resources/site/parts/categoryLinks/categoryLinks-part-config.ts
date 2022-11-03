// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface CategoryLinksPartConfig {
  /**
   * Kort
   */
  CategoryLinkItemSet?: Array<{
    /**
     * Lenketittel
     */
    titleText: string

    /**
     * Forklaringstekst
     */
    subText: string

    /**
     * Lenkemål
     */
    href: string
  }>

  /**
   * Metode og Dokumentasjon
   */
  methodsDocumentation?:
    | {
        /**
         * Selected
         */
        _selected: 'urlSource'

        /**
         * Url
         */
        urlSource: {
          /**
           * Url
           */
          url: string
        }
      }
    | {
        /**
         * Selected
         */
        _selected: 'relatedSource'

        /**
         * Innhold XP
         */
        relatedSource: {
          /**
           * Lenkemål
           */
          content?: string
        }
      }
}
