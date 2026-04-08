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

import nyc2023a from './images/nyc 2023.jpg';
import nyc2023b from './images/nyc 2023 2.jpg';

import amanHambleton from './images/aman hambleton.jpg';
import ericHansen from './images/eric hansen.jpg';

import techcrunchDisrupt from './images/techcrunch disrupt.jpg';

import bostonHackmit from './images/boston hackmit.jpg';

import waterloo from './images/waterloo.jpg';

export const timeline = [
  {
    year: "2026",
    events: [
      { month: "Mar", title: "Visited New York", description: null, link: null, lat: 40.7128, lng: -74.0060 },
      { month: "Feb", title: "Visited Orlando & Kennedy Space Center", description: null, link: null, lat: 28.5729, lng: -80.6490, images: [ksc1, orlando] },
      { month: "Jan", title: "Learned Piano Man on the harmonica", description: null, link: null, lat: null, lng: null },
    ],
  },
  {
    year: "2025",
    events: [
      { month: "Dec", title: "Road trip through the Florida Keys", description: null, link: null, lat: 24.5551, lng: -81.7800, images: [miamiKeys, miami2Keys] },
      { month: "Sep", title: "Started MLE internship @ Quora", description: null, link: null, lat: 37.4419, lng: -122.1430 },
      { month: "Sep", title: "Cottage trip in Quebec", description: null, link: null, lat: 46.4171, lng: -75.4782, images: [quebecCottage] },
      { month: "Aug", title: "Visited Singapore", description: null, link: null, lat: 1.3521, lng: 103.8198, images: [singapore1, singapore2] },
      { month: "Aug", title: "Visited India", description: null, link: null, lat: 22.2587, lng: 71.1924 },
      { month: "Jul", title: "Ran the SF 10k", description: null, link: null, lat: 37.7749, lng: -122.4194, images: [sfRace, sfRace2] },
      { month: "Jun", title: "Went camping in Yosemite", description: null, link: null, lat: 37.8651, lng: -119.5383, images: [yosemite1, yosemite3, yosemite4, yosemite5] },
      { month: "Jun", title: "Went surfing for the first time", description: null, link: null, lat: 36.9741, lng: -122.0308, images: [surfing] },
      { month: "May", title: "Started SWE internship @ Glean", description: null, link: "https://www.glean.com/blog/intern-life-at-glean#deep-research", lat: 37.4419, lng: -122.1430, images: [glean1, gleanTwinPeaks] },
      { month: "May", title: "Watched Attack on Titan Orchestral performance", description: null, link: null, lat: 43.6532, lng: -79.3832 },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "Nov", title: "Visited San Francisco", description: null, link: null, lat: 37.7749, lng: -122.4194 },
      { month: "Oct", title: "Saw the AOT musical in New York", description: null, link: null, lat: 40.7128, lng: -74.0060 },
      { month: "Sep", title: "Started SWE internship @ Expertise.ai", description: null, link: null, lat: 43.6629, lng: -79.3957, images: [expertiseAi1, expertiseAi2] },
      { month: "Aug", title: "Visited Vancouver & Seattle", description: null, link: null, lat: 49.2827, lng: -123.1207, images: [seattle1, seattle2] },
      { month: "Jun", title: "Hindu Students Council shibhir in Pennsylvania", description: null, link: null, lat: 40.9699, lng: -77.7278 },
      { month: "May", title: "Went canoeing in Long Point", description: null, link: null, lat: 42.5500, lng: -80.4500 },
      { month: "May", title: "Visited Trinidad", description: null, link: null, lat: 10.6918, lng: -61.2225, images: [trinidad1] },
      { month: "Mar", title: "Road trip to Boston", description: null, link: null, lat: 42.3601, lng: -71.0589, images: [boston] },
      { month: "Jan", title: "Started SWE internship @ Dropbase", description: "Dropbase is a YC W20 startup", link: null, lat: null, lng: null },
    ],
  },
  {
    year: "2023",
    events: [
      { month: "Dec", title: "Visited New York", description: null, link: null, lat: 40.7128, lng: -74.0060, images: [nyc2023a, nyc2023b] },
      { month: "Dec", title: "Watched the Champions Chess Tour 2023", description: null, link: null, lat: 43.6532, lng: -79.383, images: [amanHambleton, ericHansen] },
      { month: "Sep", title: "Attended TechCrunch Disrupt in SF", description: null, link: null, lat: 37.7749, lng: -122.4194, images: [techcrunchDisrupt] },
      { month: "Sep", title: "HackMIT", description: null, link: null, lat: 42.3601, lng: -71.0942, images: [bostonHackmit] },
      // { month: "Jul", title: "Visited Grand Bend", description: null, link: null },
      { month: "Jun", title: "Judge @ JAMHacks 7", description: null, link: null, lat: 43.4723, lng: -80.5449 },
      // { month: "May", title: "Attended protest", description: null, link: null, lat: null, lng: null },
      { month: "May", title: "Started SWE internship @ zipBoard", description: null, link: null, lat: null, lng: null },
      { month: "Apr", title: "Attended Jane Street's PuzzleCity", description: null, link: null, lat: 43.448702851066614, lng: -80.48725742894958 },
      { month: "Jan", title: "Attended ConUHacks in Montreal", description: null, link: null, lat: 45.4941, lng: -73.5779 },
    ],
  },
  {
    year: "2022",
    events: [
      { month: "Dec", title: "Judge @ hack::peel", description: null, link: null, lat: 43.5890, lng: -79.6441 },
      { month: "Sept", title: "Started CS @ Waterloo", description: null, link: null, lat: 43.47114661760789, lng: -80.54535675263575, images: [waterloo] },
      { month: "May", title: "Schulich Leader Scholarship", description: "Offered a $100,000 scholarship from the University of Toronto", link: null, lat: 43.6629, lng: -79.3957 },
    ],
  },
  {
    year: "2021",
    events: [
      { month: "Aug", title: "Went skydiving", description: null, link: null, lat: 44.3002, lng: -79.5431 },
      { month: "Jul", title: "Shad", description: "A month-long enrichment program for top Canadian students, hosted at York University", link: null, lat: 43.7735, lng: -79.5019 },
      { month: "Apr", title: "Organized Lighthouse Hacks", description: "200+ participants from 10 countries", link: null, lat: null, lng: null },
    ],
  },
  {
    year: "2020",
    events: [
      { month: "Oct", title: "Started Coding Club at Port Credit SS", description: null, link: null, lat: 43.5509, lng: -79.5826 },
    ],
  },
  {
    year: "2018",
    events: [
      { month: "Sep", title: "1st place pitch @ Imagine Hackathon", description: null, link: "https://github.com/paramt/mathu", lat: 43.7315, lng: -79.7624 },
    ],
  },
  {
    year: "2017",
    events: [
      { month: "Jan", title: "MIT App Inventor — App of the Month", description: "Received the Most Creative App award for Spellbind", link: "https://web.archive.org/web/20170204071134/http://appinventor.mit.edu/explore/app-month-gallery.html", lat: null, lng: null },
    ],
  },
];
