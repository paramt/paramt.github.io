---
title: Minimizing Transactions After a Poker Game
date: 2026-04-16
description: Coordinating transactions
---
When I play poker with friends, we don't keep a designated banker who manages buy-ins before the game. Instead, we figure out the transactions later. This works well for our small group, but scaling this up to 9 players makes coordinating the transactions non-obvious. Imagine you have an outcome like this: 

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
| Shannon  |   +87 |

Who sends money to who?
## The Banker
It would be smart to designate a centralized banker, which we can still do after the game. Anyone who ended with a loss sends money to the banker, and the banker sends money to all those who ended with a net gain. For a game with $n$ outstanding balances, this clears them all in $n-1$ transactions.

## A Decentralized Method 
What if we don't want the burden of payouts to be put on one person? Players who ended in a loss should be able to pay out players who ended in a gain directly. We can do this while still maintaining our bound of $n-1$ transactions by using a simple greedy approach.

Imagine the player with the most negative balance pays the player with the most positive balance. In doing so, at least one of those two players will have their balance perfectly zeroed out. Because every single transaction guarantees at least one player is completely settled, and the total sum of the table is zero, it will take a maximum of $n-1$ transactions to clear everyone.
## NP-hardness
Our upper bound on the number of transactions for both methods was $n-1$. However, this is not always a tight bound: it's possible for a single transaction to perfectly clear two balances at once (if a loser's debt exactly matches a winner's gain). So, can we write an algorithm to find the absolute minimum bound?

Surprisingly, we can't! At least not in [polynomial time](https://en.wikipedia.org/wiki/Time_complexity). It turns out that this problem is [NP-hard](https://en.wikipedia.org/wiki/NP-hardness). We can show this by reducing a known NP-hard problem to our problem in polynomial time. If we can do that, then we can say that a polynomial-time solution to our problem would be a polynomial-time solution to an NP-hard problem, which would prove $P=NP$.  

Let's reduce the [Partition Problem](https://en.wikipedia.org/wiki/Partition_problem) to our problem: Given a multiset $S$ of positive integers, is it possible to partition $S$ into two multisets $S_1$, $S_2$, such that the sum of $S_1$ equals the sum of $S_2$. 

Given a multiset $S$, we construct an instance of our poker problem as follows: 
Let $m$ be the number of elements in $S$, and $T$ be the total sum of all elements.
For each element $a_i \in S$ we say that there's a player with a net gain of $a_i$. 
Then we add two players $p_1$ and $p_2$, each with a net loss of $\frac{T}{2}$.
Thus we have $m+2$ players, with all outstanding balances summing to 0.

Given this construction, we run our theoretical algorithm to determine the minimum number of transactions needed to clear all balances. If the number of transactions is $m$, we return YES to the partition problem. Otherwise we need $m+1$ transactions and return NO. 

To see why this works, let's prove that $S$ can be partitioned into two sets of equal sum if and only if our construction needs exactly $m$ transactions to clear balances. 

$(\implies)$  $S$ can be partitioned into two sets of equal sum, say $X$ and $Y$. $S$ had its elements summing to $T$, so both $X$ and $Y$ must have their elements sum to $\frac{T}{2}$. Let's partition the winning players in our game into the same two sets. Now $p_1$ can make $|X|$ payments, one to each player in $X$ for their full amount. This clears balances for all players in $X$, and it clears $p_1$'s balance because $X$ sums to $\frac{T}{2}$. In the same way, $p_2$ can make $|Y|$ payments and clear the remaining balances. This took $|X|+|Y|=|S|=m$ transactions. Furthermore, we know this is the lower bound because there are $m$ individual players with a net gain that each need a separate transaction.

$(\impliedby)$ Our construction needs exactly $m$ transactions to clear all balances. There are $m$ players with a net gain, so each one was involved in exactly one transaction for their full amount. But both $p_1$ and $p_2$ also cleared their balance in these transactions. This means that every transaction must have been between some winning player $a_i$ and one of $\{p_1, p_2\}$. And every $a_i$ was involved in some transaction. Thus we can partition all $a_i$ by which $p_i$ they were paid from. Let $S_1$ be the set of players paid by $p_1$ and $S_2$ the set of players paid by $p_2$. The sum of elements in $S_1$ must be the same as the balance of $p_1$, which is $\frac{T}{2}$. Similarly the sum of $S_2$ is also $\frac{T}{2}$. Since all $a_i$ came from our input set $S$, we showed that $S$ can be partitioned into two sets of equal sum.

## Fairness
Okay, so we're stuck with our $n-1$ solution. This is still the minimal number of transactions in the general case. But what if we want to minimize the maximum number of transactions performed by a single person? Even in our decentralized solution we could have a single player performing all $n-1$ transactions. 

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
#### Credits

When asking Claude to proof read this post, it surfaced a [blogpost with a similar premise](https://antoncao.me/blog/splitwise) -- I really liked the complexity theory analysis, which inspired me to find a similar reduction myself.