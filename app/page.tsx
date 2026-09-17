import Header from "@/components/layout/Header";
import ProgressArcs from "@/components/layout/ProgressArcs";
import MotifLayer from "@/components/motif/MotifLayer";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Continuation from "@/components/sections/Continuation";
import Between from "@/components/sections/Between";
import Intelligence from "@/components/sections/Intelligence";
import Value from "@/components/sections/Value";
import Pulse from "@/components/sections/Pulse";
import People from "@/components/sections/People";
import Membership from "@/components/sections/Membership";
import Process from "@/components/sections/Process";
import Request from "@/components/sections/Request";

export default function Home() {
  return (
    <>
      <Header />
      <ProgressArcs />
      <main>
        <MotifLayer />
        <Hero />
        <Problem />
        <Continuation />
        <Between />
        <Intelligence />
        <Value />
        <Pulse />
        <People />
        <Membership />
        <Process />
        <Request />
      </main>
      <Footer />
    </>
  );
}
