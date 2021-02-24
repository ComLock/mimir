export interface ExternalCardPartConfig {
  /**
   * Ekstern card
   */
  externalCards: Array<{
    /**
     * Bilde
     */
    image: string;

    /**
     * Tekst
     */
    content: string;

    /**
     * Lenke tekst
     */
    linkText: string;

    /**
     * Lenke url
     */
    linkUrl: string;
  }>;
}
