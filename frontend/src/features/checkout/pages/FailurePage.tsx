import { Link, useSearchParams } from 'react-router-dom';

export default function FailurePage() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const status = searchParams.get('status') || searchParams.get('collection_status');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Icono de error */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago no procesado
        </h1>

        <p className="text-gray-600 mb-6">
          Lo sentimos, tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes,
          datos incorrectos de la tarjeta u otros motivos.
        </p>

        {/* Detalles */}
        {(paymentId || status) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Detalles</h2>
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de intento:</span>
                  <span className="font-medium">{paymentId}</span>
                </div>
              )}
              {status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-red-600">
                    {status === 'rejected' ? 'Rechazado' : status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sugerencias */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">Posibles soluciones:</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Verifica que los datos de tu tarjeta sean correctos</li>
            <li>Asegúrate de tener fondos suficientes</li>
            <li>Intenta con otro método de pago</li>
            <li>Contacta a tu banco si el problema persiste</li>
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Intentar de nuevo
          </Link>
          <Link
            to="/carrito"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
