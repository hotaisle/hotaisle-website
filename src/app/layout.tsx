import { initializeBlogImageModalScript } from '@/app/blog-image-modal-script.ts';
import { initializeCopyCommandScript } from '@/app/copy-command-script.ts';
import { initializeHeroStarsScript } from '@/app/hero-stars-script.ts';
import { initializeMachineStatusScript } from '@/app/machine-status-script.ts';
import { initializeMobileNavScript } from '@/app/mobile-nav-script.ts';
import { initializeThemeScript } from '@/app/theme-script.ts';
import { initializeWebMcpScript } from '@/app/webmcp-script.ts';
import { Footer } from '@/components/layout/Footer.tsx';
import { Navbar } from '@/components/layout/Navbar.tsx';
import JsonLd from '@/components/seo/JsonLd.tsx';
import './globals.css';
import type * as React from 'react';

const GTM_CONTAINER_ID = 'GTM-NK8WLZV8';
const GOOGLE_FONTS_ORIGIN = 'https://fonts.googleapis.com';
const GOOGLE_FONTS_STATIC_ORIGIN = 'https://fonts.gstatic.com';
const GTM_ORIGIN = 'https://www.googletagmanager.com';
const SITE_URL = 'https://hotaisle.xyz';
const ENABLE_GTM = import.meta.env.VITE_ENABLE_GTM === 'true';
const FONT_STYLESHEET_URL =
	'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Sora:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap';
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`;
const BLOG_IMAGE_MODAL_SCRIPT = `(${initializeBlogImageModalScript.toString()})();`;
const COPY_COMMAND_SCRIPT = `(${initializeCopyCommandScript.toString()})();`;
const HERO_STARS_SCRIPT = `(${initializeHeroStarsScript.toString()})();`;
const MACHINE_STATUS_SCRIPT = `(${initializeMachineStatusScript.toString()})();`;
const MOBILE_NAV_SCRIPT = `(${initializeMobileNavScript.toString()})();`;
const THEME_SCRIPT = `(${initializeThemeScript.toString()})();`;
const WEB_MCP_SCRIPT = `(${initializeWebMcpScript.toString()})();`;

export const metadata = {
	title: 'Hot Aisle - AMD Exclusive AI Cloud',
	description:
		'AMD GPU cloud for AI and HPC workloads. MI300X instances, cluster design, networking, and direct human support.',
	alternates: {
		canonical: SITE_URL,
	},
	robots: {
		follow: true,
		index: true,
	},
	openGraph: {
		title: 'Hot Aisle - AMD Exclusive AI Cloud',
		description:
			'AMD GPU cloud for AI and HPC workloads. MI300X instances, cluster design, networking, and direct human support.',
		images: [
			{
				alt: 'Hot Aisle branded share image',
				height: 630,
				url: `${SITE_URL}/assets/og/hot-aisle-share.png`,
				width: 1200,
			},
		],
		locale: 'en_US',
		siteName: 'Hot Aisle',
		type: 'website',
		url: SITE_URL,
	},
	twitter: {
		card: 'summary_large_image',
		description:
			'AMD GPU cloud for AI and HPC workloads. MI300X instances, cluster design, networking, and direct human support.',
		images: [
			{
				alt: 'Hot Aisle branded share image',
				height: 630,
				url: `${SITE_URL}/assets/og/hot-aisle-share.png`,
				width: 1200,
			},
		],
		title: 'Hot Aisle - AMD Exclusive AI Cloud',
	},
	icons: {
		icon: '/assets/branding/hotaisle-favicon.svg',
		shortcut: '/assets/branding/hotaisle-favicon.svg',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<JsonLd />
				<link href={GOOGLE_FONTS_ORIGIN} rel="preconnect" />
				<link crossOrigin="" href={GOOGLE_FONTS_STATIC_ORIGIN} rel="preconnect" />
				<link href={FONT_STYLESHEET_URL} rel="stylesheet" />
				{ENABLE_GTM && <link href={GTM_ORIGIN} rel="preconnect" />}
				{ENABLE_GTM && <link crossOrigin="" href={GTM_ORIGIN} rel="dns-prefetch" />}
				<script>{BLOG_IMAGE_MODAL_SCRIPT}</script>
				<script>{COPY_COMMAND_SCRIPT}</script>
				<script>{HERO_STARS_SCRIPT}</script>
				<script>{MACHINE_STATUS_SCRIPT}</script>
				<script>{MOBILE_NAV_SCRIPT}</script>
				<script>{THEME_SCRIPT}</script>
				<script>{WEB_MCP_SCRIPT}</script>
				{ENABLE_GTM && <script>{GTM_SCRIPT}</script>}
			</head>
			<body>
				{ENABLE_GTM && (
					<noscript>
						<iframe
							height="0"
							src={`${GTM_ORIGIN}/ns.html?id=${GTM_CONTAINER_ID}`}
							style={{ display: 'none', visibility: 'hidden' }}
							title="Google Tag Manager"
							width="0"
						/>
					</noscript>
				)}
				<div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
					<Navbar />
					<main className="relative min-w-0 flex-1">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
