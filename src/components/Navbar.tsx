import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm fixed left-0 right-0 top-0 z-50">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                <Brain />
              </span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              QuizMaster
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* <TempDarkToggle /> */}
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
