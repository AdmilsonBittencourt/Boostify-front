import HeaderHome from "@/components/headerHome";
import CadastroDeTarefa from "../cadastro-de-tarefa/page";

export default function HomePage(){
    return (
        <div className="h-screen overflow-hidden">
            <HeaderHome />
            <CadastroDeTarefa />
        </div>
    );
}