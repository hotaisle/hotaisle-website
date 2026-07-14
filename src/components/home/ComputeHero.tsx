import { ArrowRight, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { MI300X_VM_PRICE } from '@/lib/pricing.ts';

export function ComputeHero() {
	const rackDepths = [16, -36, -88, -140, -192, -244, -296, -348];

	return (
		<section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background">
			{/* Background Ambience */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-200 via-background to-background opacity-60 dark:from-neutral-800 dark:via-neutral-950 dark:to-neutral-950" />

			{/* 3D Translucent Datacenter Hall */}
			<div className="hall-wrapper mt-10 mb-10 scale-[1.05] md:scale-[1.45]">
				<div className="hall-scene">
					<div className="hall-shell">
						<div className="rack-lane rack-lane-left rack-lane-left-outer">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`left-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-left rack-lane-left-inner">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`left-inner-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-center rack-lane-center-left">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`center-left-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-center rack-lane-center-right">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`center-right-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-right rack-lane-right-inner">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`right-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-right rack-lane-right-outer">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`right-outer-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>

						<div className="rack-lane rack-lane-right rack-lane-right-far">
							{rackDepths.map((depth) => (
								<div
									className="rack"
									key={`right-far-${depth}`}
									style={{ transform: `translateZ(${depth}px)` }}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
				<div className="mb-10">
					<img
						alt="Hot Aisle"
						className="mx-auto h-20 w-auto object-contain md:h-28"
						height={80}
						src="/hotaisle-logo.svg"
						width={260}
					/>
				</div>
				<p className="mx-auto mb-10 max-w-2xl font-light text-muted-foreground text-xl md:text-3xl">
					<span className="font-semibold text-hot-orange">AMD Exclusive AI Cloud</span>
				</p>

				<div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
					<AppLink
						className="group relative overflow-hidden rounded-full bg-hot-orange px-8 py-4 font-bold text-lg text-white shadow-hot-orange/30 shadow-lg transition-all hover:scale-105 hover:opacity-90 hover:shadow-hot-orange/50"
						href="/quick-start"
					>
						<div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
						<div className="relative flex items-center gap-2">
							Start in 60 Seconds <Zap className="h-5 w-5 fill-current" />
						</div>
					</AppLink>
					<AppLink
						className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-8 py-4 font-bold text-foreground text-lg transition-all hover:bg-muted"
						href="/pricing"
					>
						See Pricing <ArrowRight size={18} />
					</AppLink>
				</div>

				<p className="mt-6 text-base text-muted-foreground opacity-80">
					No Contracts. No Commitments. No Drama. Just {MI300X_VM_PRICE}.
				</p>
			</div>

			<style>{`
        .hall-wrapper {
          display: flex;
          justify-content: center;
        }

        .hall-scene {
          position: relative;
          width: 390px;
          height: 265px;
          perspective: 1150px;
          perspective-origin: 50% 32%;
        }

        .hall-shell {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: hall-sway 8.5s ease-in-out infinite;
        }

        .rack-lane {
          position: absolute;
          top: 40px;
          width: 42px;
          height: 148px;
          transform-style: preserve-3d;
        }

        .rack-lane-left {
          left: 6px;
        }

        .rack-lane-left-inner {
          left: 62px;
        }

        .rack-lane-center-left {
          left: 118px;
        }

        .rack-lane-center-right {
          left: 174px;
        }

        .rack-lane-right {
          left: 286px;
        }

        .rack-lane-right-inner {
          left: 230px;
        }

        .rack-lane-right-far {
          left: 342px;
        }

        .rack {
          width: 42px;
          height: 148px;
          border: 1px solid rgba(206, 218, 250, 0.22);
          border-radius: 6px;
          background:
            repeating-linear-gradient(
              180deg,
              rgba(212, 224, 255, 0.1) 0 4px,
              rgba(22, 30, 42, 0.9) 4px 10px
            ),
            linear-gradient(180deg, rgba(78, 88, 112, 0.22), rgba(20, 24, 34, 0.85));
          box-shadow:
            0 0 10px rgba(6, 10, 18, 0.4),
            inset 0 0 14px rgba(180, 200, 255, 0.05);
          transform-style: preserve-3d;
          position: absolute;
          left: 0;
          top: 0;
        }

        .rack::before,
        .rack::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
        }

        .rack::before {
          top: 10px;
          left: 10px;
          background: #ffd93d;
          box-shadow: 0 0 8px rgba(255, 217, 61, 0.9);
          animation: blink-blue 2.2s steps(1, end) infinite;
        }

        .rack::after {
          top: 21px;
          left: 23px;
          background: #f97316;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.9);
          animation: blink-orange 2.8s steps(1, end) infinite;
        }

        .rack:nth-child(2n)::before {
          animation-duration: 1.7s;
          animation-delay: -0.6s;
        }

        .rack:nth-child(3n)::before {
          animation-duration: 2.9s;
          animation-delay: -1.1s;
        }

        .rack:nth-child(4n)::before {
          animation-duration: 2.1s;
          animation-delay: -0.3s;
        }

        .rack:nth-child(2n)::after {
          animation-duration: 2.4s;
          animation-delay: -1.2s;
        }

        .rack:nth-child(3n)::after {
          animation-duration: 3.1s;
          animation-delay: -0.8s;
        }

        .rack:nth-child(5n)::after {
          animation-duration: 1.9s;
          animation-delay: -0.4s;
        }

        @keyframes hall-sway {
          0% {
            transform: rotateX(-24deg) rotateY(-12deg);
          }
          50% {
            transform: rotateX(-24deg) rotateY(12deg);
          }
          100% {
            transform: rotateX(-24deg) rotateY(-12deg);
          }
        }

        @keyframes blink-blue {
          0%,
          12%,
          38%,
          64%,
          100% {
            opacity: 1;
          }
          13%,
          14%,
          39%,
          41%,
          65%,
          68% {
            opacity: 0.15;
          }
        }

        @keyframes blink-orange {
          0%,
          18%,
          44%,
          73%,
          100% {
            opacity: 1;
          }
          19%,
          22%,
          45%,
          47%,
          74%,
          78% {
            opacity: 0.1;
          }
        }

      `}</style>
		</section>
	);
}
