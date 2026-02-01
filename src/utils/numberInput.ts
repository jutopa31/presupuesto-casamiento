interface NormalizeNumberInputOptions {
  allowDecimal?: boolean
}

export function normalizeNumberInput(
  raw: string,
  { allowDecimal = false }: NormalizeNumberInputOptions = {},
) {
  if (raw === '') return ''

  // Keep "0." / "0," for decimals, otherwise drop leading zeros.
  if (allowDecimal && /^0[.,]/.test(raw)) {
    return raw
  }

  return raw.replace(/^0+(?=\d)/, '')
}
