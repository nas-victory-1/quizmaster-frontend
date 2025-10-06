import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "This feature is currently under development. Check back soon!",
  showBackButton = true,
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <Rocket className="w-24 h-24 text-purple-600 dark:text-purple-400 relative animate-bounce" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {description}
        </p>

        {showBackButton && (
          <Link href="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
