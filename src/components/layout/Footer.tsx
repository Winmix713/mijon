export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-muted-foreground">
            © 2024 WinMix TipsterHub. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-primary">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
