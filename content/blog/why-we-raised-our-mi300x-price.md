# Why We Raised Our MI300X Price

Slug: why-we-raised-our-mi300x-price
Publish: Yes
Meta Title: Why Hot Aisle Raised Its MI300X Price
Meta Description: Why Hot Aisle raised new-customer MI300X VM pricing to $2.99 per GPU hour while grandfathering existing customers at $1.99.
Meta Keywords: hot aisle pricing, amd mi300x, amd mi355x, gpu cloud pricing, inference cloud, sovereign inference
Author: Jon Stevens
Date: 07/14/2026
Description: Why our MI300X VM price is changing, what remains the same, and why we believe AMD compute should stand on its own value.
Featured: No
Tags: Announcements, Thoughts

> **TL;DR:** We raised the new-customer MI300X VM price because we are at full capacity and $1.99 no longer reflects the value of a battle-tested service, direct support, and AMD's position in the market. New customers now pay $2.99 per GPU hour, existing customers remain grandfathered at $1.99, and bare metal stays at $3.39.

This deliberate change deserves a direct, transparent explanation.

## We Are At 100% Capacity

Hot Aisle is at 100% capacity. We did not get there by signing one oversized contract or discounting a block of hardware to manufacture utilization. We got there after nearly three years of operating the platform, supporting more than 700 customers, and improving the service through real production use.

The platform we built from the ground up has been tested by developers, startups, research teams, and businesses running very different workloads. Our automation and support model have matured.

