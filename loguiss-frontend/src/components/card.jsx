import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { cn } from '../utils/cn';
import { Button } from './button';

function CardBase({ children, className }) {
    return (
        <div
            className={cn(
                'rounded-lg border border-borda border-l-4 border-l-primaria bg-superficie p-5 transition-colors hover:border-l-primaria-hover',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function StatCard({
    titulo,
    valor,
    icone: Icon,
    descricao,
    subDescricao,
    tituloClassName = 'text-xl',
}) {
    return (
        <CardBase>
            <div className="flex items-center justify-between">
                <h2 className={`font-bold text-texto ${tituloClassName}`}>{titulo}</h2>
                {Icon && <Icon size={24} className="text-primaria" />}
            </div>
            <div className="mt-5 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-texto">{valor}</p>

                {descricao && <span className="text-sm text-texto-suave">{descricao}</span>}
            </div>
            {subDescricao && (
                <span className="text-xs font-semibold text-primaria">{subDescricao}</span>
            )}
        </CardBase>
    );
}

export function EntityCard({ titulo, icone: Icon, onEdit, onDelete, children }) {
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    const confirmarExclusao = async () => {
        try {
            await onDelete?.();
            setModalExclusaoAberto(false);
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    return (
        <>
            <CardBase>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-texto">{titulo}</h2>
                    {Icon && <Icon className="h-6 w-6 text-texto-suave" />}
                </div>

                {children}

                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        variant="primary"
                        size="icon"
                        aria-label={`Editar ${titulo}`}
                        onClick={onEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="danger"
                        size="icon"
                        aria-label={`Excluir ${titulo}`}
                        onClick={() => setModalExclusaoAberto(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardBase>

            {modalExclusaoAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-exclusao"
                        className="w-full max-w-md overflow-hidden rounded-xl border border-borda border-l-4 border-l-red-500 bg-superficie shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                    >
                        <div className="flex items-center gap-3 border-b border-borda p-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
                                <Trash2 size={22} className="text-red-500" />
                            </div>

                            <div>
                                <h2
                                    id="titulo-modal-exclusao"
                                    className="text-xl font-bold text-texto"
                                >
                                    Confirmar exclusão
                                </h2>

                                <p className="text-xs text-texto-suave">
                                    Essa ação não poderá ser desfeita
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="text-sm leading-relaxed text-texto-suave">
                                Tem certeza de que deseja excluir:
                            </p>

                            <div className="mt-3 rounded-lg border border-borda bg-elevada/50 p-4">
                                <p className="font-bold text-texto">{titulo}</p>
                            </div>

                            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-500/10 p-3">
                                <Trash2 size={16} className="mt-0.5 shrink-0 text-red-500" />

                                <p className="text-xs leading-relaxed text-red-400">
                                    Ao confirmar, o registro será excluído permanentemente.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-borda px-5 py-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setModalExclusaoAberto(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                variant="danger"
                                onClick={confirmarExclusao}
                            >
                                Confirmar exclusão
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function CustomCard({ children, className }) {
    return <CardBase className={className}>{children}</CardBase>;
}