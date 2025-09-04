// Message.jsx
import React from 'react';

function Message({ message, type }) {
  if (!message) {
    return null; // Não renderiza nada se não houver mensagem
  }

  // Objeto para mapear o tipo de mensagem às classes de estilo
  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  const baseClasses = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white font-bold transition-all duration-300';
  const typeClasses = typeStyles[type] || 'bg-gray-500'; // Define um estilo padrão caso o tipo não seja reconhecido

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
}

export default Message;