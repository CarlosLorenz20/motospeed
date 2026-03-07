import { Link, useSearchParams } from 'react-router-dom';

export default function PendingPage() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const externalReference = searchParams.get('external_reference');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Icono de pendiente */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago pendiente
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por email cuando se complete
          la verificación.
        </p>

        {/* Detalles */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">Detalles de la transacción</h2>
          <div className="space-y-2 text-sm">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID de pago:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
            )}
            {externalReference && (
              <div className="flex justify-between">
                <span className="text-gray-600">N° de orden:</span>
                <span className="font-medium">{externalReference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-yellow-600">En proceso</span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">¿Qué significa esto?</h3>
          <p className="text-sm text-blue-700">
            Mercado Pago está verificando tu pago. Esto puede suceder cuando:
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>Pagaste en efectivo y aún no se acredita</li>
            <li>El banco está procesando la transacción</li>
            <li>Se requiere verificación adicional</li>
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mis-pedidos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/productos"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
