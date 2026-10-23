const plugin = require('@unocss/eslint-plugin').default
const mod = require.cache[require.resolve('@unocss/eslint-plugin')]
if (mod) {
  mod.exports.rules = plugin.rules
  mod.exports.configs = plugin.configs
}
