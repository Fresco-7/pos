import Link from "next/link";
import React from "react";

export default function WhyPos() {
  return (
    <>
      <div>
        <section className="w-full py-12 md:py-24 lg:py-36">
          <div className="container space-y-12 px-4 md:px-6 lg:pb-28">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Streamline Your <span className="text-primary">Kitchen Operations</span></h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  The platform for rapid progress. Let your team focus on shipping features instead of managing
                  infrastructure with automated CI/CD, built-in testing, and integrated collaboration.
                </p>
              </div>
              <div className="grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Infinite scalability, zero config</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable code to run on-demand without needing to manage your own infrastructure or upgrade hardware.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Real-time insights and controls</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get granular, first-party, real-user metrics on site performance per deployment.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Personalization at the edge</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Deliver dynamic, personalized content, while ensuring users only see the best version of your site.
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Infinite scalability, zero config</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable code to run on-demand without needing to manage your own infrastructure or upgrade hardware.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Real-time insights and controls</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get granular, first-party, real-user metrics on site performance per deployment.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Personalization at the edge</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deliver dynamic, personalized content, while ensuring users only see the best version of your site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
