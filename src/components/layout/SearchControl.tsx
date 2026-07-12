import { Search, X } from 'lucide-react';

const SEARCH_BUTTON_CLASS_NAME =
	'ha-nav-link inline-flex min-h-10 min-w-10 items-center justify-center p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const SEARCH_ICON_CLASS_NAME = 'h-4.5 w-4.5';
const SEARCH_DIALOG_TITLE_ID = 'site-search-title';
const SEARCH_INPUT_ID = 'site-search-input';

export function SearchControl() {
	return (
		<>
			<button
				aria-controls="site-search-dialog"
				aria-expanded="false"
				aria-label="Search"
				className={SEARCH_BUTTON_CLASS_NAME}
				data-site-search-toggle
				title="Search"
				type="button"
			>
				<Search aria-hidden="true" className={SEARCH_ICON_CLASS_NAME} />
			</button>

			<div
				className="fixed inset-0 z-50"
				data-site-search-dialog
				hidden
				id="site-search-dialog"
				role="presentation"
			>
				<button
					aria-label="Close search"
					className="absolute inset-0 h-full w-full cursor-default bg-foreground/15 backdrop-blur-sm"
					data-site-search-close
					type="button"
				/>

				<section
					aria-labelledby={SEARCH_DIALOG_TITLE_ID}
					aria-modal="true"
					className="relative mx-auto mt-[max(4rem,12vh)] w-[min(calc(100vw-1.5rem),52rem)] overflow-hidden border border-border bg-background shadow-2xl"
					role="dialog"
				>
					<div className="border-border border-b px-5 py-5 sm:px-6">
						<div className="flex items-start justify-between gap-4">
							<p className="ha-briefing-label pt-1">Search</p>
							<button
								aria-label="Close search"
								className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								data-site-search-close
								type="button"
							>
								<X aria-hidden="true" className="h-4 w-4" />
							</button>
						</div>
						<h2 className="sr-only" id={SEARCH_DIALOG_TITLE_ID}>
							Site search
						</h2>
						<search className="mt-5 block min-w-0">
							<form data-site-search-form>
								<label className="sr-only" htmlFor={SEARCH_INPUT_ID}>
									Search Hot Aisle
								</label>
								<input
									autoComplete="off"
									className="h-12 w-full border-0 bg-transparent font-display text-2xl text-foreground outline-none placeholder:text-muted-foreground sm:text-3xl"
									data-site-search-input
									id={SEARCH_INPUT_ID}
									inputMode="search"
									placeholder="Search the platform"
									type="text"
								/>
							</form>
						</search>
					</div>

					<div className="max-h-[min(30rem,calc(100vh-14rem))] overflow-y-auto">
						<div data-site-search-results />
						<p
							className="px-5 py-12 text-muted-foreground text-sm sm:px-6"
							data-site-search-empty
							hidden
						>
							No results found.
						</p>
					</div>
				</section>
			</div>
		</>
	);
}
