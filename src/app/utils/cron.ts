import cron from 'node-cron';
import { MusulliService } from '../module/musulli/musulli.service';

export const initCronJobs = () => {
  console.log('Initializing cron jobs...');

  // Run at 00:00 on the 1st day of every month
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running monthly payment creation job...');
    try {
      const now = new Date();
      const billingMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const results = await MusulliService.createMonthlyPaymentsForAllMusullis(billingMonth);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      console.log(`Monthly payment creation job completed! Success: ${successCount}, Failed: ${failCount}`);
    } catch (error) {
      console.error('Error running monthly payment creation job:', error);
    }
  });

  console.log('Cron jobs initialized!');
};
