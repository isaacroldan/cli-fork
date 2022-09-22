// https://eslint.org/docs/developer-guide/working-with-rules
const path = require('pathe')
const file = require('node:fs')

const errors = ['Abort', 'AbortSilent', 'Bug', 'BugSilent']

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This rule moves us away from the pattern of wrapping initialization of aborts in factory functions',
    },
    schema: [],
  },
  create(context) {
    return {
      ReturnStatement(node) {
        const calleeName = node.argument?.callee?.name
        const moduleName = node.argument?.callee?.object?.name
        const moduleExport = node.argument?.callee?.property?.name

        const isCLIKitError =
          errors.includes(calleeName) || // When imported from within @shopify/cli-kit
          (moduleName === 'error' && errors.includes(moduleExport)) // When importing from consumer package.

        if (isCLIKitError) {
          const filePath = context.getFilename()
          const fileUpdatedAt = file.statSync(filePath).mtime.getTime()
          const relativePath = path.relative(path.resolve(__dirname, '..'), filePath)
          const shouldFail = !shitlist[relativePath] || shitlist[relativePath] < fileUpdatedAt
          if (shouldFail) {
            context.report(
              node,
              `Factory functions returning instances of abort and bug errors are discouraged. This error arouse because either you are not following the pattern in a new module or you touched an existing one that needs migration.`,
            )
          }
        }
      },
    }
  },
}

const shitlist = {
  'packages/cli-kit/src/api/admin.ts': 1663587282910,
  'packages/app/src/cli/commands/app/generate/extension.ts': 1663666173777,
  'packages/cli-hydrogen/src/cli/services/deploy/error.ts': 1663587282907,
  'packages/cli-kit/src/environment/spin.ts': 1663079194207,
  'packages/cli-kit/src/git.ts': 1663587282914,
  'packages/app/src/cli/services/deploy.ts': 1663587282897,
  'packages/app/src/cli/services/dev/fetch.ts': 1661517194377,
  'packages/cli-kit/src/node/checksum.ts': 1661517194383,
  'packages/cli-kit/src/node/dot-env.ts': 1661517194383,
  'packages/app/src/cli/services/dev/select-store.ts': 1661412160941,
  'packages/cli-kit/src/node/node-package-manager.ts': 1663853532176,
  'packages/app/src/cli/services/environment/identifiers.ts': 1663587282903,
  'packages/app/src/cli/services/environment.ts': 1663852141256,
  'packages/cli-kit/src/session/device-authorization.ts': 1663587282919,
  'packages/cli-kit/src/session/exchange.ts': 1663587282920,
  'packages/app/src/cli/utilities/extensions/binary.ts': 1661507113211,
  'packages/app/src/cli/utilities/extensions/cli.ts': 1663079194198,
  'packages/app/src/cli/utilities/extensions/configuration.ts': 1663849331894,
  'packages/app/src/cli/utilities/extensions/fetch-product-variant.ts': 1661517194379,
  'packages/app/src/cli/utilities/extensions/locales-configuration.ts': 1661517194379,
  'packages/app/src/cli/validators/extensions/functions.ts': 1661412160944,
  'packages/app/src/cli/validators/extensions/ui.ts': 1663587282905,
  'packages/cli-kit/src/session.ts': 1663587282918,
  'packages/create-app/src/commands/init.ts': 1661412160964,
  'packages/create-app/src/services/init.ts': 1663852141271,
}
