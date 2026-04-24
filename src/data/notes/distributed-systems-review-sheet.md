---
title: Distributed Systems Review Sheet
date: 2026-04-21
description: My final review sheet, adapted to be useful to look back at in a few years
unlisted: false
tags:
  - reference
---
Big ideas of the course: scaling horizontally, dealing with failures

# Networking
layers of the network stack:
- **application** protocol (http / ftp / etc)
- **transport** protocol (TCP / UDP)
- **network** connects links (IP address)
- **link** connects two physical nodes (MAC address)
- **physical** nodes 


Notes
- tcp: ordering guarantees, retries
- udp: used when real-time latency > correctness (e.g. livestreaming)
- routing table lists next link for each destination IP 
# Communication
- raw message parsing: hard to program with 
- distributed shared memory: high overhead, hard to deal with errors
- RPC (remote procedure call): well known procedure call semantics, procedures are executed on remote nodes
## RPC
- export table holds `fid`, `fname`, `callback_fn_ptr`
- rebind functions on server restart with new `fid`s 
	- this is necessary to allow clients to detect when a server failed and restarted, because it may have possible executed a previous function without providing an ack
- `prev_calls` table holds `client_ip`, `pid`, `seq_number` to provide at-most-once semantics
	- Xerox RPC gives at most semantics: exactly once on success, at most once on failure
- dynamic binding: RPC server registers its existence and available functions to a registry that clients can request info from
- gRPC: TCP, at most once semantics 
## RMI: Remote Method Invocation
- OOP version of RPC 
- server maintains objects and allows remote objects to access methods
- Java RMI's garbage collection in distributed systems: reference listing, with leases to handle failures
## Message based communication
 - allows space/time decoupling, separation of concerns
 - topologies: single broker, mesh, flexible, peer-to-peer
# Distributed File Systems
NFS design principles: 
- access transparency: no distinction between local and remote files
- performance
- portable
- simple design
	- stateless requests
	- idempotent operations

implementation
- iterative lookups (since any point can be a new mount point)
- communication through RPC
- no authentication in v3
- session semantics: no changes are visible to other processes until the file is closed

Sun NFS client side caching: time based, same as `watdfs` 

Andrew File System: whole file caching
- when client wants to write to a file, server sends whole file along with callback promise
- if another client wants to write to that file, server issues a callback to that client
- this means client doesn't have to poll server, it can aggressively cache whole file and apply updates as necessary 
- server can store multiple callback promises for the same file to multiple clients

NFSv4 implemented AFS callback promise as "delegation"
# Data Center 
SMP's (symmetric multi-processor) edge over commodity hardware decreases as cluster size increases, because most time is spent in remote access

Amdahl's law: 

$$ T' = (p/s)T + (1-p)T  $$

Storage design: 
1. Network Attached Storage: lower network overhead
2. Distributed storage: higher data locality, infinitely scalable

Notes
- latency time is round trip
- always draw out TOR, even when only moving within rack 
- TOR is always pipelined 
- DC latency includes rack latency
# System Architecture

- Availability: `(MTBF - MTTR) / MTBF`
- `MTBF`: Mean Time Between Failures
- `MTTR`: Mean Time To Repair
# Server Design 

| Server Design                       | Throughput | Response time | Program |
| ----------------------------------- | ---------- | ------------- | ------- |
| Single process                      | Low        | Bad           | Easy    |
| Multi threaded (thread per request) | Low        | Bad           | Medium  |
| Multi process                       | Low        | Bad           | Medium  |
| Process/thread pool                 | High       | Medium        | Medium  |
| Event based                         | High       | Good          | Hard    |
| SEDA                                | High       | Good          | Medium  |

Best option: SEDA 
- modular, each module is a thread pool design 
- each module has an input queue and output queue
# Naming 
- hybrid between iterative and recursive lookup
	- recursive is high load on the server 
	- iterative is too many requests
# Synchronization
## Clocks
### Cristian's Algorithm
```
client_time = server_time + RTT / 2
```
### Network Time Protocol

```
offset = ((T2 - T1) + (T3 - T4)) / 2
```

gradually adjust clocks to maintain continuity 
### Internet Time Protocol (NTP)

### Berkeley algorithm
- centralized time server polls all servers, updates them with average time 
### Decentralized averaging algorithm
- broadcast time at beginning of fixed intervals, compute average time from received broadcasts 
### Lamport timestamps 
- increment logical clock before sending
- on receive, set logical clock to 1 + max(source, curr)
### Total ordered multicast 
- goal: assign same order to all messages on all servers
- protocol: only process a message if it has been `ack`ed by all nodes and is at the front of the queue. queue prioritizes lower timestamps (these can be arbitrary timestamps from different servers)

Assumptions: 
- reliable network 
- no packet loss
- nodes do not fail
### Vector clocks
- each node stores a vector of timestamps: its best knowledge of every other node's timestamp
### Causal ordered multicast 
- protocol: maintain vector clocks, only process a message if its timestamp for all other nodes is the same or lower as current VC, and timestamp from origin node is incremented by 1
- relaxes 'no packet reordering' requirement
# Mutual Exclusion
## Central Server Algorithm 
- single coordinator acts as the lock server
- single point of faillure
- \# messages before enter: 2
- \# messages per entry/exit: 3

