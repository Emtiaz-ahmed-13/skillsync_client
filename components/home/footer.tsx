import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-heading">
                SkillSync
              </span>
            </div>
            <p className="text-body">
              The professional collaboration platform for freelancers and
              clients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-primary-heading text-lg">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Demo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-primary-heading text-lg">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-primary-heading text-lg">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body hover:text-primary-heading transition-colors cursor-pointer"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-secondary">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
