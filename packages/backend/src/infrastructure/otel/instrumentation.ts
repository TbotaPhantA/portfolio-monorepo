import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as process from 'process';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { FastifyOtelInstrumentation } from '@fastify/otel';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const metricReader = new PrometheusExporter({
  port: 5556,
});

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const spanProcessor = new BatchSpanProcessor(traceExporter);

export const otelSDK: NodeSDK = new NodeSDK({
  metricReader,
  spanProcessor: spanProcessor,
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pino': {
        logHook: (_span, logRecord) => {
          logRecord[ATTR_SERVICE_NAME] =
            process.env.OTEL_SERVICE_NAME || 'unknown-service';
        },
      },
    }),
    new FastifyOtelInstrumentation({
      registerOnInitialization: true,
    }),
  ],
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
    ],
  }),
});

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
