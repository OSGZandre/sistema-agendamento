import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  const handlePaymentPlaceholder = () => {
    alert(
      "Funcionalidade de pagamento em desenvolvimento. Redirecionando para o dashboard..."
    );
    navigate("/dono"); // Temporário, pra simular acesso
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Assinatura do Plano</h2>
        <p className="text-gray-700 mb-4">
          Esta é uma página placeholder para o pagamento. Após implementar o
          sistema de assinaturas, você poderá pagar sua mensalidade aqui para
          acessar o sistema completo.
        </p>
        <button
          onClick={handlePaymentPlaceholder}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continuar (Temporário)
        </button>
      </div>
    </div>
  );
}
