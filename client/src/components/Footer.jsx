import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12 px-8 text-muted-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-foreground">JobCortex</h3>
          <p>
            Your trusted partner for seamless job searching and recruitment.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-foreground">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-foreground transition">Features</a></li>
            <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
            <li><a href="#" className="hover:text-foreground transition">Integrations</a></li>
            <li><a href="#" className="hover:text-foreground transition">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-foreground">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-foreground transition">About Us</a></li>
            <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
            <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
            <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-foreground">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-foreground transition">Facebook</a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground transition">Twitter</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground transition">LinkedIn</a>
            <a href="#" aria-label="Instagram" className="hover:text-foreground transition">Instagram</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} JobCortex. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
