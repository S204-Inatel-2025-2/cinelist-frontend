// src/components/AvatarModel.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// Importar o mapa e a função
import { AVATAR_MAP, getAvatarPath } from '../config/avatars';

/**
 * Modal para seleção de avatar.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Se o modal está aberto.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} props.onSave - Função para salvar o ID do avatar selecionado (recebe o ID).
 * @param {string} props.currentAvatarId - ID do avatar atualmente salvo.
 */
function AvatarModal({ isOpen, onClose, onSave, currentAvatarId }) {
  // Estado local agora rastreia o ID
  const [tempSelectedId, setTempSelectedId] = useState(currentAvatarId);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(currentAvatarId);
    }
  }, [isOpen, currentAvatarId]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    // Salva o ID
    onSave(tempSelectedId);
  };

  // Pega as entradas do mapa [id, path] para renderizar
  const avatarOptions = Object.entries(AVATAR_MAP);

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Preto com 30% de opacidade
    backdropFilter: 'blur(4px)',          // Desfoque (pode não funcionar em navegadores antigos)
    WebkitBackdropFilter: 'blur(4px)', // Para compatibilidade com Safari
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={overlayStyle}
      onClick={onClose} // Fecha ao clicar fora
    >
      {/* Conteúdo do Modal */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Escolha seu Ícone</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grid de Avatares */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {avatarOptions.map(([avatarId, avatarPath]) => {
            // Não mostra o 'default' na lista se ele for apenas um apelido do 'avatar_1'
            if (avatarId === 'default') return null;

            const isSelected = tempSelectedId === avatarId;
            return (
              <img
                key={avatarId}
                src={avatarPath} // Usa o caminho para exibir
                alt={`Avatar ${avatarId}`}
                className={`w-20 h-20 rounded-full border-4 cursor-pointer transition-all duration-200 hover:opacity-80
                  ${isSelected ? 'border-blue-600 shadow-lg' : 'border-transparent'}`}
                onClick={() => setTempSelectedId(avatarId)} // Seleciona o ID
                onError={(e) => { e.target.src = getAvatarPath(DEFAULT_AVATAR_ID); }}
              />
            );
          })}
        </div>

        {/* Rodapé com Botões */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarModal;