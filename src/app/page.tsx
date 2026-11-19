"use client";

import dynamic from "next/dynamic";
import { ScrollDriver } from "@/components/ScrollDriver";
import { Gate } from "@/components/ui/Gate";
import { Header } from "@/components/ui/Header";
import { Customizer, Rulers, SoundToggle } from "@/components/ui/Controls";
import {
  Contact,
  Gallery,
  Hold,
  Insight,
  Manifesto,
  Orbit,
  Paradox,
  Person,
  Process,
  Proof,
} from "@/components/sections/Sections";

const World = dynamic(() => import("@/components/scene/World"), { ssr: false });

export default function Home() {
  return (
    <>
      <World />
      <ScrollDriver />
      <Gate />
      <Header />
      <Rulers />
      <SoundToggle className="fixed left-4 bottom-4 md:left-8 md:bottom-8 z-40" />
      <Customizer />
      <main className="relative z-10 overflow-x-clip">
        <Manifesto />
        <Hold />
        <Paradox />
        <Orbit />
        <Process />
        <Proof />
        <Insight />
        <Gallery />
        <Person />
        <Contact />
      </main>
    </>
  );
}
