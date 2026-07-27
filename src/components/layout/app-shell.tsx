import { Navbar } from "@/components/layout/navbar";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
