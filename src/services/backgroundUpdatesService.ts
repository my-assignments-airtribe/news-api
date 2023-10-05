import cron from 'node-cron';
import User from '../models/User';
import { fetchNews } from './fetchNewsService';
import { setCache } from './cacheServie';

export const startBackgroundUpdates = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const users = await User.find().select('preferences');

      for (const user of users) {
        const cacheKey = 'news-' + user._id;

        // Fetch news data from an external API (e.g., News API)
        const articles = await fetchNews(user);

        // Update the cache with fresh news articles
        setCache(cacheKey, articles, 3600); // Cache for 1 hour
      }

      console.log('Cached news articles updated.');
    } catch (error) {
      console.error('Error updating cached news articles:', error);
    }
  });

  // setInterval(async () => {
  //   try {
  //     const users = await User.find().select('preferences');

  //     for (const user of users) {
  //       const cacheKey = 'news-' + user._id;

  //       // Fetch news data from an external API (e.g., News API)
  //       const articles = await fetchNews(user);

  //       // Update the cache with fresh news articles
  //       setCache(cacheKey, articles, 3600); // Cache for 1 hour
  //     }

  //     console.log('Cached news articles updated.');
  //   } catch (error) {
  //     console.error('Error updating cached news articles:', error);
  //   }
  // }
  // , 300000); // 5 minutes

};