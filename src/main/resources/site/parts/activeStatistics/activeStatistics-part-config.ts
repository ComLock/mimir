// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface ActiveStatisticsPartConfig {

  relatedStatisticsOptions?: Array<
    | {
        /**
         * Selected
         */
        _selected: "xp";

        /**
         * Statistikk fra XP
         */
        xp: {
          /**
           * Statistikk
           */
          contentId?: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "cms";

        /**
         * Statistikk fra 4.7
         */
        cms: {
          /**
           * Tittel
           */
          title: string;

          /**
           * Profileringstekst
           */
          profiledText: string;

          /**
           * URL
           */
          url: string;
        };
      }
  >;
}
