import LinkButton from "@/components/ui/LinkButton";

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center">
      <div className="max-w-xl mb-12 lg:mb-0 text-center lg:text-left flex-1">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 text-gray-900 dark:text-white">
          Seu Diário de Bordo Acadêmico
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
          Registre suas reflexões, acompanhe suas emoções e acompanhe sua
          evolução pessoal e acadêmica ao longo do semestre.
        </p>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start flex-1">
          <LinkButton
            to="cadastro"
            variant="secondary"
            className="text-md text-nowrap flex items-center justify-center"
          >
            🚀 Começar Agora
          </LinkButton>
          <LinkButton
            to="dashboard"
            variant="neutral"
            className="text-md text-nowrap flex items-center justify-center"
          >
            🔑 Já tenho conta
          </LinkButton>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex justify-center lg:justify-start space-x-4">
          <p>
            <span className="text-amber-500">*</span> Gratuito
          </p>
          <p>
            <span className="text-amber-500">*</span> Seguro
          </p>
          <p>
            <span className="text-amber-500">*</span> Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
}
