# Project 7: NASA API - Space Explorer App
NASA releases a new "Astronomy Picture of the Day" (APOD) every day—spotlighting breathtaking images of galaxies, stars, planets, and more.

Your task is to build an interactive web app that fetches and displays these photos using [NASA's API](https://api.nasa.gov/). Users will pick a date range and instantly view stunning photos from across the cosmos, along with titles and descriptions.

You'll get to use your skills to build something that's actually connected to real-world data from one of the most iconic organizations in the world.

## Starter Files
- The provided files include a NASA logo, date inputs, a button, a placeholder for your gallery, and basic layout and styling to help you get started.
- It also includes built-in logic (in `dateRange.js`) to handle the valid APOD date range—from June 16, 1995 to today. No need to modify it.
- All your custom JavaScript should go in `script.js`. That's where you'll write the code that fetches data and displays your gallery.

## Using the Space Explorer
- Choose a start and end date, then select **Get Space Images**. The app fetches APOD entries for that range and shows a loading message while NASA responds.
- Select a gallery card to see the larger image, full title, date, and explanation. Press Escape, select the close button, or click the dark backdrop to close the details.
- The NASA API's public `DEMO_KEY` is used by default. It has lower request limits than a personal key. To use your own key, set `window.NASA_API_KEY` before `js/script.js` loads; keep personal keys out of committed source files.
- APOD ranges are limited to 1,000 days per request. Video entries show a preview when NASA provides one and link to the video from the details view.
