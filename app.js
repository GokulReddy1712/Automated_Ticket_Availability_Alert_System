require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

async function checkUrl() {
  let options = new chrome.Options();
  // Remove the headless mode to see the browser window
  // options.addArguments('headless'); 

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const originalUrl = 'https://in.bookmyshow.com/buytickets/pvr-vr-chennai-anna-nagar/cinema-chen-PCAN-MT/20240801';

  try {
    await driver.get(originalUrl);

    // Wait for a longer time to allow for redirection
    await driver.sleep(1000); // Wait 15 seconds (adjust as needed)

    // Get the current URL after redirection
    let finalUrl = await driver.getCurrentUrl();

    let title = await driver.getTitle();

    if (finalUrl === originalUrl) {
      console.log('URL is live and not redirected. Page title is:', title);
      setTimeout((checkUrl),60000)
    } else {
      console.log('URL has been redirected.');
      console.log('Original URL:', originalUrl);
      console.log('Redirected URL:', finalUrl);
      console.log('Page title of redirected URL:', title);
      client.messages.create({
        body: 'Bookings Opened...',
        to: '+919940552783',
        from: '+14066254491'
      })
      .then(message => console.log(message.sid))
      .catch(error => console.error(error));
      

    }
  } catch (error) {
    console.log('URL check failed:', error.message);
  } finally {
    await driver.quit();
  }
};

checkUrl();
