import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";

export default function LegalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
