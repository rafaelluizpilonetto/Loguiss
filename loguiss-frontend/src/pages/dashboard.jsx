import { SideBar } from '../components/Sidebar';

import { Movimentacoes } from '../components/indicators/movimentacoes';
import { AlertaEstoque } from '../components/indicators/alerta-estoque';
import { CardsIndicadores } from '../components/indicators/card-indicadores';

import { produtos } from '../data/dashboardData';

function Dashboard() {

    return (
        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <div className="mb-5">
                    <h1 className="mb-2 mt-2 text-3xl font-bold">
                        Dashboards
                    </h1>

                    <p className="text-gray-400">
                        Visualize as métricas e os indicadores do sistema.
                    </p>
                </div>

                <Movimentacoes />

                <AlertaEstoque produtos={produtos} />

                <CardsIndicadores produtos={produtos} />
            </main>
        </div>
    );
}

export default Dashboard;
