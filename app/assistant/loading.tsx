import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3" aria-busy="true" aria-live="polite">
      <Spinner className="h-8 w-8 text-green-600" />
      <span className="text-sm text-muted-foreground">Loading assistant…</span>
      <span className="sr-only">Assistant is loading</span>
    </div>
  )
}
