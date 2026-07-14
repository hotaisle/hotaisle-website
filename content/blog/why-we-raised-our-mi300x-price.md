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

> **TL;DR:** We raised the new-customer MI300X VM price because we are at 100% capacity and $1.99 no longer reflects the value of a battle-tested service, direct support, and AMD's position in the market. New customers now pay $2.99 per GPU hour, existing customers remain grandfathered at $1.99, and bare metal stays at $3.39.

This is a deliberate change, and our customers deserve a longer, direct and transparent explanation.

## We Are At 100% Capacity

Hot Aisle is currently at 100% capacity. That did not happen because we signed one oversized contract or discounted a block of hardware to manufacture utilization. It happened after nearly three years of operating the platform, supporting more than 700 customers, and improving the service through real production use.

The platform we have custom built from the ground up has been tested across developers, startups, research teams, and businesses with very different workloads. Our automation and our support model has matured.

We completed SOC 2 Type 2 and HIPAA compliance, and moved from "Not Recommended" to a Bronze Tier provider in the [ClusterMAX rating system](https://www.clustermax.ai/v2.1). Bronze is the first tier ClusterMAX recommends, and that progression reflects the work we put into security, reliability, automation, and the overall customer experience. 

I believe that we are all aware that AMD's position in the AI infrastructure market has also matured. The stock price is a great indicator of that maturity.

The price of our own service should reflect that reality. We believe $2.99 per GPU hour is fair. Customers receive isolated MI300X compute, minute-level billing, no long-term contract, and direct support from the people who operate the infrastructure. They can start with a credit card and provision through our terminal UI, API, or CLI without a sales process standing in the way.

We have reached the point where keeping the lowest possible sticker price would mean undervaluing both the hardware and the service around it.

## How We Arrived At $1.99

Our pricing has changed before. When we first launched MI300X capacity, we started too high (above $4). At the time, there wasn't even public pricing we could compare against. We were still learning what the market would support and how customers would compare a new AMD cloud against established NVIDIA offerings.

On Jun 12, 2025, DigitalOcean and AMD announced the AMD developer cloud at $1.99 per GPU hour. It was a shock to us because it undercut the assumptions behind our original business plan and financial forecasts. At our size, leaving our price above theirs was not an act of differentiation. It was a serious risk that customers would move to a much larger provider offering the same accelerator for less. It sucked, but we lowered our price to match.

That decision made sense at the time. It helped establish MI300X as accessible developer compute, [something Dr. Su piloted with us as well](https://www.tomshardware.com/pc-components/gpus/dr-lisa-su-broadens-amds-developer-credit-program-hot-aisle-to-serve-as-pilot-provider), kept Hot Aisle competitive, and gave more customers a reason to try AMD. But a defensive price should not become a permanent definition of value.

DigitalOcean currently lists on-demand MI300X compute at $1.99 per GPU hour and NVIDIA H100 compute immediately beside it at $3.39. We think that gap sends the wrong message. MI300X is not a second-class accelerator. Depending on the workload, its 2.4x memory capacity, inference performance, and economics are competitive with or better than H100. A low price can open a market, but it can also reinforce an outdated assumption that AMD must always be the discount option.

Price is only useful when capacity is actually available. We regularly hear from customers who cannot get the DigitalOcean capacity when they need it. We are not interested in building our identity around matching a larger provider whose economics, availability, and customer relationship are different from ours.

Hot Aisle needs to stand on its own.

## The Difference Is The Operating Model

We are not selling an anonymous GPU endpoint. We have built the provisioning and operating stack around the hardware: inventory, networking, PXE boot, operating systems, ROCm, NUMA-balanced KVM virtual machines, billing, security, and direct access through our developer tools.

That stack has been tuned through years of feedback. When something goes wrong, customers can reach people who understand the infrastructure because they built and operate it. Not someone who's just reading from a script. We monitor the health and legitimate use of the platform, but not the work customers run on it. Bare-metal customers control the whole machine.

Personalized service does not mean a slower sales process. A new customer can still fund an account and provision a VM in under a minute. The service is personal when it needs to be and automated everywhere it should be.

## We Do Not Think Access Should Require A Two-Year Contract

Much of the GPU cloud market is financed around long commitments. Capital providers want predictable contracted revenue, infrastructure companies pass that requirement to customers, and customers end up carrying the downside risk if their needs or the market changes.

That structure may make a financing model easier to underwrite, but it often makes compute harder to use. A startup should not need to predict its infrastructure needs two years in advance. A smaller company should not be locked out because it cannot make the same commitment as a hyperscaler or a heavily funded AI lab. A team should not continue paying for unused capacity through a downturn simply because the provider financed hardware against its contract.

We want to offer a different relationship: pay for the compute you need, use it for as long as you need it, and leave when the work is done. Bare metal has a one-month minimum because dedicating a complete physical system requires a different operating commitment for us today. We have an agreement that we can pull compute from an existing customer who has been great to us, but we've been subsidizing their compute at the lower rate, for a long time now. VMs remain self-service and billed by the minute and occassionally we will put a BM into the on-demand pool as well.

We believe that flexibility helps AI adoption. It gives smaller teams room to experiment, build, and grow without marching to the capital schedule of the largest players in the market.

## A Business That Can Stand On Its Own

We are also entering a different stage as a company and the market dynamics are shifting yet again. More capital groups and strategic operators [are taking an interest in Hot Aisle](https://www.hotaisle.xyz/investors). We are in active discussions covering growth investment, strategic combinations, and potential acquihire structures.

Those conversations do not change how we treat customers. They do increase the importance of showing that Hot Aisle is a durable, ethical, and honest business with sound unit economics. We have spent nearly three years building the platform, operating the infrastructure, and earning customer trust. We should be able to demonstrate that the business can stand on its own rather than depending on an artificially low price. Don't forget that at some point, Uber and Airbnb VC decided enough is enough.

The demand is already visible. We have a queue of customers waiting for current MI300X capacity and another group consistently asking for access to MI355X systems. Capital would let us serve more of that demand, but disciplined pricing is part of being ready to use that capital responsibly. It is nothing personal, this is a business after all.

## We Believe MI355X Will Have A Long Life

MI355X strengthens the case for AMD infrastructure and we're working hard to [fundraise](https://www.hotaisle.xyz/fundraise) to deploy as much of it as we can. [AMD's CDNA 4 architecture](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) adds expanded support for the lower-precision formats modern inference workloads use, including MXFP4, MXFP6, MXFP8, and OCP FP8. That narrows the compatibility gap for software originally optimized around NVIDIA hardware, and makes it easier for teams to bring existing inference work to AMD.

The next generation does not make MI355X obsolete. MI455X and [AMD's Helios architecture](https://www.amd.com/en/products/rackscale-solutions/helios.html) represent a different class of 72-GPU rack-scale system, with different power, cooling, networking, and deployment requirements. MI355X remains an unusually capable eight-GPU building block for organizations that need dense sovereign inference compute without adopting an entire rack-scale architecture.

We expect MI355X demand to remain strong for years, just as MI300X demand has remained strong after newer accelerators entered the roadmap. Our current capacity and customer queue finally gives us enough confidence in MI300X to raise its price rather than discount it away.

## To Our Early Customers, Thank You

To the early customers who supported us: thank you. We would not be here without your patience, candid feedback, and dedication to AMD compute. You helped us turn an ambitious infrastructure project into a battle-tested service, and we have not forgotten who gave us that opportunity.

## What Changes And What Does Not

The new-customer MI300X VM price is $2.99 per GPU hour. Existing Hot Aisle customers stay at $1.99 per GPU hour. MI300X bare metal stays at $3.39 per GPU hour with a one-month minimum.

Everything important about the service remains the same: no multi-year contract (unless you really want one), no required sales call, minute-level VM billing, isolated compute, full developer access, and support from the team operating the platform.

We are no longer pricing Hot Aisle as an alternative that needs to apologize for being built on AMD. We are pricing it as a reliable compute platform with a proven operating history, strong demand, and a service model we believe is better for customers.