## Distributed Algorithm
- for a participant to enter a critical section, it must get permission from all other nodes
- only grant permission if not in critical section yourself, otherwise queue request 
- if contention: prioritize by timestamp (arbitrary)
- $n$ single points of failure instead of 1 single point of failure
- \# messages before enter: 2(n-1)
- \# messages per entry/exit: 2(n-1)

## Token Ring Algorithm
- pass "token" -- permission to enter critical section around a logical ring of servers
- detecting that the token is lost (held by a failed node) is difficult
- \# messages before enter: 0 to (n-1)
- \# messages per entry/exit: unbounded

# Elections
## Bully Algorithm
- send election message to all higher nodes
- a node responds to all election messages from lower nodes, takes over
- highest available node is the leader

## Ring Algorithm
- initializing node builds a list, passes it on
- total list of all servers given back to the starting node, it picks the leader to be the highest node
# Replication
- client pull based, server push based
- data centric consistency
	- sequential consistency
		- read and write operations by all processes on the data were executed in some **sequential order**
		- operations of each individual process appear in the sequence specified by its program
- client centric consistency 
	- eventual consistency 
# 2PC (Two Phase Commit)
- blocking, consensus 
- if coordinator fails permanently, we block and need to resolve manually
	- we don't know what it would've voted, so participants cant resolve themselves
- 2 phase lock: participant locks between sending commit vote and receiving commit decion
# Raft 
- goal: replicated log
- log consistency 
	- log entry has same index and term => they store the same command AND preceding entries are the same 
	- log entry is committed => preceding entries are committed 
- entry committed **if known** to be stored on majority of servers
- append: previous log entry must match
	- leader stores nextIndex for each follower
- elections: safety (proven) and liveness (cant prove)
	- only vote for a candidate with a more complete log 
	- for a new leader to commit a previous entry, it must also commit an entry from its own current term 

wrinkle: slide 19 -- entry 2 not committed, even though its on the majority of servers 
because S5 can become leader before 4 finishes replicating 

config changes: joint consensus 
- need majority of both old and new configurations for elections, commits
- config change is a log entry applied immediately (committed or not)
- when running C_old and you receive C_old+C_new, run C_old+C_new (added restriction)
- once the C_old+C_new message is committed, we can drop C_old from the restriction set 

# Chord
- finger table: go to pointer that is less than the target key

# Dynamo 
- consistent hashing ring like chord, but each node knows about every other node -> O(1) lookup
- client centric consistency 
	- monotonic reads
	- monotonic writes
	- read your writes 
	- pure eventual

- replication via quorums (N, W, R)
	- R + W > N (guarantee that reads and writes overlap) 
	- W > N/2

- for an object to diverge: we need two separate coordinators to write to the same object (not possible unless the designated coordinator fails[^1])
- reads and writes for an object are done by the same coordinator (unless failure case -- sloppy quorum)
- sloppy quorum compromises on the set of N: it can use handoff nodes if there aren't W reachable nodes within N - but it still always replicates to W nodes
- this breaks quorum because we can have disjoint W-1 acks => so in that case we just maintain divergent updates (unordered)
- (N is not total number of nodes, its total number of replicas for a given key, e.g. 3)
- dynamo resolves conflicts on reads, and maintains always writable 
- merkle trees: hash tree per region to compare data (for replica synchronization)
- virtual nodes: support imbalanced load and heterogeneous nodes
- gossip (epidemic) protocol to propagate membership

# MapReduce 
optimizations
- rerun all jobs when there's 5% left 
- rename after writing
# GFS
- metadata server holds `fileId` to `[chunkId]` map, and `chunkId` to `[replica]` map

|                    | write                 | append                                  |
| ------------------ | --------------------- | --------------------------------------- |
| single success     | defined               | defined, interspersed with inconsistent |
| concurrent success | undefined, consistent | defined, interspersed with inconsistent |
| failure            | inconsistent          | inconsistent                            |
consistent: all replicas hold the same data 

defined: consistent and clients see mutations in their entirety 

- serial success: always defined 
- concurrent success:
	- writes: consistent but undefined, because there is no ordering guarantee between chunks
	- appends: defined, because there is only 1 chunk you append to at a time (interspersed with inconsistent caused by failures)
- failure: inconsistent 

appends have at least once semantics: retry on fail
- application logic needs to handle duplicate entries

concurrent writes can have consistent but undefined data: 
- when data spans multiple chunks, the primary for each chunk is responsible for ordering the writes (e.g. chunk 1 has server A primary and chunk 2 has server B primary. client C and client D write to both chunks, server A can accept C then D, whereas server B can accept D then C => chunk 1 has only D and chunk 2 has only C)
- consistent (all replicas of these chunks contain the same corrupted data), but since data is corrupt, it's undefined 
- ie there is coordination between primary and replicas for a given chunk, but no coordination between chunk primaries even for chunks that belong to the same logical file
	- we could solve this with 2PC, raft, total order multicast, etc, but GFS chooses not to add this overhead 

typical pattern in databases: consistency protocols within partition, and consistency protocol between partitions (ie raft over raft, or raft over 2pc, etc) - GFS doesnt do this just for avoiding this overhead

## Questions
- does TOM update local logical clock to `1 + max(curr, incoming)` too? 
	- no
- does there need to be a failure for dynamo to have conflicts? 
	- yes, as a conflict requires two separate coordinators managing the same object[^1]


[^1]: Not considering the load balancing optimization in the Dynamo paper -- not covered in class

