import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NodeItem = ({ node, onUpdateNode, onDeleteNode, onAddChildNode, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTituloChange = (e) => {
    onUpdateNode(node.id, { titulo: e.target.value });
  };

  const handleDescripcionChange = (e) => {
    onUpdateNode(node.id, { descripcion: e.target.value });
  };

  const handleImagenChange = (e) => {
    onUpdateNode(node.id, { imagen: e.target.value });
  };

  const handleCodigoChange = (e) => {
    onUpdateNode(node.id, { codigo: e.target.value });
  };

  const handleTipoChange = (e) => {
    const newTipo = e.target.value;
    let updates = { tipo: newTipo };
    
    // Reset opciones when changing type
    if (newTipo === 'pregunta_multiple' || newTipo === 'pregunta_unica') {
      updates.opciones = [{ texto: 'Opción 1', correcta: false }];
    } else if (newTipo === 'pregunta_abierta' || newTipo === 'seccion') {
      if (node.opciones) {
        updates.opciones = undefined;
      }
    }
    
    onUpdateNode(node.id, updates);
  };

  const handleRandomChange = (e) => {
    onUpdateNode(node.id, { random: e.target.checked ? 'S' : 'N' });
  };

  const handleAddOption = () => {
    const newOption = { id: uuidv4(), texto: 'Nueva opción', correcta: false };
    const updatedOptions = [...(node.opciones || []), newOption];
    onUpdateNode(node.id, { opciones: updatedOptions });
  };

  const handleUpdateOption = (optionId, field, value) => {
    const updatedOptions = node.opciones.map(option =>
      option.id === optionId ? { ...option, [field]: value } : option
    );
    onUpdateNode(node.id, { opciones: updatedOptions });
  };

  const handleDeleteOption = (optionId) => {
    const updatedOptions = node.opciones.filter(option => option.id !== optionId);
    onUpdateNode(node.id, { opciones: updatedOptions });
  };

  const handleCorrectAnswerChange = (optionId) => {
    if (node.tipo === 'pregunta_unica') {
      // Para pregunta única, solo una opción puede ser correcta
      const updatedOptions = node.opciones.map(option => ({
        ...option,
        correcta: option.id === optionId // Solo la opción seleccionada será correcta
      }));
      onUpdateNode(node.id, { opciones: updatedOptions });
    } else {
      // Para pregunta múltiple, se puede alternar cada opción independientemente
      const updatedOptions = node.opciones.map(option => 
        option.id === optionId ? { ...option, correcta: !option.correcta } : option
      );
      onUpdateNode(node.id, { opciones: updatedOptions });
    }
  };

  const getTypeIcon = () => {
    switch (node.tipo) {
      case 'seccion':
        return 'fa-solid fa-folder text-blue-500';
      case 'pregunta_multiple':
        return 'fa-solid fa-list-check text-green-500';
      case 'pregunta_unica':
        return 'fa-solid fa-circle-dot text-orange-500';
      case 'pregunta_abierta':
        return 'fa-solid fa-pen-to-square text-purple-500';
      default:
        return 'fa-solid fa-question text-gray-500';
    }
  };

  const getTipoLabel = () => {
    switch (node.tipo) {
      case 'seccion':
        return 'Sección';
      case 'pregunta_multiple':
        return 'Selección Múltiple';
      case 'pregunta_unica':
        return 'Selección Única';
      case 'pregunta_abierta':
        return 'Pregunta Abierta';
      default:
        return 'Desconocido';
    }
  };

  const renderContent = () => {
    return (
      <div className="space-y-6">
        {/* Descripción/Pregunta */}
        <div className="animate-slide-up">
          <label className="block text-sm font-semibold text-corp-navy mb-3 flex items-center">
            <i className={`mr-2 ${
              node.tipo === 'seccion' ? 'fa-solid fa-align-left' : 'fa-solid fa-question-circle'
            } text-corp-gold`}></i>
            {node.tipo === 'seccion' ? 'Descripción' : 'Pregunta'}
          </label>
          <textarea
            placeholder={node.tipo === 'seccion' ? 'Describe el contenido de esta sección...' : 'Escribe tu pregunta aquí...'}
            value={node.descripcion || ''}
            onChange={handleDescripcionChange}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-corp-gold focus:border-corp-gold resize-none shadow-sm transition-all"
          />
        </div>

        {/* Campos adicionales en una fila */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <div>
            <label className="block text-sm font-medium text-corp-navy mb-2 flex items-center">
              <i className="fa-solid fa-tag mr-2 text-corp-medium-blue"></i>
              Código <span className="label-optional">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej: P001, SEC01"
              value={node.codigo || ''}
              onChange={handleCodigoChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-corp-gold focus:border-corp-gold shadow-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-corp-navy mb-2 flex items-center">
              <i className="fa-solid fa-image mr-2 text-corp-medium-blue"></i>
              Imagen <span className="label-optional">(opcional)</span>
            </label>
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={node.imagen || ''}
              onChange={handleImagenChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-corp-gold focus:border-corp-gold shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Opciones para preguntas de selección */}
        {(node.tipo === 'pregunta_multiple' || node.tipo === 'pregunta_unica') && (
          <div className="glass-card rounded-xl p-5 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-corp-navy flex items-center">
                <i className="fa-solid fa-list-ul mr-2 text-corp-gold"></i>
                Opciones de Respuesta
              </h4>
              <button
                onClick={handleAddOption}
                className="btn-gold px-4 py-2 rounded-lg text-xs font-semibold flex items-center shadow-gold hover:scale-105 transition-transform"
              >
                <i className="fa-solid fa-plus mr-1"></i>
                Nueva Opción
              </button>
            </div>
            <div className="space-y-3">
              {(node.opciones || []).map((option, index) => (
                <div key={option.id} className={`card-hover flex items-center space-x-3 p-4 rounded-xl transition-all ${
                  option.correcta 
                    ? 'glass-card-dark text-white shadow-elegant-lg' 
                    : 'glass-card shadow-sm hover:shadow-elegant'
                }`}>
                  <div className="flex items-center">
                    <input
                      type={node.tipo === 'pregunta_unica' ? 'radio' : 'checkbox'}
                      name={`correct-${node.id}`}
                      checked={option.correcta}
                      onChange={() => handleCorrectAnswerChange(option.id)}
                      className="h-5 w-5 text-corp-gold focus:ring-corp-gold border-corp-light-blue rounded interactive-icon"
                    />
                    <span className="ml-2 text-xs font-semibold">
                      {option.correcta ? (
                        <span className="badge-type bg-corp-gold text-corp-navy px-2 py-1 rounded-full">
                          ✓ Correcta
                        </span>
                      ) : (
                        <span className="text-gray-500">Incorrecta</span>
                      )}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                      value={option.texto}
                      onChange={(e) => handleUpdateOption(option.id, 'texto', e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-corp-gold focus:border-corp-gold border transition-all ${
                        option.correcta 
                          ? 'bg-white/90 text-corp-navy border-white/50' 
                          : 'bg-white border-gray-300 text-corp-navy'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteOption(option.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all interactive-icon"
                    title="Eliminar opción"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuración adicional */}
        <div className="glass-card rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`random-${node.id}`}
                checked={node.random === 'S'}
                onChange={handleRandomChange}
                className="h-4 w-4 text-corp-gold focus:ring-corp-gold border-corp-medium-blue rounded interactive-icon"
              />
              <label htmlFor={`random-${node.id}`} className="ml-3 text-sm font-medium text-corp-navy flex items-center">
                <i className="fa-solid fa-shuffle mr-2 text-corp-medium-blue"></i>
                Aleatorizar orden
              </label>
            </div>
            <div className="badge-type bg-corp-light-blue text-corp-navy">
              Orden: {node.orden || 1}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const paddingLeft = level > 0 ? `pl-${Math.min(level * 8, 16)}` : '';

  return (
    <div className={`glass-card rounded-2xl shadow-elegant-hover card-hover transition-all duration-500 animate-scale-in ${paddingLeft}`}>
      {/* Node Header */}
      <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-corp-light-gray/50 to-corp-light-blue/30 rounded-t-2xl backdrop-blur-sm">
        <div className="flex items-center flex-grow">
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl mr-4 shadow-elegant transition-all duration-300 ${
            node.tipo === 'seccion' ? 'bg-gradient-to-br from-corp-navy to-corp-navy-700' :
            node.tipo === 'pregunta_multiple' ? 'bg-gradient-to-br from-green-500 to-green-600' :
            node.tipo === 'pregunta_unica' ? 'bg-gradient-to-br from-corp-gold to-orange-500' :
            'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}>
            <i className={`${getTypeIcon()} text-white text-lg interactive-icon`}></i>
          </div>
          <div className="flex-grow relative group">
            <input
              type="text"
              placeholder={node.tipo === 'seccion' ? 'Nombre de la sección' : 'Título de la pregunta'}
              value={node.titulo || ''}
              onChange={handleTituloChange}
              className="text-xl font-bold text-corp-navy bg-transparent border-0 focus:ring-0 focus:outline-none w-full placeholder-gray-400 transition-all hover:bg-white/50 focus:bg-white rounded-lg px-2 py-1"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <i className="fa-solid fa-pencil text-corp-gold text-sm"></i>
            </div>
            <div className="flex items-center mt-2 space-x-3">
            <span className={`badge-type ${
            node.tipo === 'seccion' ? 'badge-section' :
            node.tipo === 'pregunta_multiple' ? 'badge-multiple' :
            node.tipo === 'pregunta_unica' ? 'badge-single' :
            'badge-open'
            }`}>
            {getTipoLabel()}
            </span>
            <span className="text-xs text-gray-500 font-mono">
            ID: {node.id.substring(0, 8)}...
            </span>
              {/* Información MPTT */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="badge-type bg-corp-light-gray text-corp-navy">
                    L:{node.left} R:{node.right}
                  </span>
                  <span className="badge-type bg-corp-medium-blue text-white">
                    Nivel:{node.level}
                  </span>
                  {node.parent_id && (
                    <span className="badge-type bg-corp-gold text-corp-navy">
                      ↑ Padre
                    </span>
                  )}
                  {node.has_children && (
                    <span className="badge-type bg-green-500 text-white">
                      {node.children_count} hijos
                    </span>
                  )}
                </div>
              </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={node.tipo}
            onChange={handleTipoChange}
            className="bg-white border border-corp-medium-blue/30 rounded-xl text-sm py-3 px-4 font-medium focus:ring-2 focus:ring-corp-gold focus:border-corp-gold transition-all"
          >
            <option value="seccion">📁 Sección</option>
            <option value="pregunta_multiple">📋 Selección Múltiple</option>
            <option value="pregunta_unica">⚪ Selección Única</option>
            <option value="pregunta_abierta">✍️ Pregunta Abierta</option>
          </select>
          <button
            onClick={() => onAddChildNode(node.id)}
            className="p-3 text-corp-medium-blue hover:text-corp-navy hover:bg-corp-light-blue/50 rounded-xl transition-all interactive-icon"
            title="Agregar elemento hijo"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          <button
            onClick={() => onDeleteNode(node.id)}
            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all interactive-icon"
            title="Eliminar elemento"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 text-gray-500 hover:text-corp-navy hover:bg-gray-100 rounded-xl transition-all interactive-icon"
            title={isExpanded ? 'Contraer' : 'Expandir'}
          >
            <i className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'} transition-transform duration-300`}></i>
          </button>
        </div>
      </div>

      {/* Node Content */}
      {isExpanded && (
        <div className="p-5">
          {renderContent()}
        </div>
      )}

      {/* Children Nodes */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="px-5 pb-5">
          <div className="border-l-2 border-gray-200 ml-5 pl-6 space-y-4">
            {node.children.map((child) => (
              <NodeItem
                key={child.id}
                node={child}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onAddChildNode={onAddChildNode}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeItem;