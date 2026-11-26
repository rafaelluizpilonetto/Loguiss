import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { Button } from './button';

export function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    titulo = 'Excluir registro',
    descricao = 'Tem certeza de que deseja excluir este registro?',
}) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const confirmarExclusao = async () => {
        if (loading) return;

        try {
            setLoading(true);

            await onConfirm();

            onClose();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-borda bg-superficie p-6 shadow-2xl">

                <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-perigo/10">
                            <AlertTriangle className="h-6 w-6 text-perigo" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-texto">
                                {titulo}
                            </h2>

                            <p className="mt-1 text-sm text-texto-suave">
                                Confirmação de exclusão
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-texto-suave transition-colors hover:text-texto disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-7 text-sm leading-relaxed text-texto-suave">
                    {descricao}
                    <br />
                    <span className="mt-2 block font-semibold text-perigo">
                        Esta ação não poderá ser desfeita.
                    </span>
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        onClick={confirmarExclusao}
                        loading={loading}
                    >
                        Confirmar exclusão
                    </Button>
                </div>
            </div>
        </div>
    );
}