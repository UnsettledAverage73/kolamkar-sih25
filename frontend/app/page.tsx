import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import dynamic from "next/dynamic"

const MotionDiv = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionDiv), { ssr: false })
const MotionH1 = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionH1), { ssr: false })
const MotionP = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionP), { ssr: false })
const MotionH2 = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionH2), { ssr: false })
const MotionButton = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionButton), { ssr: false })
const MotionSection = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionSection), { ssr: false })
const MotionA = dynamic(() => import("@/components/motion-wrapper").then((mod) => mod.MotionA), { ssr: false })

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <MotionSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-neoLight dark:bg-neoDark py-20 sm:py-32 border-b-4 border-neoDark dark:border-neoCyan"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-playfair font-extrabold tracking-tight text-neoDark dark:text-neoLight sm:text-7xl text-balance leading-tight"
            >
              Discover the Beauty of <span className="text-neoMagenta dark:text-neoMustard">Kolam Designs</span>
            </MotionH1>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-neoDark/80 dark:text-neoLight/80 font-source-sans-pro text-pretty"
            >
              Generate, analyze, and explore traditional South Indian geometric art with modern digital tools. Create
              stunning Kolam patterns and understand their mathematical beauty.
            </MotionP>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="font-extrabold text-lg px-8 py-3 rounded-full bg-neoBlue text-neoLight shadow-neoDark shadow-[6px_6px_0_0_#FFDB58] hover:bg-neoBlue/90 dark:bg-neoCyan dark:text-neoDark dark:shadow-neoMagenta dark:shadow-[6px_6px_0_0_#007BFF] dark:hover:bg-neoCyan/90 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <Link href="/generate">Generate Kolam</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-extrabold text-lg px-8 py-3 rounded-full border-4 border-neoDark text-neoDark bg-transparent shadow-neoDark shadow-[6px_6px_0_0_#FFDB58] hover:bg-neoDark hover:text-neoLight dark:border-neoCyan dark:text-neoLight dark:shadow-neoMagenta dark:shadow-[6px_6px_0_0_#007BFF] dark:hover:bg-neoCyan dark:hover:text-neoDark transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <Link href="/analyze">Analyze Design</Link>
              </Button>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* Sample Kolam Designs */}
      <MotionSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MotionH2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-playfair font-extrabold tracking-tight text-neoDark dark:text-neoLight sm:text-5xl"
            >
              Featured Kolam Patterns
            </MotionH2>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-neoDark/80 dark:text-neoLight/80 font-source-sans-pro"
            >
              Explore the intricate beauty and mathematical precision of traditional designs
            </MotionP>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Lotus Kolam",
                description: "A sacred pattern representing purity and divine beauty",
                complexity: "Intermediate",
                symmetry: "8-fold rotational",
              },
              {
                title: "Geometric Grid",
                description: "Mathematical precision in traditional dot-based patterns",
                complexity: "Advanced",
                symmetry: "4-fold rotational",
              },
              {
                title: "Floral Mandala",
                description: "Nature-inspired circular design with intricate details",
                complexity: "Beginner",
                symmetry: "Radial symmetry",
              },
            ].map((design, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2, boxShadow: "10px 10px 0 rgba(0, 0, 0, 0.2)" }}
                className="group relative bg-neoLight dark:bg-neoDark border-4 border-neoDark dark:border-neoCyan rounded-3xl p-6 shadow-[8px_8px_0_0_#007BFF] dark:shadow-[8px_8px_0_0_#FFDB58] overflow-hidden"
              >
                <CardHeader className="p-0 pb-4">
                  <div className="aspect-square bg-neoBlue/10 dark:bg-neoCyan/10 rounded-2xl mb-4 flex items-center justify-center border-2 border-neoBlue dark:border-neoCyan">
                    <div className="w-32 h-32 bg-neoBlue/20 dark:bg-neoCyan/20 rounded-full flex items-center justify-center animate-spin-slow">
                      <svg className="w-16 h-16 text-neoBlue dark:text-neoCyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-playfair font-bold text-neoDark dark:text-neoLight">{design.title}</CardTitle>
                  <CardDescription className="text-neoDark/70 dark:text-neoLight/70">{design.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neoDark/70 dark:text-neoLight/70 font-source-sans-pro">Complexity:</span>
                      <span className="font-bold text-neoBlue dark:text-neoCyan">{design.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neoDark/70 dark:text-neoLight/70 font-source-sans-pro">Symmetry:</span>
                      <span className="font-bold text-neoBlue dark:text-neoCyan">{design.symmetry}</span>
                    </div>
                  </div>
                </CardContent>
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Cultural Significance */}
      <MotionSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="bg-neoBlue dark:bg-neoMagenta py-16 sm:py-24 border-t-4 border-b-4 border-neoDark dark:border-neoCyan"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <MotionH2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-playfair font-extrabold tracking-tight text-neoLight sm:text-5xl"
              >
                Cultural Heritage
              </MotionH2>
              <MotionP
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-xl leading-relaxed text-neoLight/90 font-source-sans-pro"
              >
                Kolam is a traditional art form from South India, created using rice flour or chalk powder. These
                intricate geometric patterns are drawn at the entrance of homes as a symbol of welcome, prosperity, and
                protection.
              </MotionP>
              <MotionP
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 text-xl leading-relaxed text-neoLight/90 font-source-sans-pro"
              >
                Each design carries deep cultural meaning and represents the harmony between mathematical precision and
                artistic expression, passed down through generations of women.
              </MotionP>
            </div>
            <div>
              <MotionH2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-playfair font-extrabold tracking-tight text-neoLight sm:text-5xl"
              >
                Mathematical Beauty
              </MotionH2>
              <MotionP
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-xl leading-relaxed text-neoLight/90 font-source-sans-pro"
              >
                Kolam patterns demonstrate sophisticated mathematical concepts including symmetry, fractals, and
                algorithmic thinking. The dot-grid system creates endless possibilities for geometric exploration.
              </MotionP>
              <MotionP
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 text-xl leading-relaxed text-neoLight/90 font-source-sans-pro"
              >
                Our digital tools help you understand these mathematical principles while creating and analyzing your
                own unique designs.
              </MotionP>
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  )
}
