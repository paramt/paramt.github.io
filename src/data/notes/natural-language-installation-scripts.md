---
title: Natural Language Installation Scripts
date: 2026-06-16
description:
unlisted: false
tags:
  - cs
---
Recently I've been coming across installation scripts written in natural language, meant to be executed by an agent harness. For example, [this installation prompt sets up a command to launch Claude Code using OpenRouter](https://gist.github.com/JustSuperHuman/cda6981a62aa4fd2e2ba8120a717b348). This has some advantages over traditional installation scripts: 
# Personalization
## User preference 
The installation prompt includes: 
```
1. Ask me for my OpenRouter API key before making changes.
```

This could even be extended to open-ended preferences that you couldn't account for with deterministic scripts. 
## Environment 
Beyond customizing for user preferences, it allows customizing for your specific environment:
```
add it to my shell profile as `OPENROUTER_API_KEY`, 
unless a better local convention already exists.
```
# Extensibility

```
Implementation examples:

PowerShell function should look like this:
...  
zsh/bash function should look like this:
...
```

Now this single prompt works for not only for Powershell, zsh, and bash, but for any shell that will ever exist.

The biggest drawback I can think of is security. On one hand, the installation being a natural language prompt makes it harder to obfuscate malicious instructions. But on the other hand, the attack surface has increased: any file or prompt the agent encounters could potentially inject an instruction. 

In general, these installation prompts feel more declarative than their script counterparts. You get to describe the goal at a high level rather than worry about implementation details, and I really like that. 
