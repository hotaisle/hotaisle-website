import { Search, X } from 'lucide-react';

const SEARCH_BUTTON_CLASS_NAME =
	'ha-nav-link inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
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
					className="absolute inset-0 h-full w-full cursor-default bg-background/75 backdrop-blur-sm"
					data-site-search-close
					type="button"
				/>

				<section
					aria-labelledby={SEARCH_DIALOG_TITLE_ID}
					aria-modal="true"
					className="relative mx-auto mt-20 w-[min(calc(100vw-1.5rem),44rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
					role="dialog"
				>
					<div className="flex items-center gap-3 border-border border-b px-4 py-3">
						<Search aria-hidden="true" className="h-5 w-5 shrink-0 text-hot-orange" />
						<h2 className="sr-only" id={SEARCH_DIALOG_TITLE_ID}>
							Site search
						</h2>
						<search className="min-w-0 flex-1">
							<form data-site-search-form>
								<label className="sr-only" htmlFor={SEARCH_INPUT_ID}>
									Search Hot Aisle
								</label>
								<input
									autoComplete="off"
									className="h-11 w-full bg-transparent font-medium text-base text-foreground outline-none placeholder:text-muted-foreground"
									data-site-search-input
									id={SEARCH_INPUT_ID}
									inputMode="search"
									placeholder="Search Hot Aisle"
									type="text"
								/>
							</form>
						</search>
						<button
							aria-label="Close search"
							className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							data-site-search-close
							type="button"
						>
							<X aria-hidden="true" className="h-5 w-5" />
						</button>
					</div>

					<div className="max-h-[min(28rem,calc(100vh-10rem))] overflow-y-auto p-2">
						<div className="space-y-1" data-site-search-results />
						<p
							className="px-3 py-8 text-center text-muted-foreground text-sm"
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
