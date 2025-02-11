import {DevContextOptions, ensureDevContext} from './context.js'
import {renderLogs} from './app-logs/logs-command/ui.js'
import {subscribeToAppLogs, sourcesForApp} from './app-logs/utils.js'
import {renderJsonLogs} from './app-logs/logs-command/render-json-logs.js'
import {AppInterface} from '../models/app/app.js'
import {loadAppConfiguration} from '../models/app/loader.js'
import {selectDeveloperPlatformClient, DeveloperPlatformClient} from '../utilities/developer-platform-client.js'
import {AbortError} from '@shopify/cli-kit/node/error'
import {consoleLog} from '@shopify/cli-kit/node/output'

export type Format = 'json' | 'text'

interface LogsOptions {
  directory: string
  reset: boolean
  apiKey?: string
  storeFqdn?: string
  sources?: string[]
  status?: string
  configName?: string
  userProvidedConfigName?: string
  format: Format
}

export async function logs(commandOptions: LogsOptions) {
  const logsConfig = await prepareForLogs(commandOptions)

  const validSources = sourcesForApp(logsConfig.localApp)

  if (validSources.length === 0) {
    throw new AbortError(
      `This app has no log sources. Learn more about app logs at https://shopify.dev/docs/api/shopify-cli/app/app-logs`,
    )
  }

  if (commandOptions.sources) {
    const invalidSources = commandOptions.sources.filter((source) => !validSources.includes(source))
    if (invalidSources.length) {
      throw new AbortError(
        `Invalid sources: ${invalidSources.join(', ')}. Valid sources are: ${validSources.join(', ')}`,
      )
    }
  }

  const variables = {
    shopIds: [logsConfig.storeId],
    apiKey: logsConfig.apiKey,
    token: '',
  }

  const jwtToken = await subscribeToAppLogs(logsConfig.developerPlatformClient, variables)

  const filters = {
    status: commandOptions.status,
    sources: commandOptions.sources,
  }

  const pollOptions = {
    jwtToken,
    filters,
  }

  if (commandOptions.format === 'json') {
    consoleLog(JSON.stringify({message: 'Waiting for app logs...'}))
    await renderJsonLogs({
      options: {
        variables,
        developerPlatformClient: logsConfig.developerPlatformClient,
      },
      pollOptions,
    })
  } else {
    consoleLog('Waiting for app logs...\n')
    await renderLogs({
      options: {
        variables,
        developerPlatformClient: logsConfig.developerPlatformClient,
      },
      pollOptions,
    })
  }
}

async function prepareForLogs(commandOptions: LogsOptions): Promise<{
  storeId: string
  developerPlatformClient: DeveloperPlatformClient
  apiKey: string
  localApp: AppInterface
}> {
  const {configuration} = await loadAppConfiguration({
    ...commandOptions,
    userProvidedConfigName: commandOptions.configName,
  })
  let developerPlatformClient = selectDeveloperPlatformClient({configuration})
  const devContextOptions: DevContextOptions = {...commandOptions, developerPlatformClient}
  const {storeId, remoteApp, localApp} = await ensureDevContext(devContextOptions)

  developerPlatformClient = remoteApp.developerPlatformClient ?? developerPlatformClient

  const apiKey = remoteApp.apiKey

  return {
    storeId,
    developerPlatformClient,
    apiKey,
    localApp,
  }
}
