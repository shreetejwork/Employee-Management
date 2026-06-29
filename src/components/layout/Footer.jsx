import { COMPANY } from '../../constants/company';

const Footer = () => (
  <footer className="py-4 px-6 border-t border-border bg-white text-center">
    <p className="text-xs text-text-secondary">
      © {new Date().getFullYear()} {COMPANY.name} All rights reserved.
    </p>
  </footer>
);

export default Footer;