We completed SOC 2 Type 2 and HIPAA compliance and moved from "Not Recommended" to Bronze in the [ClusterMAX rating system](https://www.clustermax.ai/v2.1). Bronze is the first tier ClusterMAX recommends, reflecting our work on security, reliability, automation, and customer experience.

AMD's position in the AI infrastructure market has also matured. Its stock price is one clear indicator.

Our price should reflect that reality. We believe $2.99 per GPU hour is fair. At that price, customers receive isolated MI300X compute, minute-level billing, no long-term contract, top tier DC, unmetered internet with IPv4, and direct support from the people who operate the infrastructure. They can pay by credit card or crypto and provision through our terminal UI, API, or CLI without a sales process standing in the way.

We have reached the point where keeping the lowest possible sticker price would mean undervaluing both the hardware and the service around it.

## How We Arrived At $1.99

Our pricing has changed before. When we first launched MI300X capacity, we started above $4, which we learned was too high. There was no public pricing to compare against, and we were still learning what the market would support and how customers would compare a new AMD cloud with established NVIDIA offerings.

On Jun 12, 2025, DigitalOcean and AMD announced the AMD developer cloud at $1.99 per GPU hour. It was a shock because it undercut the assumptions behind our original business plan and financial forecasts. At our size, pricing above them would not differentiate us. It would risk pushing customers to a much larger provider offering the same accelerator for less. It sucked, but we lowered our price to match.

That decision made sense at the time. It helped make MI300X accessible developer compute, [something Dr. Su also piloted with us](https://www.tomshardware.com/pc-components/gpus/dr-lisa-su-broadens-amds-developer-credit-program-hot-aisle-to-serve-as-pilot-provider), kept Hot Aisle competitive, and gave more customers a reason to try AMD. But a defensive price should not permanently define MI300X's value.

DigitalOcean currently lists on-demand MI300X compute at $1.99 per GPU hour and NVIDIA H100 compute immediately beside it at $3.39. We think that gap sends the wrong message. MI300X is not a second-class accelerator. Depending on the workload, its 2.4x memory capacity, inference performance, and economics are competitive with or better than H100. A low price can open a market, but it can also reinforce an outdated assumption that AMD must always be the discount option.

Price matters only when capacity is available. We regularly hear from customers who cannot get DigitalOcean capacity when they need it. We will not build our identity around matching a larger provider with different economics, availability, and customer relationships.

Hot Aisle needs to stand on its own.

## The Difference Is The Operating Model

We are not selling an anonymous GPU endpoint. We have built the provisioning and operating stack around the hardware: inventory, networking, PXE boot, operating systems, ROCm, NUMA-balanced KVM virtual machines, billing, security, and direct access through our developer tools.

Years of feedback have tuned that stack. When something goes wrong, customers reach people who understand the infrastructure because they built and operate it, not someone reading from a script. We monitor the health and legitimate use of the platform, but not the work customers run on it. Bare-metal customers control the whole machine.

Personalized service does not mean a slower sales process. A new customer can still fund an account and provision a VM in under a minute. The service is personal when it needs to be and automated everywhere it should be.

## We Do Not Think Access Should Require A Two-Year Contract

Much of the GPU cloud market is financed around long commitments. Capital providers want predictable contracted revenue, infrastructure companies pass that requirement to customers, and customers carry the downside risk when their needs or the market change.

That structure may make a financing model easier to underwrite, but it often makes compute harder to use. A startup should not need to predict its infrastructure needs two years in advance. A smaller company should not be locked out because it cannot make the same commitment as a hyperscaler or a heavily funded AI lab. A team should not continue paying for unused capacity through a downturn simply because the provider financed hardware against its contract.

We offer a different relationship: pay for the compute you need, use it as long as you need it, and leave when the work is done. Bare metal has a one-month minimum because dedicating a complete physical system requires a different operating commitment. An agreement lets us pull compute from a long-standing customer when needed, but we have subsidized their compute at the lower rate for a long time. VMs remain self-service and billed by the minute, and we occasionally put bare metal into the on-demand pool as well.

We believe that flexibility helps AI adoption by serving the long tail of the market. It gives smaller teams room to experiment, build, and grow without marching to the capital schedule of the largest players in the market.

## A Business That Can Stand On Its Own

We are entering a new stage as a company as the market shifts again. More capital groups and strategic operators [are taking an interest in Hot Aisle](https://www.hotaisle.xyz/investors). We are in active discussions about growth investment, strategic combinations, and potential acquihire structures.

Those conversations do not change how we treat customers. They make it more important to show that Hot Aisle is a durable, ethical, and honest business with sound unit economics. We have spent nearly three years building the platform, operating the infrastructure, and earning customer trust. The business should stand on its own rather than depend on an artificially low price. Even Uber and Airbnb eventually reached the point where investors expected sustainable economics.

The demand is visible. We have a queue of customers waiting for MI300X capacity and another asking for MI355X systems. Capital would let us serve more of that demand, but disciplined pricing is part of using that capital responsibly. It is nothing personal. This is a business after all.

## We Believe MI355X Will Have A Long Life

MI355X strengthens the case for AMD infrastructure, and we're working hard to [fundraise](https://www.hotaisle.xyz/fundraise) to deploy as much of it as we can. [AMD's CDNA 4 architecture](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) expands support for the lower-precision formats modern inference workloads use, including MXFP4, MXFP6, MXFP8, and OCP FP8. That narrows the compatibility gap for software optimized around NVIDIA hardware and makes it easier to bring existing inference work to AMD.

The next generation does not make MI355X obsolete. MI455X and [AMD's Helios architecture](https://www.amd.com/en/products/rackscale-solutions/helios.html) represent a different class of 72-GPU rack-scale system, with different power, cooling, networking, and deployment requirements. MI355X remains an unusually capable eight-GPU building block for organizations that need dense sovereign inference compute without adopting an entire rack-scale architecture.

We expect MI355X demand to remain strong for years, just as MI300X demand has remained strong after newer accelerators entered the roadmap. Our full capacity and customer queue give us the confidence to price MI300X for its value rather than discount it away.

## To Our Early Customers, Thank You

To the early customers who supported us: thank you. We would not be here without your patience, candid feedback, and dedication to AMD compute. You helped us turn an ambitious infrastructure project into a battle-tested service, and we have not forgotten who gave us that opportunity.

## What Changes And What Does Not

The new-customer MI300X VM price is $2.99 per GPU hour. Existing Hot Aisle customers stay at $1.99 per GPU hour. MI300X bare metal stays at $3.39 per GPU hour with a one-month minimum.

Everything important about the service remains the same: no multi-year contract (unless you really want one), no required sales call, minute-level VM billing, isolated compute, full developer access, and support from the team operating the platform.

We are no longer pricing Hot Aisle as an alternative that needs to apologize for being built on AMD. We are pricing it as a reliable compute platform with a proven operating history, strong demand, and a service model we believe is better for customers. We've always said that we want to be the best compute platform for AI workloads, and we're committed to delivering on that promise.
