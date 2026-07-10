/**
 * OpenTelemetry APM Configuration
 * Application Performance Monitoring for Lumina Overmind Dashboard
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// Initialize OpenTelemetry SDK
export function initializeAPM() {
  // Only initialize in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_APM !== 'true') {
    console.log('APM disabled in development mode');
    return;
  }

  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'lumina-overmind-dashboard',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    })
  );

  const otlpExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter: otlpExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable specific instrumentations if needed
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });

  try {
    sdk.start();
    console.log('OpenTelemetry APM initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry APM:', error);
  }

  return sdk;
}

// Export a singleton instance
let apmInstance: NodeSDK | null = null;

export function getAPMInstance(): NodeSDK | null {
  if (!apmInstance) {
    apmInstance = initializeAPM() || null;
  }
  return apmInstance;
}

// Shutdown APM gracefully
export async function shutdownAPM() {
  if (apmInstance) {
    await apmInstance.shutdown();
    console.log('OpenTelemetry APM shutdown complete');
    apmInstance = null;
  }
}
