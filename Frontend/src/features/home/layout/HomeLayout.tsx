import React from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import FooterSection from "./FooterSection";
import { IllustrationSection } from "./IlustrationSection";
import { CardSection } from "../components/CardSection";
import HowItWorksSections from "../components/HowItWorksSections";

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home - MindTrack</title>
      </Helmet>

      {/* Cabeçalho */}
      <Header />
      <main className="min-h-screen bg-primary-gradient dark:bg-linear-to-br dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
        {/* Conteúdo Principal */}
        <div className="pt-40 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-8 lg:px-24 lg:space-y-0">
          {/* Seção de Texto (Esquerda) */}
          <HeroSection />
          {/* Seção de Ilustração (Direita) */}
          <IllustrationSection />
        </div>
        <CardSection />
        <HowItWorksSections />
        <FooterSection />
      </main>
    </>
  );
};

export default HomePage;
