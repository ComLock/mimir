// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface Highmap {
  /**
   * Undertittel
   */
  subtitle?: string;

  /**
   * Forklaring datagrunnlag for skjermlesere
   */
  description?: string;

  /**
   * Kart fil (json format)
   */
  mapFile?: string;

  /**
   * Kartdata fra tabell (tabell limt inn fra excel)
   */
  htmlTable?: string;

  /**
   * Terskelverdi
   */
  thresholdValues: Array<string>;

  /**
   * Skjul navn i kart
   */
  hideTitle: boolean;

  /**
   * Velg fargepalett
   */
  colorPalette: "green" | "yellow";

  /**
   * Antall desimalplasser som vises
   */
  numberDecimals?: string;

  /**
   * Høyde i prosent av bredde
   */
  heightAspectRatio?: string;

  /**
   * Serietittel
   */
  seriesTitle?: string;

  /**
   * Tegnforklaring tittel
   */
  legendTitle?: string;

  /**
   * Plassering av tegnforklaring
   */
  legendAlign: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

  /**
   * Fotnote-tekst
   */
  footnoteText?: Array<string>;
}