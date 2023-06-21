import {devDraftableExtensionTarget} from './dev.js'
import {setupConfigWatcher, setupDraftableExtensionBundler, setupFunctionWatcher} from './dev/extension/bundler.js'
import {buildFunctionExtension} from './build/extension.js'
import {updateExtensionDraft} from './dev/update-extension.js'
import {testApp, testUIExtension, testFunctionExtension} from '../models/app/app.test-data.js'
import {loadLocalExtensionsSpecifications} from '../models/extensions/load-specifications.js'
import {describe, expect, test, vi} from 'vitest'
import {AbortController} from '@shopify/cli-kit/node/abort'
import {Writable} from 'node:stream'
import exp from 'node:constants'

vi.mock('./dev/extension/bundler.js')
vi.mock('./build/extension.js')
vi.mock('./dev/update-extension.js')

describe('devDraftableExtensionTarget()', () => {
  test('calls setupDraftableExtensionBundler and setupConfigWatcher on each UI extension', async () => {
    const abortController = new AbortController()
    const stdout = new Writable()
    const stderr = new Writable()
    const extension1 = await testUIExtension({
      devUUID: '1',
      directory: 'directory/path/1',
    })

    const extension2 = await testUIExtension({
      devUUID: '2',
      directory: 'directory/path/2',
    })

    const app = testApp()
    const extensions = [extension1, extension2]
    const remoteExtensions = {} as any
    remoteExtensions[extension1.localIdentifier] = 'mock-registration-id-1'
    remoteExtensions[extension2.localIdentifier] = 'mock-registration-id-2'
    const specifications = await loadLocalExtensionsSpecifications()

    const process = devDraftableExtensionTarget({
      extensions,
      app,
      url: 'mock-url',
      token: 'mock-token',
      apiKey: 'mock-api-key',
      remoteExtensions,
      specifications,
      unifiedDeployment: true,
    })

    await process.action(stdout, stderr, abortController.signal)

    extensions.forEach((ext) => {
      expect(setupDraftableExtensionBundler).toHaveBeenCalledWith({
        extension: ext,
        token: 'mock-token',
        apiKey: 'mock-api-key',
        registrationId: remoteExtensions[ext.localIdentifier],
        stdout,
        stderr,
        signal: abortController.signal,
        app,
        url: 'mock-url',
        unifiedDeployment: true,
      })

      expect(setupConfigWatcher).toHaveBeenCalledWith({
        extension: ext,
        token: 'mock-token',
        apiKey: 'mock-api-key',
        registrationId: remoteExtensions[ext.localIdentifier],
        stdout,
        stderr,
        signal: abortController.signal,
        specifications,
        unifiedDeployment: true,
      })
    })
  })

  test('builds and deploys and watches functions if unified deployment is enabled', async () => {
    const abortController = new AbortController()
    const stdout = new Writable()
    const stderr = new Writable()
    const function1 = await testFunctionExtension()
    const function2 = await testFunctionExtension()

    const app = testApp()
    const extensions = [function1, function2]
    const remoteExtensions = {} as any
    remoteExtensions[function1.localIdentifier] = 'mock-registration-id-1'
    remoteExtensions[function2.localIdentifier] = 'mock-registration-id-2'
    const specifications = await loadLocalExtensionsSpecifications()

    const process = devDraftableExtensionTarget({
      extensions,
      app,
      url: 'mock-url',
      token: 'mock-token',
      apiKey: 'mock-api-key',
      remoteExtensions,
      specifications,
      unifiedDeployment: true,
    })

    await process.action(stdout, stderr, abortController.signal)

    extensions.forEach((ext) => {
      expect(buildFunctionExtension).toHaveBeenCalledWith(ext, {
        app,
        stdout,
        stderr,
        useTasks: false,
        signal: abortController.signal,
      })

      expect(updateExtensionDraft).toHaveBeenCalledWith({
        extension: ext,
        token: 'mock-token',
        apiKey: 'mock-api-key',
        registrationId: remoteExtensions[ext.localIdentifier],
        stderr,
        unifiedDeployment: true
      })

      expect(setupConfigWatcher).toHaveBeenCalledWith({
        extension: ext,
        token: 'mock-token',
        apiKey: 'mock-api-key',
        registrationId: remoteExtensions[ext.localIdentifier],
        stdout,
        stderr,
        signal: abortController.signal,
        specifications,
        unifiedDeployment: true,
      })

      expect(setupFunctionWatcher).toHaveBeenCalledWith({
        extension: ext,
        app,
        stdout,
        stderr,
        signal: abortController.signal,
        token: 'mock-token',
        apiKey: 'mock-api-key',
        registrationId: remoteExtensions[ext.localIdentifier],
        unifiedDeployment: true,
      })
    })
  })

  test('does not build or deploy or watch functions if unified deployment is disabled', async () => {
    const abortController = new AbortController()
    const stdout = new Writable()
    const stderr = new Writable()
    const function1 = await testFunctionExtension()

    const app = testApp()
    const extensions = [function1]
    const remoteExtensions = {} as any
    remoteExtensions[function1.localIdentifier] = 'mock-registration-id-1'
    const specifications = await loadLocalExtensionsSpecifications()

    const process = devDraftableExtensionTarget({
      extensions,
      app,
      url: 'mock-url',
      token: 'mock-token',
      apiKey: 'mock-api-key',
      remoteExtensions,
      specifications,
      unifiedDeployment: false,
    })

    await process.action(stdout, stderr, abortController.signal)

    expect(buildFunctionExtension).not.toHaveBeenCalled();
    expect(updateExtensionDraft).not.toHaveBeenCalled();
    expect(setupConfigWatcher).not.toHaveBeenCalled();
    expect(setupFunctionWatcher).not.toHaveBeenCalled();
  })
})
