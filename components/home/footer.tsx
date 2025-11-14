import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 py-12 bg-gray-50 dark:bg-[#0A192F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#64FFDA] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#0A192F]" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SkillSync
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The professional collaboration platform for freelancers and
              clients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Demo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#64FFDA] dark:hover:text-[#64FFDA] transition-colors cursor-pointer"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
