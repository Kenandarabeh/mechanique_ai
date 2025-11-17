export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-muted-foreground">جاري التحميل...</p>
        <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
