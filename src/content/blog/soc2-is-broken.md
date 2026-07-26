---
title: "SOC2 Is Broken — And The Entire Industry Knows It"
slug: "soc2-is-broken"
publish: true
metaTitle: "SOC2 Is Broken — Hot Aisle's Take"
metaDescription: "Hot Aisle's honest take on why SOC2 is a fundamentally flawed standard, conflict of interest, CPA sign-offs on security controls, and the dangerous gap between audits."
metaKeywords: "soc2, aicpa, security compliance, attestation, cloud security, hot aisle"
author: "Jon Stevens"
date: "03/26/2026"
description: "Our honest take on why SOC2 is a fundamentally flawed compliance framework, and what that means for you."
featured: true
tags: ["Thoughts"]
---

# SOC2 Is Broken — And The AICPA Knows It

The recent situation with [Delve cutting corners on compliance work](https://www.inc.com/ben-sherry/the-delve-scandal-a-y-combinator-darling-just-got-hit-with-a-bombshell-fraud-accusation/91320652) was the final straw for me and I have to speak up. This event pulled back the curtain on something a lot of people in the industry already know but don’t say out loud: the incentives in the SOC2 ecosystem are misaligned, and the outcomes are not solving real problems.

I’ve been saying this for a while. I even called out Vanta directly here: https://x.com/HotAisle/status/1946302651383329081 — the entire “compliance automation” layer looks like a revenue generation machine.

**Hot Aisle has both SOC2 Type 2 and HIPAA.** We put in the work, paid the fees, and went through the process. We stand behind our security practices. But that doesn’t mean we think the system that certifies them is fair, honest, or actually making anyone safer. It isn’t. Here’s our take.

## The AICPA Wrote The Rules And Then Sells The Rulebook

The American Institute of Certified Public Accountants (AICPA) created SOC2. They own the Trust Services Criteria. They define what "compliant" means. A private professional association created a de facto security standard that the entire cloud industry has been pressured into following.

The AICPA also licenses the right to perform SOC2 audits exclusively to Certified Public Accountants and their affiliated firms. They created the market, they control the market, and they collect licensing fees from every firm operating inside it.

If a pharmaceutical company created both the drug approval standard *and* the exclusive right to approve drugs, we'd call that a conflict of interest and move on. The AICPA does exactly this, and the industry nods along because there's no alternative with equivalent brand recognition.

![The AICPA Conflict of Interest](soc2-is-broken/aicpa-conflict.png "modal")

## The Two-Tier Pricing Game

Here's how it plays out in practice: the AICPA licenses brokers, including firms outside the United States, to offer SOC2 audits. Those brokers then recommend budget-friendly CPA firms to startups and SMBs who want the badge without the full price tag. The result is a wide spectrum of audit quality under a single trusted logo.

A startup paying $8,000 for a SOC2 audit gets a different level of scrutiny than a large enterprise paying $80,000. Yet both walk away with a SOC2 Type 2 report that looks functionally identical to anyone reading it. The buyer has no reliable way to tell the difference. The "SOC2 certified" label has become a floor, not a standard.

Meanwhile, larger organizations are encouraged, sometimes by the same brokers, to use premium CPA firms for the same scope of work, at multiples of the cost. The AICPA's licensing network benefits on both ends.

![The Two-Tier Badge Problem](soc2-is-broken/pricing-tiers.png "modal")

## CPAs Are Not Security Engineers

The more fundamental problem is this: CPAs are trained to audit financial statements. They are not trained to evaluate the security of distributed systems, cloud infrastructure, container orchestration, network segmentation, or zero-trust architectures.

SOC2 audits are performed by people whose core competency is debits, credits, and Generally Accepted Accounting Principles, not threat modeling or infrastructure hardening. When a CPA "attests" that your access controls are operating effectively, they are largely taking your word for it and checking that documented procedures exist. They are not adversarially testing your systems. They are not a red team. They are not a penetration tester. They are an accountant with a checklist.

This is precisely what makes offshore SOC2 auditing so attractive as a business model. Checklist review doesn't require deep familiarity with American cloud infrastructure, US regulatory context, or the specific threat landscape your customers operate in. It requires reading a policy document, interviewing an employee over Zoom, and confirming that screenshots of access logs match what was described. That work can be done from anywhere, and because the AICPA licenses CPA equivalents in many countries to perform attestations, it frequently is. The result is a global market of firms competing on price to do compliance work that was never technically demanding to begin with. The badge looks the same. The rigor does not.

The word "attestation" is doing enormous work here. It implies an expert has examined something and vouched for it. In practice, it often means a firm has reviewed your policy documents and confirmed that your employees can articulate what they're supposed to do.

### What You Can Opt Out Of — Including Penetration Testing

SOC 2, as defined by the AICPA, includes five Trust Services Criteria: Security, Availability, Confidentiality, Processing Integrity, and Privacy. Only Security is required. The others are included only if they’re relevant to your service—for example, Privacy if you handle personal data, or Availability if you make uptime commitments. So yes, organizations can scope SOC 2 narrowly, though in practice many expand scope because customers expect it.

Penetration testing is not explicitly required by SOC 2. The framework requires you to manage risk and demonstrate that your controls are designed and operating effectively, but it doesn’t mandate specific activities like pentests. Many companies still do them because they strengthen security and help with customer trust, but SOC 2 itself is an attestation of controls, not proof that your systems can withstand a real-world attack.

## The Gap Problem Is Real — And It Gets People Hacked

SOC2 is a point-in-time assessment. Your audit covers a specific period, typically the past 12 months. During that window, the auditors review the controls that were operating. Once the report is issued, you are certified for the next 12 months regardless of what changes.

This creates a structural vulnerability. Any third-party service, vendor integration, or infrastructure change you make after your attestation period closes is not covered by your current SOC2 report.

![The 12-Month Gap Problem](soc2-is-broken/audit-gap.png "modal") Your customers see "SOC2 Type 2 certified" and reasonably assume your entire stack has been reviewed. It hasn't. Not the new authentication provider you added in Q2. Not the data pipeline tool your team started using in October. Not the monitoring vendor that just got acquired.

This isn't theoretical. The recent supply chain attack targeting [LiteLLM via PyPI](https://techcrunch.com/2026/03/25/delve-did-the-security-compliance-on-litellm-an-ai-project-hit-by-malware/) is a clean example of exactly this failure mode. LiteLLM is one of the most widely used Python libraries in the AI infrastructure space, a dependency that thousands of organizations pulled in as the ecosystem around LLMs matured rapidly. The attack involved a malicious package uploaded to PyPI designed to impersonate or piggyback on the legitimate LiteLLM package, connected to the [broader trivy incident](https://www.crowdstrike.com/en-us/blog/from-scanner-to-stealer-inside-the-trivy-action-supply-chain-compromise/). Organizations that had added LiteLLM to their stack after their last SOC2 audit period closed had a dependency that was never reviewed, never attested to, and never in scope, because it didn't exist in their environment when the auditors were looking.

The result is a gap that no SOC2 report would catch: a certified, compliant organization running a compromised dependency, with a clean attestation letter on file and an exploit in production. Compliance certification and actual security posture had quietly diverged, and no one was looking in between audits.

## The Industry Isn't Even Pretending It's About Security

One prominent compliance automation platform publishes a guide on why SOC2 is important. They list five reasons:

- Protects Your Brand's Reputation
- Distinguishes You from the Competition
- Attracts More Customers
- Improves Your Services
- Saves You Time and Money in the Long Run

Read those again. One word is absent: **security**.

Not one of those reasons mentions protecting customer data. Not one mentions reducing the risk of a breach. Not one mentions the people on the other side of the contract who are trusting you with their infrastructure, their pipelines, their sensitive workloads. Every reason is about what SOC2 does *for the vendor*. Brand reputation. Competitive differentiation. Sales pipeline. Cost efficiency.

This is an accurate reflection of how the compliance industry thinks about SOC2 at large: as a business development tool, not a security standard. The badge is marketed as something you earn to win more deals, close enterprise contracts faster, and look better than the vendor next to you in a procurement spreadsheet. The customers you're trying to attract with that badge are the same ones whose data you're supposed to be protecting. That conflict of framing doesn't get discussed because everyone in the ecosystem benefits from keeping the focus on sales.

When the industry's own marketing materials don't mention security as a reason to pursue security compliance, you have a clear picture of what the incentives actually are.

## What We Actually Do About It

We don't think the answer is to ignore compliance or complain about the obvious failures that stand uncorrected for decades. Customers have procurement requirements and we respect that. SOC2 Type 2 is a signal that you've done *some* of the basic work. **We've done it.**

But we treat our SOC2 certification as a floor, not a ceiling, and we're honest with customers about what it does and doesn't mean:

- **Continuous monitoring** over periodic audits. We run automated security tooling continuously, not just during audit windows.
- **Vendor reviews at time of adoption**, not just at audit time. If we add a third-party integration, we review it then, not 11 months later.
- **We have a deliberate policy** of adding very few third-party dependencies to begin with. Hot Aisle is a capital-efficient business, we don't layer on SaaS tooling because it's convenient or because everyone else is using it. Every vendor integration is a potential attack surface, a compliance gap, and an operational dependency. The fewer we have, the smaller our exposure. The LiteLLM scenario doesn't apply to a stack that didn't adopt LiteLLM.
- **Honest conversations** about what "certified" actually means when customers ask. We won't let the badge do work it isn't qualified to do.

For customers who need more than a PDF attestation letter, we're willing to go further. Under a mutual NDA, we'll walk through our actual processes, show source code, and explain how specific controls work in practice rather than on paper. A SOC2 report tells you what an accountant observed. We can show you what's actually running. If that conversation is useful for your procurement or security team, [reach out](/contact).

SOC2 will likely remain a procurement checkbox for the foreseeable future. We'll keep earning it. But we think the industry deserves an honest conversation about what it is, a starting point with real structural flaws, rather than the security guarantee it's often sold as.

If you have questions about our security practices, what we monitor, how we handle third-party integrations, or anything else, [reach out directly](/contact). We'd rather have that conversation than hide behind a logo.
