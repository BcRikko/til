import base from 'eslint-config-bcrikko'

/**
 * @type {import('eslint').Linter.Config}
 */
const config = [
  ...base,
  {
    ignores: ['dist', '.astro'],
  },
]

export default config
