// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface Employee {
  /**
   * Er forsker
   */
  isResearcher: boolean;

  /**
   * Stilling
   */
  position?: string;

  /**
   * Epostadresse
   */
  email?: string;

  /**
   * Telefonnummer
   */
  phone?: string;

  /**
   * Forskningsområde eller avdeling
   */
  area?: string;

  /**
   * Kort om meg
   */
  description?: string;

  /**
   * Profilbilder
   */
  profileImages?: Array<string>;

  /**
   * Ansatt id Cristin
   */
  cristinId?: string;

  /**
   * Min CV
   */
  myCV?: string;

  /**
   * Prosjekter
   */
  projects?: Array<string>;
}