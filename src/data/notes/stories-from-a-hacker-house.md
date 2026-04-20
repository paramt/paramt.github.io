---
title: stories from a hacker house
date: 2024-12-22
description:
unlisted: false
tags:
---
some tidbits from working as a swe intern at ▓▓▓▓▓▓▓▓

(all identifiable information has been replaced with fake names. for context, bob is the ceo)

# Week 0
on my first day, I ring the doorbell at 8:50am to find bob, who had just woken up answering the door, "sorry, we were up until 11:30 last night working"

the house is a classic hacker house: random socks on the floor, some loose change on the table next to the "12 Laws of Power" by Jordan Peterson

"waterloo interns good, other interns retarded" (in a thick chinese accent) - bob the ceo in front of a uoft PEY intern

\*the remaining quotes are all from my ceo unless otherwise specified 

\*\*most quotes are paraphrasing as best as I remember

# Week 1

"we are not seed stage, we are proper office chair stage now"

"we don't have many users from Zoho, maybe we need to write a bot to give us reviews"

bob, in a standup call with the whole team except john: "guys make sure to get everything you need from john by today or tomorrow, his last day will be on monday but he won't have access to anything on monday"

later he clarifies: "by the way, don't tell john this, he doesn't know that his last day will be monday yet"

# Week 2

chris and I bonded over jake making goofy noises every so often while working

# Week 4

early in the week, we had suits coming in and out (people in suits, with slicked back hair, typical sales guys) to give interviews to Bob. they would walk in and look at us with a suppressed astonishment as they enter the hacker house. it felt like a scene straight out of silicon valley. we could hear the full interviews too. they sounded exactly like I imagined sales guys to sound like

Bob: "who is so boring that they're making troll accounts" 

Jake: "that's me"

# Lost track of the weeks

Reflecting on my time here during my last in-person week, remembered some good bits

## hosting the server off my macbook air

friday afternoon: I switch \[companys new domain\]'s DNS servers from cloudflare to vercel, because we want to set up custom subdomains dynamically with SSL which vercel can do for us

before I do that, I make sure to ask Bob if it's ok that \[companys new domain\] will be down for a couple hours. He says it's fine because it's just an empty landing page that isn't published anywhere. So I go ahead and make the switch

Friday ~5:30pm: Sarah reports that chatbot is down all servers are down we realize that the backend is hosted on `api.[companys new domain]`

I make the switch back to cloudflare DNS, but it may take up to 48 hours to take effect. I ask if there's a direct aws hosting link we can switch to, but that doesn't seem to be the case (something with a load balancer?)

so I suggest hosting the backend through ngrok, and we do that for the prod servers for about an hour until we find a better solution. the better solution was just the DNS servers being switched back to cloudflare

## exposing mike

Before joining the company, Mike's friend was goofing around on the voice AI and talking shit while namedropping Mike. Mike said to stop because they can probably see the logs. After he joined, I asked him around what date it was and we found the full transcript as well as audio of that conversation. He was right, we were recording everything

## flirting with heather

![[images/stories-from-a-hacker-house/1.jpg]]

Bob wanted to make a clip go viral, and so together we created the new heather

Originally, Chris was the one talking to "Heather" and I was the voice of Heather. It was all professional, except I was faking the voice of the AI. after a couple days, it devolved into the earlier screenshot

## Thought Tom was a chatbot

earlier in the term, Tom sent me a number and asked me to send a whatsapp message. I did, and I received an automated response from a chatsimple bot back.

months later, my dad was talking about whatsapp bots. so I showed him that we at chatsimple also have whatsapp bots. I wanted to show a demo so I messaged the same number that Tom sent me a while back
![[images/stories-from-a-hacker-house/2.jpg]]

turns out it was just his number

## 100% Chinese

Tom found this website that detects where your accent is from. He kept getting 100% chinese, and he was trying to lower it. So I said what if we (Mike, Chris, and myself) tried to increase our chinese. And then we all proceeded to do our most racist chinese accents

## Mary shit the bed

we got a company cat named Mary

![[images/stories-from-a-hacker-house/3.png]]

after a couple weeks, the room with her litter box started smelling really bad. I guess no one was cleaning it. one day, it was so bad that even she didn't want to use it. so she shit the bed. she shit on the mattress that Dan usually sleeps on

## sarah mogging everyone

Sarah started working at chatsimple during her high school years (as of when I am working here, she is currently in first year) - she is still only paid in occasional snacks and lunches

Chris pushed an intricate change that required both frontend and backend changes, as well as a database migration. somehow only the frontend pushed, and the backend failed because he forgot to push a local commit before merging

Chris figures out the issue in a couple minutes and opens a new PR to fix it. He asks me to quickly approve it because prod is currently broken. I do and he goes to merge it, but there's a conflict. Sarah had already fixed it

not only did she figure out that the bot was down in just a couple minutes, but she also figured out the fix before Chris who worked on the feature and had all the context

## Tom the 10x engineer

this one happened during one of the earlier weeks

Bob was on call with someone - maybe a customer and they asked for a particular feature

Bob said we have it ready actually and will be released in a couple days. then he mutes and asks Tom "can we do this? how long will it take?"

## On call

I get a call in the middle of the night (11:30pm) from a frantic Bob