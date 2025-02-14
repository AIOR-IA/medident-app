import { ColorType } from "../enums/color.type.enum";
import { RoleType } from "../enums/roleUser.type.enum";

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

const validationPatternPassword = "^(?=.*[A-Z])[a-zA-ZñÑ0-9]{6,10}$";

const ValidationPhone= "^[0-9]{8}$";
const ValidationAge = "^[0-9]{1,2}$";
const ValidationAmount = "^-?[0-9]{1,4}$";
const TypeRole = [
  {display: 'Administrador', value: RoleType.ADMIN},
  {display: 'Usuario', value: RoleType.USER},
];

const ColorsType = [
  {display: 'Rojo', value: ColorType.ROJO},
  {display: 'Azul', value: ColorType.AZUL},
  {display: 'Verde', value: ColorType.VERDE},
  {display: 'Amarillo', value: ColorType.AMARILLO},
  {display: 'Naranja', value: ColorType.NARANJA},
  {display: 'Rosa', value: ColorType.ROSA},
  {display: 'Morado', value: ColorType.MORADO},
  {display: 'Turquesa', value: ColorType.TURQUESA},
  {display: 'Celeste', value: ColorType.CELESTE},
  {display: 'Lima', value: ColorType.LIMA},
  {display: 'Dorado', value: ColorType.DORADO},
  {display: 'Salmon', value: ColorType.SALMON},
  {display: 'Lavanda', value: ColorType.LAVANDA},
  {display: 'Coral', value: ColorType.CORAL},
  {display: 'Durazno', value: ColorType.DURAZNO},
];
export {
  removeBlankSpaces,
  shortenBlankSpaces,
  validationPatternNames,
  validationPatternEmail,
  validationPatternPassword,
  TypeRole,
  ColorsType,
  ValidationPhone,
  ValidationAge,
  ValidationAmount,
};
