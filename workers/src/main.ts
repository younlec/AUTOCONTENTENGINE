import 'dotenv/config';
import { logger } from './lib/logger';
import { TrendDiscoveryWorker } from './processors/trend-discovery.worker';
import { ContentGenerationWorker } from './processors/content-generation.worker';
import { VideoCreationWorker } from './processors/video-creation.worker';
import { PostPublishingWorker } from './processors/post-publishing.worker';
import { AnalyticsSyncWorker } from './processors/analytics-sync.worker';
import { TrendScheduler } from './schedulers/trend-scheduler';

async function bootstrap() {
  logger.info('Starting AutoContent Engine Workers...');

  const trendDiscovery = new TrendDiscoveryWorker();
  const contentGeneration = new ContentGenerationWorker();
  const videoCreation = new VideoCreationWorker();
  const postPublishing = new PostPublishingWorker();
  const analyticsSync = new AnalyticsSyncWorker();
  const trendScheduler = new TrendScheduler();

  await Promise.all([
    trendDiscovery.start(),
    contentGeneration.start(),
    videoCreation.start(),
    postPublishing.start(),
    analyticsSync.start(),
    trendScheduler.start(),
  ]);

  logger.info('All workers started successfully');

  const shutdown = async () => {
    logger.info('Shutting down workers...');
    await Promise.all([
      trendDiscovery.stop(),
      contentGeneration.stop(),
      videoCreation.stop(),
      postPublishing.stop(),
      analyticsSync.stop(),
      trendScheduler.stop(),
    ]);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  logger.error('Failed to start workers', err);
  process.exit(1);
});
