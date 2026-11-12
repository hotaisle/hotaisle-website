---
title: "Meet hotaisle-console"
slug: "introducing-hotaisle-console"
publish: true
metaTitle: "Meet hotaisle-console | Hot Aisle"
metaDescription: "Introducing the open source Hot Aisle web console for launching and managing AMD MI300X machines."
metaKeywords: "hotaisle-console, Hot Aisle, AMD MI300X, GPU cloud, open source"
author: "Jon Stevens"
date: "11/11/2026"
description: "A new way to launch and manage Hot Aisle machines from your browser."
featured: false
videoSrc: "/assets/quickstart/hotaisle-console-walkthrough.mp4"
videoPoster: "/assets/quickstart/hotaisle-console-walkthrough-poster.webp"
videoCaptions: "/assets/quickstart/hotaisle-console-walkthrough.en.vtt"
videoTranscript: "/assets/quickstart/hotaisle-console-walkthrough-transcript.txt"
tags: ["Announcements", "Open Source", "GPU"]
---

We're excited to introduce [hotaisle-console](https://console.hotaisle.app), a web console for renting and managing Hot Aisle AMD MI300X machines. You can go from sign-in to an SSH command in a few clicks, with the machine's state and cost in view along the way.

We started with the TUI. Over time, we built out the API and authentication support behind it, giving us room to make as many frontend clients as we want. The console is the first web client on that foundation. We plan to add more ways to sign in, including passkeys.

## From launch to login

Pick a team, choose a GPU size and image, and see the estimated cost before you launch. You can add a cloud-init URL when you need a machine set up for a specific job. Hold the launch button to confirm, then watch the machine move through assignment and boot until SSH is ready.

![Choose an MI300X size and image before launching a machine](introducing-hotaisle-console/order-light.jpg "theme-light") ![Choose an MI300X size and image before launching a machine](introducing-hotaisle-console/order-dark.jpg "theme-dark")

The machine view shows what's running, which GPUs are assigned, and the SSH command to connect. From there you can check status, start, reboot, rebuild, or end a VM. Bare-metal rentals have their own power and console controls. When it's time to stop, the console shows the minimum charge before you release the machine.

![A running MI300X machine with its SSH command, cost, and GPU view](introducing-hotaisle-console/machine-light.jpg "theme-light") ![A running MI300X machine with its SSH command, cost, and GPU view](introducing-hotaisle-console/machine-dark.jpg "theme-dark")

## The rest of the workflow

The console also puts teams, SSH keys, credit purchases, and earlier runs in one place. Launch details and receipts are saved as encrypted entries in your browser, so you can look back at what ran and what it cost. Light, dark, and system themes are available, and keyboard shortcuts cover the actions you use often.

You can sign in by email or use an API key. If you save an API key in the browser, it is encrypted with a passphrase you choose.

## Open source, with the review in public

[hotaisle-console is open source under the MIT license](https://github.com/hotaisle/hotaisle-console). It began as [hotaisle-ui by StayLameBro](https://github.com/StayLameBro/hotaisle-ui), and we kept the original history and license as we took over maintenance. We'd love for you to try it, file an issue, or send a pull request.

We think we may be the only neocloud with a fully open source frontend control surface that anyone can build on and modify. We see this console as one of many portals into the compute underneath, with room for more clients built by us or by others.

We also ran a full source security review of hotaisle-console using Daybreak. The [review record and follow-up work](https://github.com/hotaisle/hotaisle-console/tree/main/docs/security-audit-2026-11-10) are public.

[Open the console](https://console.hotaisle.app) and have a look. We're excited to see what you build.

## Looking for the right investor

There's one problem with the new console: at the time of writing this post, we're totally full. You can log in, but there are no machines available to launch and play with.

We want to add capacity, but it takes a lot of capital and comes with risk. We think we've thought through those risks as best we can. We have no debt, we take payment up front, and we're profitable. Best of all, our customers love us. We're looking for a lead investor who is an exact fit for our next round, and we can take our time finding one. If that sounds like you, [read more on our investors page](/investors).
