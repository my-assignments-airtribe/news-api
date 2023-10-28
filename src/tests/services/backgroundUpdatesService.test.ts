import cron, { ScheduleOptions, ScheduledTask } from 'node-cron';
import User from '../../models/User';
import { startBackgroundUpdates } from '../../services/backgroundUpdatesService';
import { fetchNews } from '../../services/fetchNewsService';
import { setCache } from '../../services/cacheServie';

jest.mock('node-cron');
jest.mock('../../models/User');
jest.mock('../../services/fetchNewsService');
jest.mock('../../services/cacheServie');

describe('startBackgroundUpdates', () => {
  let cronScheduleMock: jest.MockedFunction<typeof cron.schedule>;
  let scheduledTask: ScheduledTask;
  beforeEach(() => {
    jest.clearAllMocks();
    cronScheduleMock = jest.fn() as jest.MockedFunction<typeof cron.schedule>;
    scheduledTask = { start: jest.fn(), stop: jest.fn(), destroy: jest.fn(), getStatus: jest.fn() } as unknown as ScheduledTask;
    cronScheduleMock.mockReturnValueOnce(scheduledTask);
    cron.schedule = cronScheduleMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule a cron job to run every 5 minutes', () => {
    startBackgroundUpdates();

    expect(cron.schedule).toBeCalledTimes(1);
  });

  it('should fetch news articles for each user and update the cache', async () => {
    const user1 = { _id: 'user1', preferences: {  category: ['business'] } };
    const user2 = { _id: 'user2', preferences: {  category: ['technology'] } };
    (User.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue([user1, user2]),
    }));

    const articles1 = [{ title: 'Article 1', url: 'https://example.com/article1' }];
    const articles2 = [{ title: 'Article 2', url: 'https://example.com/article2' }];
    (fetchNews as jest.Mock).mockResolvedValueOnce(articles1).mockResolvedValueOnce(articles2);
    
    startBackgroundUpdates();
    await ( (cronScheduleMock.mock.calls[0][1] as jest.MockedFunction<() => Promise<void>>))(); // Call the cron job function

    expect(fetchNews).toHaveBeenCalledWith(user1);
    expect(fetchNews).toHaveBeenCalledWith(user2);
    expect(setCache).toHaveBeenCalledWith('news-user1', articles1, 3600);
    expect(setCache).toHaveBeenCalledWith('news-user2', articles2, 3600);
  });

  it('should handle errors when fetching news articles', async () => {
    (User.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValueOnce([{ _id: 'user1', preferences: { category: ['business'] } }]),
    }));
    (fetchNews as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch news articles'));
    console.error = jest.fn();
    startBackgroundUpdates();
    await ((cronScheduleMock.mock.calls[0][1] as jest.MockedFunction<() => Promise<void>>))();
    expect(console.error).toHaveBeenCalledWith('Error updating cached news articles:', expect.any(Error));
  });

  it('should not update the cache if there are no users', async () => {
    (User.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValueOnce([]),
    }));
    startBackgroundUpdates();
    await ((cronScheduleMock.mock.calls[0][1] as jest.MockedFunction<() => Promise<void>>))(); // Call the cron job function

    expect(fetchNews).not.toHaveBeenCalled();
    expect(setCache).not.toHaveBeenCalled();
  });
});