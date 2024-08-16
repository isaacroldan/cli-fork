import {FunctionRunFromRunner, SystemMessage, setupExtensionWatcherForReplay} from './hooks/setup-extension-watcher-for-replay.js'
import {FunctionRunData} from '../../replay.js'
import {ExtensionInstance} from '../../../../models/extensions/extension-instance.js'
import {FunctionConfigType} from '../../../../models/extensions/specifications/function.js'
import {AppInterface} from '../../../../models/app/app.js'
import {prettyPrintJsonIfPossible} from '../../../app-logs/utils.js'
import figures from '@shopify/cli-kit/node/figures'
import {AbortController} from '@shopify/cli-kit/node/abort'
import React, {FunctionComponent} from 'react'
import {Box, Text, Static} from '@shopify/cli-kit/node/ink'

export interface ReplayProps {
  selectedRun: FunctionRunData
  abortController: AbortController
  app: AppInterface
  extension: ExtensionInstance<FunctionConfigType>
}

type ReplayLog = FunctionRunFromRunner | SystemMessage

const Replay: FunctionComponent<ReplayProps> = ({selectedRun, abortController, app, extension}) => {
  const {logs, isAborted, canUseShortcuts, statusMessage, recentFunctionRuns, error} = setupExtensionWatcherForReplay({
    selectedRun,
    abortController,
    app,
    extension,
  })

  return (
    <>
      {/* Scrolling upper section */}
      <Static items={logs}>
        {(log, index) => {
          return (
            <Box key={`replayOutputScrollerLog${index}`} flexDirection="column">
              <ReplayLog log={log} />
            </Box>
          )
        }}
      </Static>
      {/* Bottom Bar */}
      {/* eslint-disable-next-line no-negated-condition */}
      {!isAborted ? (
        <Box
          marginY={1}
          paddingTop={1}
          flexDirection="column"
          flexGrow={1}
          borderStyle="single"
          borderBottom={false}
          borderLeft={false}
          borderRight={false}
          borderTop
        >
          {canUseShortcuts ? (
            <Box flexDirection="column">
              <Box flexDirection="row">
                <Text>
                  {figures.pointerSmall} {statusMessage}
                </Text>
              </Box>
              <StatsDisplay recentFunctionRuns={recentFunctionRuns} />
              <Text>
                {figures.pointerSmall} Press <Text bold>q</Text> {figures.lineVertical} quit
              </Text>
            </Box>
          ) : null}
          {error ? <Text color="red">{error}</Text> : null}
        </Box>
      ) : null}
    </>
  )
}

function InputDisplay({input}: {input: string}) {
  return (
    <Box flexDirection="column">
      <Text color="black" backgroundColor="yellow">
        {'\n\n            Input            \n'}
      </Text>
      <Text>{prettyPrintJsonIfPossible(input)}</Text>
    </Box>
  )
}

function LogDisplay({logs}: {logs: string}) {
  return (
    <Box flexDirection="column">
      <Text color="black" backgroundColor="blueBright">
        {'\n\n            Logs            \n'}
      </Text>
      <Text>{logs}</Text>
    </Box>
  )
}

function OutputDisplay({output}: {output: string}) {
  return (
    <Box flexDirection="column">
      <Text color="black" backgroundColor="greenBright">
        {'\n\n           Output           \n'}
      </Text>
      <Text>{prettyPrintJsonIfPossible(output)}</Text>
    </Box>
  )
}

function BenchmarkDisplay({functionRun}: {functionRun: FunctionRunFromRunner}) {
  return (
    <Box flexDirection="column">
      <Text color="black" backgroundColor="green">
        {'\n\n     Benchmark Results      \n'}
      </Text>
      <Text>Name: {functionRun.name}</Text>
      <Text>Linear Memory Usage: {functionRun.memory_usage}KB</Text>
      <Text>Instructions: {functionRun.instructions / 1000}K</Text>
      <Text>Size: {functionRun.size}KB</Text>
    </Box>
  )
}

function StatsDisplay({recentFunctionRuns}: {recentFunctionRuns: [FunctionRunFromRunner, FunctionRunFromRunner]}) {
  const delta = recentFunctionRuns[0].instructions - recentFunctionRuns[1].instructions
  return (
    <Box flexDirection="column">
      <Text>
        {figures.pointerSmall} Instruction count delta: {delta}
      </Text>
    </Box>
  )
}

function ReplayLog({log}: {log: ReplayLog}) {
  if (log.type === 'functionRun') {
    return (
      <Box flexDirection="column">
        <InputDisplay input={log.input} />
        <LogDisplay logs={log.logs} />
        <OutputDisplay output={log.output} />
        <BenchmarkDisplay functionRun={log} />
      </Box>
    )
  }

  if (log.type === 'systemMessage') {
    return <Text>{log.message}</Text>
  }

  return null
}

export {Replay}
