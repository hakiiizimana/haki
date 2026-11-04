// The narrow CV column. /videos sits outside this group so it can use the full width.
export default function CvLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto max-w-2xl px-6 text-sm tracking-wide">{children}</main>;
}
