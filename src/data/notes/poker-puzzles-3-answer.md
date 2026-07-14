---
title:
date:
description:
unlisted: true
tags:
---
- There is a hold'em heads up pot between Adam and Bob. Four cards are on the board. 
- Adam currently has the best hand on the turn.
- No matter what card in the deck falls on the river, Adam cannot win the pot.

Using only this information, identify the board, Adam’s hole cards, and Bob’s hole cards.

# Answer 

Board: 2 A 4 K 

Adam's hand: 25
Bob's hand: 23

Currently, Adam's hand is best: 22AK5 beats 22AK4

If the river is: 
- 2: both players have trips with AK kickers => pot is chopped
- 3: Bob hits two pair and wins
- 4: Both players hit two pair with A kicker => pot is chopped 
- 5: Adam hits two pair but Bob hits a straight
- Any other card $x>5$: Both players have 22AK$x$ => pot is chopped
