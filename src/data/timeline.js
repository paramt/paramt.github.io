import ksc1 from './images/ksc 1.jpg';
import orlando from './images/orlando.JPG';

import miamiKeys from './images/miami/IMG_4135.jpg';
import miami2Keys from './images/miami 2/IMG_3889.jpg';

import quebecCottage from './images/quebec cottage/IMG_2867.jpg';

import singapore1 from './images/singapore/IMG_2282.jpg';
import singapore2 from './images/singapore 2/IMG_2340.jpg';

import sfRace from './images/sf 10k/IMG_2143.jpg';
import sfRace2 from './images/sf 10k 2.jpeg';

import yosemite1 from './images/yosemite 1.jpg';
import yosemite3 from './images/yosemite 3/IMG_1821.jpg';
import yosemite4 from './images/yosemite 4/IMG_1768.jpg';
import yosemite5 from './images/yosemite 5.jpg';

import surfing from './images/surfing/IMG_1604.jpg';

import glean1 from './images/glean/IMG_1518.jpg';
import gleanTwinPeaks from './images/glean (twin peaks)/IMG_0897.jpg';

import expertiseAi1 from './images/expertise ai.jpg';
import expertiseAi2 from './images/expertise ai 2.jpg';

import seattle1 from './images/seattle.jpg';
import seattle2 from './images/seattle 2.jpg';

import trinidad1 from './images/trinidad 1.jpg';

import boston from './images/boston.jpg';

import nyc2026a from './images/nyc 2026 1.jpg';
import nyc2026b from './images/nyc 2026 2.jpg';

import nyc2023a from './images/nyc 2023.jpg';
import nyc2023b from './images/nyc 2023 2.jpg';
import nyc2023c from './images/nyc 2023 3.jpg';

import amanHambleton from './images/aman hambleton.jpg';
import ericHansen from './images/eric hansen.jpg';

import techcrunchDisrupt from './images/techcrunch disrupt.jpg';

import bostonHackmit from './images/boston hackmit.jpg';

import aotMusical from './images/aot musical.jpg';

import waterloo from './images/waterloo.jpg';

import thumbKsc1 from './images/ksc 1.thumb.webp';
import thumbOrlando from './images/orlando.thumb.webp';
import thumbMiamiKeys from './images/miami/IMG_4135.thumb.webp';
import thumbMiami2Keys from './images/miami 2/IMG_3889.thumb.webp';
import thumbQuebecCottage from './images/quebec cottage/IMG_2867.thumb.webp';
import thumbSingapore1 from './images/singapore/IMG_2282.thumb.webp';
import thumbSingapore2 from './images/singapore 2/IMG_2340.thumb.webp';
import thumbSfRace from './images/sf 10k/IMG_2143.thumb.webp';
import thumbSfRace2 from './images/sf 10k 2.thumb.webp';
import thumbYosemite1 from './images/yosemite 1.thumb.webp';
import thumbYosemite3 from './images/yosemite 3/IMG_1821.thumb.webp';
import thumbYosemite4 from './images/yosemite 4/IMG_1768.thumb.webp';
import thumbYosemite5 from './images/yosemite 5.thumb.webp';
import thumbSurfing from './images/surfing/IMG_1604.thumb.webp';
import thumbGlean1 from './images/glean/IMG_1518.thumb.webp';
import thumbGleanTwinPeaks from './images/glean (twin peaks)/IMG_0897.thumb.webp';
import thumbExpertiseAi1 from './images/expertise ai.thumb.webp';
import thumbExpertiseAi2 from './images/expertise ai 2.thumb.webp';
import thumbSeattle1 from './images/seattle.thumb.webp';
import thumbSeattle2 from './images/seattle 2.thumb.webp';
import thumbTrinidad1 from './images/trinidad 1.thumb.webp';
import thumbBoston from './images/boston.thumb.webp';
import thumbNyc2026a from './images/nyc 2026 1.thumb.webp';
import thumbNyc2026b from './images/nyc 2026 2.thumb.webp';

import thumbNyc2023a from './images/nyc 2023.thumb.webp';
import thumbNyc2023b from './images/nyc 2023 2.thumb.webp';
import thumbNyc2023c from './images/nyc 2023 3.thumb.webp';
import thumbAmanHambleton from './images/aman hambleton.thumb.webp';
import thumbEricHansen from './images/eric hansen.thumb.webp';
import thumbTechcrunchDisrupt from './images/techcrunch disrupt.thumb.webp';
import thumbBostonHackmit from './images/boston hackmit.thumb.webp';
import thumbAotMusical from './images/aot musical.thumb.webp';
import thumbWaterloo from './images/waterloo.thumb.webp';

import skydiving1 from './images/skydiving 1.jpg';
import skydiving2 from './images/skydiving 2.jpg';
import skydiving3 from './images/skydiving 3.jpg';
import thumbSkydiving1 from './images/skydiving 1.thumb.webp';
import thumbSkydiving2 from './images/skydiving 2.thumb.webp';
import thumbSkydiving3 from './images/skydiving 3.thumb.webp';

import india1 from './images/india 1.jpg';
import india2 from './images/india 2.jpg';
import thumbIndia1 from './images/india 1.thumb.webp';
import thumbIndia2 from './images/india 2.thumb.webp';

import sfDatacurve1 from './images/sf (datacurve).jpg';
import sfDatacurve2 from './images/sf (datacurve) 2.jpg';
import thumbSfDatacurve1 from './images/sf (datacurve).thumb.webp';
import thumbSfDatacurve2 from './images/sf (datacurve) 2.thumb.webp';

import sfDatacurve3 from './images/sf/IMG_0941.jpg';
import thumbSfDatacurve3 from './images/sf/IMG_0941.thumb.webp';

const img = (src, thumb, w, h) => ({ type: 'image', src, thumb, w, h });
const note = (text, color = 'yellow') => ({ type: 'note', text, color });

export const timeline = [
  {
    year: "2026",
    events: [
      // { month: "Apr", title: "Route 66 road trip", description: null, coords: [{ lat: 43.6532, lng: -79.3832 }, { lat: 41.8781, lng: -87.6298 }, { lat: 39.7817, lng: -89.6501 }, { lat: 38.6270, lng: -90.1994 }, { lat: 37.0842, lng: -94.5133 }, { lat: 36.1539, lng: -95.9928 }, { lat: 35.4676, lng: -97.5164 }, { lat: 35.2220, lng: -101.8313 }, { lat: 35.0844, lng: -106.6504 }, { lat: 35.1983, lng: -111.6513 }, { lat: 34.8958, lng: -117.0173 }, { lat: 34.0522, lng: -118.2437 }, { lat: 34.0195, lng: -118.8065 }, { lat: 34.4208, lng: -119.6982 }, { lat: 35.2828, lng: -120.6596 }, { lat: 36.2704, lng: -121.8084 }, { lat: 36.6002, lng: -121.8947 }, { lat: 37.7749, lng: -122.4194 }] },
      { month: "Mar", title: "New York visit", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(nyc2026a, thumbNyc2026a, 1762, 1322), img(nyc2026b, thumbNyc2026b, 1386, 1848)] },
      { month: "Feb", title: "Visited Orlando & Kennedy Space Center", description: null, coords: { lat: 28.5729, lng: -80.6490 }, attachments: [img(ksc1, thumbKsc1, 3072, 4096), img(orlando, thumbOrlando, 1600, 1200)] },
      // { month: "Jan", title: "Learned Piano Man on the harmonica", description: null, coords: null },
    ],
  },
  {
    year: "2025",
    events: [
      { month: "Dec", title: "Road trip through the Florida Keys", description: null, coords: [{ lat: 25.7617, lng: -80.1918 }, { lat: 25.0865, lng: -80.4473 }, { lat: 24.9246, lng: -80.6476 }, { lat: 24.7064, lng: -81.0936 }, { lat: 24.5551, lng: -81.7800 }], attachments: [img(miamiKeys, thumbMiamiKeys, 5712, 4284), img(miami2Keys, thumbMiami2Keys, 4284, 5712)] },
      { month: "Sep", title: "Joined Quora", description: null, coords: null, attachments: [note("Joined the Ads Targeting team as a Machine Learning Engineering Intern", "pink")] },
      { month: "Sep", title: "Cottage trip in Quebec", description: null, coords: { lat: 46.4171, lng: -75.4782 }, attachments: [img(quebecCottage, thumbQuebecCottage, 5712, 4284)] },
      { month: "Aug", title: "Visited Singapore", description: null, coords: { lat: 1.3521, lng: 103.8198 }, attachments: [img(singapore1, thumbSingapore1, 4032, 3024), img(singapore2, thumbSingapore2, 5712, 4284)] },
      { month: "Aug", title: "India trip", description: null, coords: { lat: 22.2587, lng: 71.1924 }, attachments: [img(india1, thumbIndia1, 1280, 960), img(india2, thumbIndia2, 1280, 960)] },
      { month: "Jul", title: "Ran the SF 10k", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(sfRace, thumbSfRace, 5712, 4284), img(sfRace2, thumbSfRace2, 478, 720)] },
      { month: "Jun", title: "Went camping in Yosemite", description: null, coords: { lat: 37.8651, lng: -119.5383 }, attachments: [img(yosemite1, thumbYosemite1, 4032, 3024), img(yosemite3, thumbYosemite3, 4032, 3024), img(yosemite4, thumbYosemite4, 5712, 4284), img(yosemite5, thumbYosemite5, 4032, 3024)] },
      { month: "Jun", title: "Went surfing for the first time", description: null, coords: { lat: 36.9741, lng: -122.0308 }, attachments: [img(surfing, thumbSurfing, 5712, 4284)] },
      { month: "May", title: "Joined Glean", description: null, coords: { lat: 37.4419, lng: -122.1430 }, attachments: [img(glean1, thumbGlean1, 4284, 5712),  note("Built an [automated evals suite for Deep Research ↗](https://www.glean.com/blog/intern-life-at-glean#deep-research)", "yellow"), img(gleanTwinPeaks, thumbGleanTwinPeaks, 4032, 3024)], },
      // { month: "May", title: "Watched Attack on Titan Orchestral performance", description: null, coords: { lat: 43.6532, lng: -79.3832 } },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "Nov", title: "SF visit", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(sfDatacurve1, thumbSfDatacurve1, 4032, 3024), img(sfDatacurve2, thumbSfDatacurve2, 4032, 3024), img(sfDatacurve3, thumbSfDatacurve3, 5712, 4284)] },
      { month: "Oct", title: "Saw the Attack on Titan musical in New York", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(aotMusical, thumbAotMusical, 3072, 3585)] },
      { month: "Sep", title: "Joined Expertise.ai", description: null, coords: { lat: 43.6629, lng: -79.3957 }, attachments: [img(expertiseAi1, thumbExpertiseAi1, 3024, 4032), img(expertiseAi2, thumbExpertiseAi2, 3024, 4032)] },
      { month: "Aug", title: "Visited Vancouver & Seattle", description: null, coords: [{ lat: 49.2827, lng: -123.1207 }, { lat: 49.0027, lng: -122.7554 }, { lat: 48.7519, lng: -122.4787 }, { lat: 48.4229, lng: -122.3349 }, { lat: 47.9790, lng: -122.2021 }, { lat: 47.6062, lng: -122.3321 }], attachments: [img(seattle1, thumbSeattle1, 3024, 4032), img(seattle2, thumbSeattle2, 3024, 4032)] },
      // { month: "Jun", title: "Hindu Students Council shibhir in Pennsylvania", description: null, coords: { lat: 40.9699, lng: -77.7278 } },
      { month: "May", title: "Went canoeing in Long Point", description: null, coords: { lat: 42.5500, lng: -80.4500 } },
      { month: "May", title: "Visited Trinidad", description: null, coords: { lat: 10.6918, lng: -61.2225 }, attachments: [img(trinidad1, thumbTrinidad1, 4032, 3024)] },
      { month: "Mar", title: "Road trip to Boston", description: null, coords: [{ lat: 43.4711, lng: -80.5445 }, { lat: 43.0896, lng: -79.0849 }, { lat: 42.8864, lng: -78.8784 }, { lat: 43.1566, lng: -77.6088 }, { lat: 43.0481, lng: -76.1474 }, { lat: 42.6526, lng: -73.7562 }, { lat: 42.1015, lng: -72.5898 }, { lat: 42.3601, lng: -71.0589 }], attachments: [img(boston, thumbBoston, 3024, 4032)] },
      { month: "Jan", title: "Joined Dropbase", description: null, coords: null },
    ],
  },
  {
    year: "2023",
    events: [
      { month: "Dec", title: "Visited New York", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(nyc2023c, thumbNyc2023c, 2448, 3264), img(nyc2023b, thumbNyc2023b, 3024, 4032), img(nyc2023a, thumbNyc2023a, 4032, 3024)] },
      { month: "Dec", title: "Attended the Champions Chess Tour 2023", description: null, coords: { lat: 43.6532, lng: -79.383 }, attachments: [img(amanHambleton, thumbAmanHambleton, 1836, 3264), img(ericHansen, thumbEricHansen, 1836, 3264)] },
      { month: "Sep", title: "Attended TechCrunch Disrupt", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(techcrunchDisrupt, thumbTechcrunchDisrupt, 4032, 2268)] },
      { month: "Sep", title: "Attended HackMIT", description: null, coords: { lat: 42.3601, lng: -71.0942 }, attachments: [img(bostonHackmit, thumbBostonHackmit, 4032, 2268)] },
      // { month: "Jul", title: "Visited Grand Bend", description: null },
      { month: "Jun", title: "Judged JAMHacks 7", description: null, coords: { lat: 43.4723, lng: -80.5449 } },
      // { month: "May", title: "Attended protest", description: null, coords: null },
      { month: "May", title: "Joined zipBoard", description: null, coords: null },
      { month: "Apr", title: "Attended Jane Street's PuzzleCity", description: null, coords: { lat: 43.448702851066614, lng: -80.48725742894958 } },
      { month: "Jan", title: "Attended ConUHacks in Montreal", description: null, coords: { lat: 45.4941, lng: -73.5779 } },
    ],
  },
  {
    year: "2022",
    events: [
      { month: "Dec", title: "Judged hack::peel", description: null, coords: { lat: 43.5890, lng: -79.6441 } },
      { month: "Sept", title: "Started CS @ Waterloo", description: null, coords: { lat: 43.47114661760789, lng: -80.54535675263575 }, attachments: [img(waterloo, thumbWaterloo, 4032, 2268)] },
      { month: "May", title: "Offered the Schulich Leader Scholarship", description: null, coords: { lat: 43.6629, lng: -79.3957 }, attachments: [note("Offered the $100k Schulich Leader Scholarship from the University of Toronto", "blue")] },
    ],
  },
  {
    year: "2021",
    events: [
      { month: "Aug", title: "Went skydiving", description: null, coords: { lat: 44.3002, lng: -79.5431 }, attachments: [img(skydiving1, thumbSkydiving1, 3840, 2160), img(skydiving2, thumbSkydiving2, 3840, 2160), img(skydiving3, thumbSkydiving3, 3840, 2160)] },
      { month: "Jul", title: "Shad", description: null, coords: { lat: 43.7735, lng: -79.5019 } },
      { month: "Apr", title: "Organized Lighthouse Hacks", description: null, coords: null },
    ],
  },
  {
    year: "2020",
    events: [
      { month: "Oct", title: "Started Coding Club at Port Credit SS", description: null, coords: { lat: 43.5509, lng: -79.5826 } },
    ],
  },
  {
    year: "2018",
    events: [
      { month: "Sep", title: "1st place pitch @ Imagine Hackathon", description: null, coords: { lat: 43.7315, lng: -79.7624 }, attachments: [note("[View project on GitHub ↗](https://github.com/paramt/mathu)", "blue")] },
    ],
  },
  {
    year: "2017",
    events: [
      { month: "Jan", title: "Received App of the Month award from MIT App Inventor", description: null, coords: null, attachments: [note("For my app [Spellbind ↗](https://web.archive.org/web/20170204071134/http://appinventor.mit.edu/explore/app-month-gallery.html)", "green")] },
    ],
  },
];
