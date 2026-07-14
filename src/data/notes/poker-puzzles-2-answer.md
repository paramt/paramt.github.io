---
title:
date:
description:
unlisted: true
tags:
---
What configuration of 5 board cards and 2 hole cards make it such that: 
1. Looking back, you know that you had the best possible hand on the flop
2. *and* the turn
3. On the river, you are guaranteed to lose the pot to any other hand -- not even a chop 

# Answer

Board: 223 2 2

Hand: 33

Satisfies all three conditions:

1. You have the best possible hand on the flop. The nuts are 22, but since we're looking back, we know that's on the board so no one can have this. Second nuts are 33 for 3s full of 2s, which is our hand 
2. Same logic on the turn, the best possible hand (looking back) is 3s full of 2s.
3. Everyone has quad 2s. You're playing quad 2s with a 3 kicker. Any other hand is guaranteed to have a card higher than 3 (all the 2s are accounted for, only a single 3 is unaccounted for)


Proof of uniqueness: TODO

