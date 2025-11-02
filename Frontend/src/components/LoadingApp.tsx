import { LucideLoader2 } from "lucide-react";
import MindLog from "@/assets/MindTrack.png";

export default function LoadingApp() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-primary-gradient">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <img
              className="size-10 rounded-2xl shadow-md"
              src={MindLog}
              alt="MindTrack Logo"
            />
            <h1 className="font-bold text-3xl">MindTrack</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex whitespace-nowrap">
            Diário de Bordo Acadêmico
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LucideLoader2 className="animate-spin size-8 text-blue-500" />
          <p className=" text-lg">Carregado dados do app...</p>
        </div>
      </div>
    </div>
  );
}
