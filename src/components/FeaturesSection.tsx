import { Brain, Clock, Trophy } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Quiz Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, manage, and analyze interactive
            quizzes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
              <Brain className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Questions</h3>
            <p className="text-gray-600">
              Generate quiz questions automatically or organize existing ones
              with our AI assistant.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
              <Clock className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Timed Questions</h3>
            <p className="text-gray-600">
              Set time limits for each question to keep participants engaged and
              add excitement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
              <Trophy className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Leaderboards</h3>
            <p className="text-gray-600">
              Display live rankings after each question to foster friendly
              competition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
