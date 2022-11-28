import _ from 'lodash'
export const capitalize = (str) => _.capitalize(_.trim(str))

export { default as Modal } from './Modal.svelte'
export * from './tinycolor'
export * from './createPalette'
