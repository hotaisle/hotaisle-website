---
title: "Dr. Moritz Lehmann on LinkedIn: Hot Aisle Inc.'s 8x AMD MI300X server is the fastest computer I've ever tested in FluidX3D CFD"
slug: "dr-moritz-lehmann-linkedin-hot-aisle-8x-amd-mi300x-fastest-fluidx3d-cfd"
publish: true
metaTitle: "Hot Aisle's 8x MI300X is the fastest FluidX3D machine"
metaDescription: "Hot Aisle's 8x MI300X is the fastest FluidX3D machine"
metaKeywords: "Hot Aisle, AMD MI300X, FluidX3D, CFD, high-performance computing, GPGPU, OpenCL, CUDA alternative, MI300X vs GH200, multi-GPU benchmarks, AMD vs Nvidia, AI compute, HPC, supercomputing, VRAM bandwidth, GLUPs performance"
author: "Jon Stevens"
date: "03/03/2025"
description: "Hot Aisle Inc.'s 8x AMD MI300X Server Sets a New Performance Benchmark in FluidX3D CFD\nDr. Moritz Lehmann reports that Hot Aisle Inc.'s 8x AMD MI300X server is the fastest machine he has ever tested, achieving 205 GLUPs/s and 23 TB/s VRAM bandwidth in FluidX3D CFD. This system outperforms all competitors, leaving even Nvidia's GH200 and RTX 5090 far behind. With CUDA no longer the performance leader, OpenCL emerges as the key to unlocking AMD’s superior hardware.\nFluidX3D is fully OpenCL-compatible, running seamlessly across AMD, Intel, Nvidia, and Apple GPUs. Full benchmarks and source code available on https://github.com/ProjectPhysX/FluidX3D.\nSpecial thanks to Jon Stevens & Clint Armstrong for providing access to Hot Aisle's cutting-edge system!"
featured: false
tags: ["GPU"]
---

# Hot Aisle Inc.'s 8x AMD MI300x server is the fastest computer I've ever tested in FluidX3D CFD, achieving a peak LBM performance of 205 GLUPs/s, and a combined VRAM bandwidth of 23 TB/s.

In terms of performance it leaves every other computer I've seen behind in the dust. The RTX 5090 - the fastest consumer GPU in the world - looks like a toy in comparison.

This marks a very fascinating inflection point in GPGPU compute:

CUDA is not the performance leader anymore.
MI300X beats even Nvidia's GH200 94GB. You need a cross-vendor language like

OpenCL to leverage its power. CUDA vendor-lock now only penalizes both developers and users to not be able to use the faster AMD GPUs.
Good thing FluidX3D is written in OpenCL and runs natively on all AMD/Intel/Nvidia/Apple GPUs and CPUs out-of-the-box.
Find the FluidX3D software & full source code on

GitHub: [https://github.com/ProjectPhysX/FluidX3D](https://github.com/ProjectPhysX/FluidX3D)

Full benchmark charts & tables: [https://github.com/ProjectPhysX/FluidX3D?tab=readme-ov-file#multi-gpu-benchmarks](https://github.com/ProjectPhysX/FluidX3D?tab=readme-ov-file#multi-gpu-benchmarks)

Thank you Jon Stevens and Clint Armstrong for letting me test your Hot Aisle Inc. machine! Was up and running literally within 5 minutes, couldn't be easier.
