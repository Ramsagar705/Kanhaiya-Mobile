const ProductCardSkeleton = () => (
  <article
    className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[20px]"
    aria-hidden="true"
  >
    <div className="relative flex h-32.5 w-full shrink-0 items-center justify-center overflow-hidden bg-[#f4f5f8] p-1.5 sm:h-55 sm:p-5">
      <div className="skeleton-shimmer h-full w-full rounded-lg" />
      <div className="absolute left-2 top-2 h-4 w-14 rounded-full skeleton-shimmer sm:left-4 sm:top-4 sm:h-5 sm:w-20" />
    </div>

    <div className="flex flex-1 flex-col p-2 sm:p-5">
      <div className="flex items-start justify-between gap-1 sm:gap-3">
        <div className="min-h-13 min-w-0 flex-1 sm:min-h-16">
          <div className="mb-1 h-2 w-1/3 rounded skeleton-shimmer sm:mb-2 sm:h-3" />
          <div className="space-y-1.5">
            <div className="h-3 w-4/5 rounded skeleton-shimmer sm:h-4" />
            <div className="h-3 w-3/5 rounded skeleton-shimmer sm:h-4" />
          </div>
        </div>
        <div className="h-6 w-6 shrink-0 rounded-full skeleton-shimmer sm:h-9 sm:w-9" />
      </div>

      <div className="mb-2 mt-2 flex min-h-6 flex-wrap items-center gap-1 sm:mb-3 sm:mt-4 sm:gap-2">
        <div className="h-4 w-14 rounded skeleton-shimmer sm:h-6 sm:w-20" />
        <div className="h-3 w-10 rounded skeleton-shimmer sm:h-4 sm:w-14" />
        <div className="h-3 w-9 rounded skeleton-shimmer sm:h-4 sm:w-12" />
      </div>

      <div className="min-h-8 space-y-1.5 sm:min-h-10">
        <div className="h-2.5 w-full rounded skeleton-shimmer sm:h-3" />
        <div className="h-2.5 w-2/3 rounded skeleton-shimmer sm:h-3" />
      </div>
      <div className="mt-1 min-h-4 flex items-center">
        <div className="h-2.5 w-16 rounded skeleton-shimmer sm:h-3 sm:w-20" />
      </div>

      <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
        <div className="min-h-9 w-full rounded-lg skeleton-shimmer sm:min-h-10 sm:rounded-xl" />
        <div className="min-h-8 w-full rounded-lg skeleton-shimmer sm:min-h-9" />
        <div className="min-h-4 w-2/3 self-center rounded skeleton-shimmer" />
      </div>
    </div>
  </article>
);

export default ProductCardSkeleton;
