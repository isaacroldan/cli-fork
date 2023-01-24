import {output} from '@shopify/cli-kit'
import {Key, renderConcurrent} from '@shopify/cli-kit/node/ui'
import {getAvailableTCPPort} from '@shopify/cli-kit/node/tcp'
import {AbortController, AbortSignal} from '@shopify/cli-kit/node/abort'
import {openURL} from '@shopify/cli-kit/node/system'
import {Writable} from 'stream'
import * as http from 'http'

export interface ReverseHTTPProxyTarget {
  /** The prefix to include in the logs
   *   [vite] Output coming from Vite
   */
  logPrefix: string

  /**
   * The HTTP path prefix used to match against request and determine if the traffic should be
   * forwarded to this target
   */
  pathPrefix?: string
  /**
   * A callback to invoke the process. stdout and stderr should be used
   * to send standard output and error data that gets formatted with the
   * right prefix.
   */
  action: (stdout: Writable, stderr: Writable, signal: AbortSignal, port: number) => Promise<void> | void
}

interface Options {
  previewUrl: string | undefined
  portNumber: number | undefined
  proxyTargets: ReverseHTTPProxyTarget[]
  additionalProcesses: output.OutputProcess[]
}

/**
 * A convenient function that runs an HTTP server and does path-based traffic forwarding to sub-processes that run
 * an HTTP server. The method assigns a random port to each of the processes.
 * @param tunnelUrl - The URL of the tunnel.
 * @param portNumber - The port to use for the proxy HTTP server. When undefined, a random port is automatically assigned.
 * @param proxyTargets - List of target processes to forward traffic to.
 * @param additionalProcesses - Additional processes to run. The proxy won't forward traffic to these processes.
 * @returns A promise that resolves with an interface to get the port of the proxy and stop it.
 */
export async function runConcurrentHTTPProcessesAndPathForwardTraffic({
  previewUrl,
  portNumber,
  proxyTargets,
  additionalProcesses,
}: Options): Promise<void> {
  // Lazy-importing it because it's CJS and we don't want it
  // to block the loading of the ESM module graph.
  const {default: httpProxy} = await import('http-proxy')

  const rules: {[key: string]: string} = {}

  const processes = await Promise.all(
    proxyTargets.map(async (target): Promise<output.OutputProcess> => {
      const targetPort = await getAvailableTCPPort()
      rules[target.pathPrefix ?? '/'] = `http://localhost:${targetPort}`
      return {
        prefix: target.logPrefix,
        action: async (stdout, stderr, signal) => {
          await target.action(stdout, stderr, signal, targetPort)
        },
      }
    }),
  )

  const availablePort = portNumber ?? (await getAvailableTCPPort())

  output.debug(output.content`
Starting reverse HTTP proxy on port ${output.token.raw(availablePort.toString())}
Routing traffic rules:
${output.token.json(JSON.stringify(rules))}
`)

  const proxy = httpProxy.createProxy()
  const server = http.createServer(function (req, res) {
    const target = match(rules, req)
    if (target) return proxy.web(req, res, {target})

    output.debug(`
Reverse HTTP proxy error - Invalid path: ${req.url}
These are the allowed paths:
${output.token.json(JSON.stringify(rules))}
`)

    res.statusCode = 500
    res.end(`Invalid path ${req.url}`)
  })

  // Capture websocket requests and forward them to the proxy
  server.on('upgrade', function (req, socket, head) {
    const target = match(rules, req)
    if (target) return proxy.ws(req, socket, head, {target})
    socket.destroy()
  })

  const abortController = new AbortController()
  abortController.signal.addEventListener('abort', () => {
    server.close()
  })

  await Promise.all([
    renderConcurrent({
      processes: [...processes, ...additionalProcesses],
      abortController,
      onInput(input: string, key: Key) {
        if (key.return && previewUrl) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          openURL(previewUrl)
        } else if (input === 'q') {
          process.exit(0)
        }
      },
      stickyMessage: "Press 'Enter' to open your browser.\nPress q to quit.",
    }),
    server.listen(availablePort),
  ])
}

function match(rules: {[key: string]: string}, req: http.IncomingMessage) {
  const path: string = req.url ?? '/'

  for (const pathPrefix in rules) {
    if (path.startsWith(pathPrefix)) return rules[pathPrefix]
  }

  return undefined
}
