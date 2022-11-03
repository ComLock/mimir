// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface LinksPartConfig {
  /**
   * Lenke type
   */
  linkTypes?:
    | {
        /**
         * Selected
         */
        _selected: 'tableLink'

        /**
         * Tabell lenke
         */
        tableLink: {
          /**
           * Tittel
           */
          title?: string

          /**
           * Lenketekst
           */
          description?: string

          /**
           * Url
           */
          url?: string

          /**
           * Relatert innhold
           */
          relatedContent?: string
        }
      }
    | {
        /**
         * Selected
         */
        _selected: 'headerLink'

        /**
         * Uthevet lenke
         */
        headerLink: {
          /**
           * Lenketekst
           */
          linkText?: string

          /**
           * URL
           */
          headerLinkHref?: string

          /**
           * Innhold
           */
          linkedContent?: string
        }
      }
    | {
        /**
         * Selected
         */
        _selected: 'profiledLink'

        /**
         * Profilert lenke
         */
        profiledLink: {
          /**
           * Lenketekst
           */
          text?: string

          /**
           * Med ikon
           */
          withIcon: boolean

          /**
           * URL
           */
          profiledLinkHref?: string

          /**
           * Innhold
           */
          contentUrl?: string
        }
      }
}
