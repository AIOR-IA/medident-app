/**
 * Remove blank spaces
 *
 * @param text
 */
function removeBlankSpaces(text: string): string {
  return text.replace(/\s/g, '');
}

/**
 * shorten blank spaces just between words
 *
 * @param text
 */
function shortenBlankSpaces(text: string): string {
  return text.replace(/\s+/g, ' ');
}

const validationPatternNames = "[A-Za-z'ñÑáéíóúÁÉÍÓÚ ]*";

const validationPatternEmail = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

const validationPatternPassword = "^(?=.*[A-Z]).{6,10}$";

export {
  removeBlankSpaces,
  shortenBlankSpaces,
  validationPatternNames,
  validationPatternEmail,
  validationPatternPassword,

};
