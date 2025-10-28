// src/components/AvatarModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
// Importar o mapa e a função
import { AVATAR_MAP, getAvatarPath, DEFAULT_AVATAR_ID } from '../config/avatars';


function AvatarModal({ isOpen, onClose, onSave, currentAvatarId, isSaving = false }) {
  const [tempSelectedId, setTempSelectedId] = useState(currentAvatarId);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(currentAvatarId);
    }
  }, [isOpen, currentAvatarId]);

  const handleClose = () => {
    if (isSaving) return; 
    onClose();
  };

  // Esta é a função que DEVE ser chamada ao clicar no ícone
  const handleSelect = (avatarId) => {
    if (isSaving) return; // Impede a seleção durante o salvamento
    setTempSelectedId(avatarId);
  };

  const handleSave = () => {
    if (isSaving) return; 
    onSave(tempSelectedId);
  };

  if (!isOpen) {
    return null;
  }

  const avatarOptions = Object.entries(AVATAR_MAP);

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    backdropFilter: 'blur(4px)', 
    WebkitBackdropFilter: 'blur(4px)', 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={overlayStyle}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Escolha seu Ícone</h2>
          <button
            onClick={handleClose}
            disabled={isSaving} // <-- CORRETO (já estava)
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grid de Avatares */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {avatarOptions.map(([avatarId, avatarPath]) => {
            if (avatarId === 'default') return null;

            const isSelected = tempSelectedId === avatarId;
            return (
              <img
                key={avatarId}
                src={avatarPath}
                alt={`Avatar ${avatarId}`}
                
                // --- ALTERAÇÃO 1: Classes dinâmicas ---
                // Adiciona 'opacity-50' e 'cursor-not-allowed' se estiver salvando
                className={`
                  w-20 h-20 rounded-full border-4 transition-all duration-200
                  ${isSelected ? 'border-blue-600 shadow-lg' : 'border-transparent'}
                  ${isSaving 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:opacity-80'
                  }
                `}
                
                // --- ALTERAÇÃO 2: Usar a função handleSelect ---
                onClick={() => handleSelect(avatarId)} 
                
                onError={(e) => { e.target.src = getAvatarPath(DEFAULT_AVATAR_ID); }}
              />
            );
          })}
        </div>

        {/* Rodapé com Botões */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            disabled={isSaving} // <-- CORRETO (já estava)
            className="px-6 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          {/* --- ALTERAÇÃO 3: Botão Salvar --- */}
          <button
            onClick={handleSave}
            // Desabilita se estiver salvando OU se nada mudou
            disabled={isSaving || tempSelectedId === currentAvatarId} 
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarModal;