import { route } from './routes.js';

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

import thumbSkydiving1 from './images/skydiving 1.thumb.webp';
import thumbSkydiving2 from './images/skydiving 2.thumb.webp';
import thumbSkydiving3 from './images/skydiving 3.thumb.webp';

import thumbIndia1 from './images/india 1.thumb.webp';
import thumbIndia2 from './images/india 2.thumb.webp';

import thumbSfDatacurve1 from './images/sf (datacurve).thumb.webp';
import thumbSfDatacurve2 from './images/sf (datacurve) 2.thumb.webp';

import thumbSfDatacurve3 from './images/sf/IMG_0941.thumb.webp';

const img = (src, w, h) => ({ type: 'image', src, w, h });
const note = (text, color = 'yellow') => ({ type: 'note', text, color });

export const timeline = [
  {
    year: "2026",
    events: [
      // { month: "Apr", title: "Route 66 road trip", description: null, coords: route("Route 66 road trip") },
      { month: "Mar", title: "New York visit", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(thumbNyc2026a, 1762, 1322), img(thumbNyc2026b, 1386, 1848)] },
      { month: "Feb", title: "Visited Orlando & Kennedy Space Center", description: null, coords: { lat: 28.5729, lng: -80.6490 }, attachments: [img(thumbKsc1, 3072, 4096), img(thumbOrlando, 1600, 1200)] },
      // { month: "Jan", title: "Learned Piano Man on the harmonica", description: null, coords: null },
    ],
  },
  {
    year: "2025",
    events: [
      { month: "Dec", title: "Road trip through the Florida Keys", description: null, coords: route("Road trip through the Florida Keys"), attachments: [img(thumbMiamiKeys, 5712, 4284), img(thumbMiami2Keys, 4284, 5712)] },
      { month: "Sep", title: "Joined Quora", description: null, coords: null, attachments: [note("Joined the Ads Targeting team as a Machine Learning Engineering Intern", "pink")] },
      { month: "Sep", title: "Cottage trip in Quebec", description: null, coords: { lat: 46.4171, lng: -75.4782 }, attachments: [img(thumbQuebecCottage, 5712, 4284)] },
      { month: "Aug", title: "Visited Singapore", description: null, coords: { lat: 1.3521, lng: 103.8198 }, attachments: [img(thumbSingapore1, 4032, 3024), img(thumbSingapore2, 5712, 4284)] },
      { month: "Aug", title: "India trip", description: null, coords: { lat: 22.2587, lng: 71.1924 }, attachments: [img(thumbIndia1, 1280, 960), img(thumbIndia2, 1280, 960)] },
      { month: "Jul", title: "Ran the SF 10k", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(thumbSfRace, 5712, 4284), img(thumbSfRace2, 478, 720)] },
      { month: "Jun", title: "Went camping in Yosemite", description: null, coords: { lat: 37.8651, lng: -119.5383 }, attachments: [img(thumbYosemite1, 4032, 3024), img(thumbYosemite3, 4032, 3024), img(thumbYosemite4, 5712, 4284), img(thumbYosemite5, 4032, 3024)] },
      { month: "Jun", title: "Went surfing for the first time", description: null, coords: { lat: 36.9741, lng: -122.0308 }, attachments: [img(thumbSurfing, 5712, 4284)] },
      { month: "May", title: "Joined Glean", description: null, coords: { lat: 37.4419, lng: -122.1430 }, attachments: [img(thumbGlean1, 4284, 5712),  note("Built an [automated evals suite for Deep Research ↗](https://www.glean.com/blog/intern-life-at-glean#deep-research)", "yellow"), img(thumbGleanTwinPeaks, 4032, 3024)], },
      // { month: "May", title: "Watched Attack on Titan Orchestral performance", description: null, coords: { lat: 43.6532, lng: -79.3832 } },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "Nov", title: "SF visit", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(thumbSfDatacurve1, 4032, 3024), img(thumbSfDatacurve2, 4032, 3024), img(thumbSfDatacurve3, 5712, 4284)] },
      { month: "Oct", title: "Saw the Attack on Titan musical in New York", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(thumbAotMusical, 3072, 3585)] },
      { month: "Sep", title: "Joined Expertise.ai", description: null, coords: { lat: 43.6629, lng: -79.3957 }, attachments: [img(thumbExpertiseAi1, 3024, 4032), img(thumbExpertiseAi2, 3024, 4032)] },
      { month: "Aug", title: "Visited Vancouver & Seattle", description: null, coords: route("Visited Vancouver & Seattle"), attachments: [img(thumbSeattle1, 3024, 4032), img(thumbSeattle2, 3024, 4032)] },
      // { month: "Jun", title: "Hindu Students Council shibhir in Pennsylvania", description: null, coords: { lat: 40.9699, lng: -77.7278 } },
      { month: "May", title: "Went canoeing in Long Point", description: null, coords: { lat: 42.5500, lng: -80.4500 } },
      { month: "May", title: "Visited Trinidad", description: null, coords: { lat: 10.6918, lng: -61.2225 }, attachments: [img(thumbTrinidad1, 4032, 3024)] },
      { month: "Mar", title: "Road trip to Boston", description: null, coords: route("Road trip to Boston"), attachments: [img(thumbBoston, 3024, 4032)] },
      { month: "Jan", title: "Joined Dropbase", description: null, coords: null },
    ],
  },
  {
    year: "2023",
    events: [
      { month: "Dec", title: "Visited New York", description: null, coords: { lat: 40.7128, lng: -74.0060 }, attachments: [img(thumbNyc2023c, 2448, 3264), img(thumbNyc2023b, 3024, 4032), img(thumbNyc2023a, 4032, 3024)] },
      { month: "Dec", title: "Attended the Champions Chess Tour 2023", description: null, coords: { lat: 43.6532, lng: -79.383 }, attachments: [img(thumbAmanHambleton, 1836, 3264), img(thumbEricHansen, 1836, 3264)] },
      { month: "Sep", title: "Attended TechCrunch Disrupt", description: null, coords: { lat: 37.7749, lng: -122.4194 }, attachments: [img(thumbTechcrunchDisrupt, 4032, 2268)] },
      { month: "Sep", title: "Attended HackMIT", description: null, coords: { lat: 42.3601, lng: -71.0942 }, attachments: [img(thumbBostonHackmit, 4032, 2268)] },
      // { month: "Jul", title: "Visited Grand Bend", description: null },
      { month: "Jun", title: "Judged JAMHacks 7", description: null, coords: { lat: 43.4723, lng: -80.5449 } },
      // { month: "May", title: "Attended protest", description: null, coords: null },
      { month: "May", title: "Joined zipBoard", description: null, coords: null },
      { month: "Apr", title: "Participated in Jane Street's PuzzleCity", description: null, coords: { lat: 43.448702851066614, lng: -80.48725742894958 } },
      { month: "Jan", title: "Attended ConUHacks in Montreal", description: null, coords: { lat: 45.4941, lng: -73.5779 } },
    ],
  },
  {
    year: "2022",
    events: [
      { month: "Dec", title: "Judged hack::peel", description: null, coords: { lat: 43.5890, lng: -79.6441 } },
      { month: "Sept", title: "Started CS @ Waterloo", description: null, coords: { lat: 43.47114661760789, lng: -80.54535675263575 }, attachments: [img(thumbWaterloo, 4032, 2268)] },
      { month: "May", title: "Offered the Schulich Leader Scholarship", description: null, coords: { lat: 43.6629, lng: -79.3957 }, attachments: [note("Offered the $100k Schulich Leader Scholarship from the University of Toronto", "blue")] },
    ],
  },
  {
    year: "2021",
    events: [
      { month: "Aug", title: "Went skydiving", description: null, coords: { lat: 44.3002, lng: -79.5431 }, attachments: [img(thumbSkydiving1, 3840, 2160), img(thumbSkydiving2, 3840, 2160), img(thumbSkydiving3, 3840, 2160)] },
      { month: "Jul", title: "Participated in Shad", description: null, coords: { lat: 43.7735, lng: -79.5019 } },
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
