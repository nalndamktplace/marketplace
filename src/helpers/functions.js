export const isFilled = param => param !== undefined && param !== null && param.length>0
export const isUsable = param => param !== undefined && param !== null
export const isNull = param => param !== undefined && param === null
export const isUndefined = param => param === undefined