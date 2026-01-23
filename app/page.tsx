import CanvasSequence from "@/components/ScrollyTelling/CanvasSequence";
import StoryOverlay from "@/components/ScrollyTelling/StoryOverlay";
import Navbar from "@/components/UI/Navbar";
import Footer from "@/components/UI/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prism Earbuds | Silence, Perfected',
  description: 'Experience the next generation of noise cancelling technology.',
};

export default function Home() {
  return (
    <>
      <main className="relative w-full bg-primary min-h-[600vh]">
        <Navbar />

        {/* Sticky Container */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-radial-gradient from-[#050815] to-primary opacity-60 pointer-events-none" />

          {/* The Product Sequence */}
          <CanvasSequence frameCount={452} />

          {/* The Text Overlay */}
          <StoryOverlay />
        </div>
      </main>
      <Footer />
    </>
  );
}
