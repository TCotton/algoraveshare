import * as NodeSdk from '@effect/opentelemetry/NodeSdk'
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'

export const TracingConsole = NodeSdk.layer(() => ({
  resource: { serviceName: 'example' },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))
