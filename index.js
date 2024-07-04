// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium, firefox } = require("playwright");
const fs = require('fs');

async function sortHackerNewsArticles(browserType) {
  // launch the browser
  const browser = await browserType.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  
  // Waiting for articles to load
  await page.waitForSelector('.athing')


  // Extract all timestamps for the first 100 articles
  let allTimeStamps = []
  
  // Loop until we have required Number of articles
  for(i = 0; i < 4; i++) {
    // Extracting timestamps of the loaded articles
    const timestamps = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.age'));
      return elements.map(el => el.getAttribute('title'));
    });

    // Adding new timestamps to the allTimestamps array for each loop
    allTimeStamps = allTimeStamps.concat(timestamps);

    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    const moreLink = page.locator('.morelink');
    await moreLink.click(); 
    await page.waitForSelector('.athing', { timeout: 3000 });
    
  }


  //console.log(allTimeStamps.length)
  // Limit timestamps to 100
  allTimeStamps = allTimeStamps.slice(0, 100)
  // console.log(allTimeStamps.length)
 
  // Converting alltimestamps to Date objects, so it can be compared
  const dateTimes = allTimeStamps.map(time => new Date(time));
  // console.log(dateTimes)

 // Check if the dates are sorted from newest to oldest
 let flag = true
 for (let i = 0; i < dateTimes.length - 1; i++) {
   if (dateTimes[i] < dateTimes[i + 1]) {
     // console.log("Articles are not sorted from newest to oldest.");
     flag = false;
     break;
   }
 }
 
 // console.log("Articles are sorted from newest to oldest.");
 await browser.close();
 return { browser: browserType.name(), flag, timestamps: allTimeStamps};

}

(async () => {
  const results = [];

  // Running on Chromium
  console.log("Running on chromium.....")
  const chromiumRes = await sortHackerNewsArticles(chromium);
  console.log(`Articles sorted correctly: ${chromiumRes.flag ? 'Yes' : 'NO'}`);
  results.push(chromiumRes);
  console.log('*********************************')
  // Running on Firefox
  console.log("Running on firefox.....")
  const firefoxRes = await sortHackerNewsArticles(firefox);
  console.log(`Articles sorted correctly: ${firefoxRes.sorted ? 'Yes' : 'NO'}`);
  results.push(firefoxRes);

  // Write results to json file
  fs.writeFileSync('report.json', JSON.stringify(results, null, 2));
  console.log("JSON Reports Saved!!")
  

})();
