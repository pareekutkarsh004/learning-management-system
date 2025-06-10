function Home() {
  return (
    <div className='relative w-full'>
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full min-h-screen z-[-1] bg-gradient-to-b from-cyan-100/70 to-white"></div>

      {/* Actual Content */}
      <div className='flex flex-col items-center text-center space-y-7 relative z-10 w-full'>
        <Hero />
        <Companies />
        <CourseSection />
        <TestimonialSections />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
