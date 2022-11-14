/* eslint-disable prettier/prettier */ 
 // WARNING: This file was automatically generated by no.item.xp.codegen. You may lose your changes if you edit it.
export interface Highchart {
  /**
   * Undertittel
   */
  subtitle?: string;

  /**
   * Graftype
   */
  graphType: 'line' | 'pie' | 'column' | 'bar' | 'area' | 'barNegative';

  /**
   * Datakilde
   */
  dataSource?:
    | {
        /**
         * Selected
         */
        _selected: 'tbprocessor';

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
        _selected: 'statbankApi';

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
                _selected: 'municipalityFilter';

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
        _selected: 'statbankSaved';

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
        _selected: 'htmlTable';

        /**
         * Excel (Kun på innholdstype Tabell)
         */
        htmlTable: {
          /**
           * Kildetabell limt inn fra Excel
           */
          html?: string;

          /**
           * Fotnote-tekst
           */
          footnoteText?: Array<string> | string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: 'dataset';

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
          format: 'json' | 'csv';
        };
      }
    | {
        /**
         * Selected
         */
        _selected: 'klass';

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
   * Kildetabell limt inn fra Excel
   */
  htmlTable?: string;

  /**
   * Bytt rader og kolonner
   */
  switchRowsAndColumns: boolean;

  /**
   * Skjul tittel (gjelder kun figur til faktasider o.l.)
   */
  hideTitle: boolean;

  /**
   * Kombinere forklaringer
   */
  combineInfo: boolean;

  /**
   * Antall desimaler som skal vises på verdiene ved mouseover:
   */
  numberDecimals?: '0' | '1' | '2' | '3';

  /**
   * Stabling av verdier (for stolpe- og arealdiagram)
   */
  stacking?: 'disabled' | 'normal' | 'percent';

  /**
   * Vis stablesum
   */
  showStackedTotal: boolean;

  /**
   * Zoom i graf
   */
  zoomType?: 'null' | 'x' | 'y' | 'xy';

  /**
   * Høyde i prosent av bredde
   */
  heightAspectRatio?: string;

  /**
   * Plassering av tegnforklaring
   */
  legendAlign?: 'right' | 'center';

  /**
   * Skjul tegnforklaringen (gjelder ikke for kakediagram).
   */
  noLegend: boolean;

  /**
   * Tegnforklaring under (gjelder kun for kakediagram).
   */
  pieLegend: boolean;

  /**
   * X-akse, tittel
   */
  xAxisTitle?: string;

  /**
   * X-skala
   */
  xAxisType?: 'category' | 'linear' | 'logarithmic';

  /**
   * X-akse, minste verdi
   */
  xAxisMin?: string;

  /**
   * X-akse, største verdi
   */
  xAxisMax?: string;

  /**
   * Tickintervall (overstyring av avstand mellom verdier på x-aksen).
   */
  tickInterval?: string;

  /**
   * Skjul aksemarkører
   */
  xEnableLabel: boolean;

  /**
   * Reverser X-akse
   */
  xAxisFlip: boolean;

  /**
   * Y-akse, tittel
   */
  yAxisTitle?: string;

  /**
   * Plassering av y-aksetittel
   */
  yAxisOffset?: string;

  /**
   * Y-skala
   */
  yAxisType?: 'category' | 'linear' | 'logarithmic';

  /**
   * Y-akse, minste verdi
   */
  yAxisMin?: string;

  /**
   * Y-akse, største verdi
   */
  yAxisMax?: string;

  /**
   * Vis desimaler på Y-akseverdiene, antall:
   */
  yAxisDecimalPlaces?: '0' | '1' | '2';


  sourceList?: Array<{
    /**
     * Kildetekst
     */
    sourceText?: string;

    /**
     * Kilde-URL
     */
    sourceHref?: string;
  }>;

  /**
   * Fotnote-tekst
   */
  footnoteText?: string;

  /**
   * (IKKE BRUK) Kildetekst
   */
  creditsText?: string;

  /**
   * (IKKE BRUK) Kilde-URL
   */
  creditsHref?: string;

  /**
   * GraphQL name. Also used for separating unions in TypeScript
   */
  __typename?: "mimir_Highchart_Data";
}
