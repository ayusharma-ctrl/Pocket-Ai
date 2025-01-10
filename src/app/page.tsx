"use client"

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MainApps, TestApps } from "@/lib/utils";
import { ScrollAnimation } from "@/components/common/ScrollAnimation";
import Styler from "@/components/common/Styler";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <ScrollAnimation direction="right">
          <section className="text-center mb-24">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to 
              <Styler text="Pocket.Ai" className="text-red-400"/>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your personal AI-powered toolkit for everyday tasks and creative endeavors
            </p>
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById('apps');
                element?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              Explore
            </Button>
          </section>
        </ScrollAnimation>

        {/* About Section */}
        <ScrollAnimation direction="left">
          <section className="mb-24 max-w-3xl mx-auto text-justify text-lg text-gray-600 hover:text-gray-900 transition-colors duration-300 group">
            <p className="mb-4">
              Pocket AI is your all-in-one AI assistant, bringing together the power of <span className="group-hover:text-red-400 transition-colors duration-300"> Google Gemini AI, Langchain, OpenAI, and TensorFlow. </span> 
            </p>
            <p id="apps">
              Our suite of AI-powered apps is designed to help you tackle a wide range of tasks, from content creation to data analysis, all from the convenience of your pocket.
            </p>
          </section>
        </ScrollAnimation>

        {/* Main Apps Section */}
        <ScrollAnimation direction="right">
          <section className="mb-24 border rounded-xl p-8 shadow-inner">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
              Main Apps
              <span className="text-xs lg:text-sm font-normal text-red-500"> (SignIn Required*) </span>
            </h2>
            <p className="text-sm lg:text-base text-gray-700 mb-8">
              Explore our core set of AI-powered applications designed to enhance your productivity and creativity.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {MainApps && MainApps.map((app, idx) => (
                <motion.div
                  key={app.label + idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push(app.route)}
                    variant="outline"
                    className={`${app.style} w-full h-full min-h-[120px] text-xs md:text-base lg:text-lg text-wrap font-medium lg:font-semibold shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl`}
                    aria-label={app.label}
                  >
                    {app.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollAnimation>

        {/* Test Apps Section */}
        <ScrollAnimation direction="left">
          <section className="mb-8 border rounded-xl p-8 shadow-inner">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
            Test Apps
          </h2>
          <p className="text-sm lg:text-base text-gray-700 mb-8">
              Get a sneak peek at our experimental AI applications.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {TestApps && TestApps.map((app, idx) => (
                <motion.div
                  key={app.label + idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push(app.route)}
                    variant="outline"
                    className={`${app.style} w-full h-full min-h-[120px] text-xs md:text-base lg:text-lg text-wrap font-medium lg:font-semibold shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl`}
                    aria-label={app.label}
                  >
                    {app.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollAnimation>

      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Pocket AI</h3>
              <p className="text-gray-600">Empowering your digital life with AI</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2025 Pocket AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <Icon className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

