---
title: Thoughts on folk
date: 2026-07-10
description:
unlisted: false
tags:
---
recently I've been trying [folk](https://www.getfolk.app) -- essentially a managed OpenClaw

you have access to your own sandbox with its own persistent files along with the agent's memory + connectors. I think there's a lot of potential here. I wanted to brainstorm some ideas of what's possible

- recently I had to navigate through FasTrak's website to set up tolls. could it have done this for me? ideally it should remember my license plate info / car model, as well as payment info. what about parking payments? I don't want to have to download an app or visit a website every time I go to a new city and try to figure out street parking 
- booking flights - I can already find out the cheapest flight from A to B pretty easily, but what about figuring out dates? can it sync with my calendar? 
- if I go to a restaurant and eat with friends, can it split a bill for me? would it be any better than claude? maybe just the interface - an imessage chat - is more natural? 
- make website edits? I tried having it draft this note, but ran into issues 
	- codex agent came pre configured, but it was stuck on an old CLI 
	- its voice when drafting the note was not that good. maybe it didn't have access to my other notes actually 
- how well can it handle browser use? 
- can it run little automations for me? e.g. could folk replace [scripts like this](https://gist.github.com/paramt/beb5d4fa2e8cadc3bb8b25c024bb7564) that keep checking for newly open seats during course enrollment
- usually I'll text myself on discord random bits of info I need to remember - can I text folk instead and have it build it as part of its knowledge graph of me? 
- it can join meetings - expand its knowledge graph - become my personal secretary?
- can it update my pokerbase data entry? this is always really tedious
	- could it read through my emails to see how much I sent/recieved and infer the blinds based on who I'm playing with? even if not, being able to add it with a simple text would be much nicer (and I could probably have it remember certain presets of blinds, venues, etc.
 	- if pokerbase doesn't have an API, I could always create my own poker tracker 

I tried asking it if it can order something off amazon for me. it seems that amazon was not a first party connector, but it still tried setting up a remote browser and giving me a link to control the remote browser and log in, after which it claimed it could continue for me. I think this is a promising idea, if they can figure out: 
1. having this actually work for logins -- I got a websocket disconnected error after clicking on log in 
2. persisting browser sessions - I don't want to have to log in every time 

another thing it couldn't do was order me doordash (this was their promo that got me to sign up)

overall I think this product category (managed openclaw) will be really big, and whoever can manage to do it well will be big

so far this is one of the better implementations of it. in principle owning this myself with openclaw would be nice, but I tried it a couple months ago and it wasn't very useful (I definitely needed to invest more time to make it more useful). but there is value in offering plug-and-play support for this kind of thing 

update: I was able to get folk to update this site after all. the original first edit commit was https://github.com/paramt/paramt.github.io/commit/e2b76b9431220574706c67d2b6582001f63834ee
