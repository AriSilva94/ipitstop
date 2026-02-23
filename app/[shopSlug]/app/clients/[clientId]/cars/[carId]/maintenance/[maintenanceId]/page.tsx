import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { db } from "../../../../../../../../../lib/db";
import { deleteMaintenanceAction, deleteItemAction } from "../actions";
import AddItemForm from "./AddItemForm";

type Props = {
  params: Promise<{
    shopSlug: string;
    clientId: string;
    carId: string;
    maintenanceId: string;
  }>;
};

export default async function MaintenanceDetailPage({ params }: Props) {
  const { shopSlug, clientId, carId, maintenanceId } = await params;
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } });
  if (!shop) notFound();

  const maintenance = await db.maintenance.findFirst({
    where: { id: maintenanceId, shopId: shop.id, carId },
    include: {
      car: { include: { client: true } },
      items: true,
    },
  });
  if (!maintenance) notFound();

  const total = maintenance.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5 flex-wrap">
        <Link
          href={`/${shopSlug}/app/clients`}
          className="hover:text-slate-300 transition-colors"
        >
          Clientes
        </Link>
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <Link
          href={`/${shopSlug}/app/clients/${clientId}`}
          className="hover:text-slate-300 transition-colors"
        >
          {maintenance.car.client.name}
        </Link>
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <Link
          href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}`}
          className="hover:text-slate-300 transition-colors font-mono text-amber-400/80"
        >
          {maintenance.car.plate}
        </Link>
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="text-slate-300">OS</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                maintenance.status === "open"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {maintenance.status === "open" ? "● Aberta" : "✓ Fechada"}
            </span>
            <span className="text-slate-500 text-sm">
              {new Date(maintenance.date).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {maintenance.description}
          </h1>
          {maintenance.notes && (
            <p className="text-slate-500 text-sm italic mt-1">
              {maintenance.notes}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenanceId}/print`}
            target="_blank"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-border text-foreground hover:bg-surface-light px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
              />
            </svg>
            Imprimir
          </Link>
          <Link
            href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenanceId}/edit`}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-border text-foreground hover:bg-surface-light px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Editar
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteMaintenanceAction(
                shopSlug,
                clientId,
                carId,
                maintenanceId,
              );
            }}
          >
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 px-4 py-2 rounded-xl transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Excluir
            </button>
          </form>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto mb-4">
        {maintenance.items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500 text-sm">
              Nenhum item adicionado ainda.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Qtd.
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Vlr. Unit.
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {maintenance.items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3.5 text-slate-200">
                    {item.description}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400">
                    {item.unitPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-200">
                    {item.subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteItemAction(shopSlug, item.id);
                        redirect(
                          `/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenanceId}`,
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-1 rounded-md transition-colors"
                      >
                        remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 bg-slate-900/50">
                <td
                  colSpan={3}
                  className="px-5 py-4 font-semibold text-slate-400 text-right"
                >
                  Total
                </td>
                <td className="px-5 py-4 font-bold text-amber-400 text-right text-base">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Add item form */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-5 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Adicionar Item / Serviço
        </h3>
        <AddItemForm shopSlug={shopSlug} maintenanceId={maintenanceId} />
      </div>
    </div>
  );
}
