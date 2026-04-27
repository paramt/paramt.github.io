---
title: Minimizing Transactions After a Poker Game
date: 2026-04-16
description: Coordinating transactions
unlisted: true
---
When I play poker with friends, we don't keep a designated banker who manages buyins. Instead, we figure out the transactions later. This works well for our small group, but scaling this up to 9 players makes coordinating the transactions non-obvious. Imagine you have an outcome like this: 

|  Player  | Net $ |
| :------: | ----: |
|  Turing  |   +39 |
|  Church  |   −23 |
|  Gödel   |    +2 |
|  Curry   |   −75 |
|  Hoare   |   +11 |
|  Kleene  |   −12 |
| McCarthy |    +8 |
| Dijkstra |   −37 |
| Shannon  |   +95 |

Who sends money to who?
## The Banker
It would be smart to designate a centralized banker. Usually this is done before the game starts, so everyone buys in by sending money to the banker and receiving chips in return. Throughout the game, players may buy in multiple times. At the end, the banker sends everyone the cash equivalent of however many chips they have. This is usually how it's done, and requires $2(n-1)$ transactions for $n$ players (assuming no one rebuys). 

This is suboptimal so obviously no one should do it this way.

## Optimizing 
Can we do better? Let's hold off on all transactions until the end of the game. Then, anyone who ended with a net loss can send money to those who had a net gain. In this way, we can get away with just $n-1$ transactions[^1]. We'll show this with induction: 

Inductive hypothesis. For a state with $n$ outstanding balances, $n-1$ transactions are enough to close all balances. 

Base case ($n=1$). All outstanding balances add up to 0, so with 1 player there is trivially no outstanding balance. 

Inductive step. Assume there are $n>1$ players left with an outstanding balance. 

Let $p_1$ be the player with the most negative balance, denoted $b_1$. Let $p_2$ be the player with the most positive balance, denoted $b_2$.

If $|b_1|<b_2$ then $p_1$ can send \$$|b1|$ to $p_2$ and $p_1$'s outstanding balance is closed. 
Otherwise $|b_1| \ge b_2$ and $p_1$ can send \$$b_2$ to $p_2$ to close $p_2$'s outstanding balance.

In both cases, we performed 1 transaction and ended with $n-1$ players with an outstanding balance, which by the inductive hypothesis can be closed with up to $n-2$ transactions. 

In total we closed all balances with up to $n-1$ transactions 

## Optimal?
Could we do even better? In the case where $|b_1|=|b_2|$, we would be closing two balances at once. We can construct an example where it just takes $\frac{n}{2}$ transactions (e.g. 4 players are down $10 and 4 players are up $10 each).

But in general, this may not always be possible: Consider the case where all but one player ended with a net gain. All $n-1$ winning players must be paid, and so in general at least $n-1$ transactions are needed. This is indeed our worst case lower bound, and we achieved it!

## Fairness
In our optimal solution, we minimized the total number of transactions. But what if we want to minimize the maximum number of transactions performed by a single person? 

Surprisingly, we can get away with just (up to) 1 transaction per person. The intuition here is that since each losing player can only transfer money once, they must send their entire outstanding balance in one transaction. To deal with splitting payments, let's chain together players and let payments from losing players accumulate, while winning players can "hold back" their wins.

Let's arrange everyone in a chain, from lowest net result to highest: $p_1, p_2, ..., p_n$. As before, let $b_i$ be the outstanding balance of player $p_i$. 

We start with player $p_1$ sending $-b_1$ to $p_2$, clearing their own balance. ($b_i$ itself is a negative value if $p_i$ ended in a loss)

Then $p_2$ sends $-b_2 - b_1$ to player $p_3$: their own outstanding balance $b_2$, *plus* what they received from $p_1$. This clears their own balance.

$p_3$ sends $-b_3-b_2-b_1$ to $p_4$, and so on.

In general, $p_i$ sends $-\Sigma_{j=1}^{i} b_j$ to $p_{i+1}$. 

So a particular player $p_i$ receives $-\Sigma_{j=1}^{i-1} b_j$ from the previous player and sends $-\Sigma_{j=1}^{i} b_j$ to the next. This means their net change after these transactions is 

$$(-\Sigma_{j=1}^{i-1} b_j) - (-\Sigma_{j=1}^{i} b_j)$$

$$ = -\Sigma_{j=1}^{i-1} b_j + \Sigma_{j=1}^{i} b_j $$

$$ = -\Sigma_{j=1}^{i-1} b_j + (\Sigma_{j=1}^{i-1} b_j)+b_i $$

$$ =b_i $$

Which is exactly the outstanding balance they needed to clear!

(Arranging the players in increasing order of their result gives us the guarantee that the amount being sent is never negative. If it were to be negative, they would actually be *requesting* money from the next player, but that player is already sending money to someone else so our goal of 1 transaction per player would be violated.)

Thus we cleared all balances without forcing any player to perform more than a single transaction. This also gives us an upper bound of $n-1$ total transactions: only players $p_1$ to $p_{n-1}$ are sending money. Therefore this is undoubtedly the most optimal and fair way to handle transactions after a poker game!

Come to think of it, it's been a while since my friends have invited me to a game...

---

[^1]: Earlier, $n$ was the total number of players. Here, $n$ is the number of players with an outstanding balance. This is an even better result, because there could be players that ended with a net gain of 0 that previously would have still been involved in 2 transactions

