import MindTrackBlue from "../../../assets/MindTracksemfund-blue.png";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import LinkButton from "@/components/ui/LinkButton";
import { FaPlus, FaSignInAlt } from "react-icons/fa";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="justify-center px-4 sm:px-10 lg:px-20 py-4 fixed top-0 left-0 right-0 bg-linear-to-tr from-[#fff8f3] to-[#f3eef0] dark:from-gray-900 dark:to-gray-800 z-50 flex">
      <div className="w-full max-w-screen-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src={MindTrackBlue}
            alt="MindTrack logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain cursor-pointer"
          />
          <span className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white -ml-1 cursor-pointer">
            MindTrack
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            title={
              theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
            }
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <LinkButton
            to="dashboard"
            variant="tertiary"
            className="text-sm"
            title="Entrar"
          >
            <span className="hidden xs:block">Entrar</span>
            <FaSignInAlt className="size-4 inline xs:hidden" />
          </LinkButton>
          <LinkButton
            to="cadastro"
            variant="secondary"
            className="text-sm px-3 py-2"
            title="Cadastrar"
          >
            <span className="hidden xs:block">Cadastrar</span>
            <FaPlus className="size-4 inline xs:hidden" />
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
