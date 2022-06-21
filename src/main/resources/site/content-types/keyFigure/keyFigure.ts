// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface KeyFigure {
  /**
   * Datakilde
   */
  dataSource?:
    | {
        /**
         * Selected
         */
        _selected: "tbprocessor";

        /**
         * Tall fra tabellbygger
         */
        tbprocessor: {
          /**
           * URL eller TBML-id
           */
          urlOrId?: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "statbankApi";

        /**
         * Api-spørring mot statistikkbanken
         */
        statbankApi: {
          /**
           * URL eller tabell-id
           */
          urlOrId?: string;

          /**
           * API-spørring mot statistikkbanken (JSON-format)
           */
          json?: string;

          /**
           * Navn på x-akse dimensjon
           */
          xAxisLabel?: string;

          /**
           * Navn på y-akse dimensjon
           */
          yAxisLabel?: string;

          /**
           * Filtrering på dataset
           */
          datasetFilterOptions?:
            | {
                /**
                 * Selected
                 */
                _selected: "municipalityFilter";

                /**
                 * Filtrer på kommune
                 */
                municipalityFilter: {
                  /**
                   * Hvilken dimensjon skal filtreres på kommunenummer
                   */
                  municipalityDimension: string;
                };
              };
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "statbankSaved";

        /**
         * Lagrede spørringer mot statistikkbanken
         */
        statbankSaved: {
          /**
           * URL eller tabell-id
           */
          urlOrId?: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "htmlTable";

        /**
         * HTML tabell
         */
        htmlTable: {
          /**
           * Kildetabell limt inn fra Excel
           */
          html?: string;

          /**
           * Fotnote-tekst
           */
          footnoteText?: Array<string>;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "dataset";

        /**
         * (Ikke i bruk) Ferdige dataset
         */
        dataset: {
          /**
           * ID
           */
          id?: string;

          /**
           * Format
           */
          format: "json" | "csv";
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "klass";

        /**
         * Klass
         */
        klass: {
          /**
           * URL
           */
          urlOrId?: string;
        };
      };

  /**
   * Manuell verdi
   */
  manualSource?: string;

  /**
   * Benevning
   */
  denomination?: string;

  /**
   * Størrelse
   */
  size?: "small" | "medium" | "large";

  /**
   * Endringstall
   */
  changes?: {
    /**
     * Benevning på endringstall
     */
    denomination?: string;
  };

  /**
   * Vis som grønn boks
   */
  greenBox: boolean;

  /**
   * Ordforklaring
   */
  glossaryText?: string;

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

  /**
   * Ikon
   */
  icon?: string;

  /**
   * Standardverdi
   */
  default?: string;
}
