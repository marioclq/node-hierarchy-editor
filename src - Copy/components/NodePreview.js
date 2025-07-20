import React from 'react';

const NodePreview = ({ nodes, viewMode, onViewModeChange }) => {
  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'seccion':
        return 'fa-solid fa-folder text-blue-600';
      case 'pregunta_multiple':
        return 'fa-solid fa-list-check text-green-600';
      case 'pregunta_unica':
        return 'fa-solid fa-circle-dot text-orange-600';
      case 'pregunta_abierta':
        return 'fa-solid fa-pen-to-square text-purple-600';
      default:
        return 'fa-solid fa-question text-gray-600';
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'seccion':
        return 'bg-blue-100';
      case 'pregunta_multiple':
        return 'bg-green-100';
      case 'pregunta_unica':
        return 'bg-orange-100';
      case 'pregunta_abierta':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
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

  const renderTreeNode = (node, level = 0) => {
    const marginLeft = level > 0 ? `ml-${Math.min(level * 6, 12)}` : '';
    
    return (
      <div key={node.id} className={`glass-card rounded-2xl p-6 shadow-elegant-hover card-hover transition-all duration-300 ${marginLeft}`}>
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-4 mt-0.5 shadow-elegant transition-all duration-300 ${
            node.tipo === 'seccion' ? 'bg-gradient-to-br from-corp-navy to-corp-navy-700' :
            node.tipo === 'pregunta_multiple' ? 'bg-gradient-to-br from-green-500 to-green-600' :
            node.tipo === 'pregunta_unica' ? 'bg-gradient-to-br from-corp-gold to-orange-500' :
            'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}>
            <i className={`${getTypeIcon(node.tipo)} text-white text-sm interactive-icon`}></i>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-bold text-corp-navy ${level > 0 ? 'text-lg' : 'text-xl'} mb-2`}>
                  {node.titulo || 'Sin título'}
                </h3>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`badge-type ${
                    node.tipo === 'seccion' ? 'badge-section' :
                    node.tipo === 'pregunta_multiple' ? 'badge-multiple' :
                    node.tipo === 'pregunta_unica' ? 'badge-single' :
                    'badge-open'
                  }`}>
                    {getTipoLabel(node.tipo)}
                  </span>
                  {node.codigo && (
                    <span className="badge-type bg-corp-light-blue text-corp-navy">
                      {node.codigo}
                    </span>
                  )}
                  {node.random === 'S' && (
                    <span className="badge-type bg-corp-gold text-corp-navy">
                      <i className="fa-solid fa-shuffle mr-1"></i>Aleatorio
                    </span>
                  )}
                </div>
              </div>
              <div className="badge-type bg-corp-light-gray text-corp-navy">
                #{node.orden || 1}
              </div>
            </div>
            
            {/* Descripción/Pregunta */}
            {node.descripcion && (
              <div className="mt-4 glass-card rounded-xl p-4 border-l-4 border-corp-gold">
                <p className="text-sm text-corp-navy leading-relaxed font-medium">
                  {node.descripcion}
                </p>
              </div>
            )}

            {/* Imagen */}
            {node.imagen && (
              <div className="mt-4">
                <img 
                  src={node.imagen} 
                  alt="Imagen de la pregunta"
                  className="max-w-full h-auto rounded-xl border border-corp-light-blue shadow-elegant"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Opciones para preguntas de selección */}
            {(node.tipo === 'pregunta_multiple' || node.tipo === 'pregunta_unica') && node.opciones && node.opciones.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-corp-navy mb-4 flex items-center">
                  <i className="fa-solid fa-list-ul mr-2 text-corp-gold"></i>
                  Opciones de Respuesta:
                </h4>
                <div className="space-y-3">
                  {node.opciones.map((option, index) => (
                    <div key={option.id} className={`card-hover flex items-center p-4 rounded-xl transition-all duration-300 ${
                      option.correcta 
                        ? 'glass-card-dark text-white shadow-elegant-lg' 
                        : 'glass-card border border-corp-light-blue/30 hover:shadow-elegant'
                    }`}>
                      <div className="flex items-center mr-4">
                        {node.tipo === 'pregunta_unica' ? (
                          <div className={`w-5 h-5 rounded-full border-3 transition-all ${
                            option.correcta ? 'border-corp-gold bg-corp-gold' : 'border-corp-medium-blue'
                          }`}>
                            {option.correcta && <div className="w-2 h-2 bg-white rounded-full m-0.5 mx-auto mt-1"></div>}
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded border-3 transition-all ${
                            option.correcta ? 'border-corp-gold bg-corp-gold' : 'border-corp-medium-blue'
                          }`}>
                            {option.correcta && <i className="fa-solid fa-check text-white text-xs flex items-center justify-center h-full"></i>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center flex-grow">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                          option.correcta ? 'bg-white/20 text-white' : 'bg-corp-medium-blue text-white'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-sm font-medium ${
                          option.correcta ? 'text-white' : 'text-corp-navy'
                        }`}>
                          {option.texto}
                        </span>
                      </div>
                      {option.correcta && (
                        <div className="ml-auto">
                          <span className="badge-type bg-corp-gold text-corp-navy">
                            <i className="fa-solid fa-check mr-1"></i>Correcta
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Child Nodes */}
            {node.children && node.children.length > 0 && (
              <div className="mt-6">
                <div className="border-l-3 border-corp-light-blue ml-5 pl-6 space-y-4">
                  {node.children.map(child => renderTreeNode(child, level + 1))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderJsonView = () => {
    return (
      <div className="h-full">
        <div className="glass-card rounded-xl p-1 mb-4">
          <div className="flex items-center justify-between p-3">
            <h3 className="text-sm font-semibold text-corp-navy flex items-center">
              <i className="fa-solid fa-code mr-2 text-corp-gold"></i>
              Estructura JSON del Quiz
            </h3>
            <span className="badge-type bg-corp-light-blue text-corp-navy">
              {nodes.length} {nodes.length === 1 ? 'elemento' : 'elementos'}
            </span>
          </div>
        </div>
        <pre className="glass-card-dark text-white p-6 rounded-xl text-sm overflow-auto h-full font-mono leading-relaxed shadow-elegant">
          <code>{JSON.stringify({ nodes }, null, 2)}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="w-1/2 overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-corp-navy flex items-center">
            <i className="fa-solid fa-eye mr-3 text-corp-gold"></i>
            Vista Previa
          </h2>
          <p className="text-sm text-gray-600 mt-2 ml-9">Visualiza tu quiz en tiempo real</p>
        </div>
        <div className="glass-card rounded-xl p-1 shadow-elegant">
          <button
            onClick={() => onViewModeChange('tree')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center ${
              viewMode === 'tree' 
                ? 'btn-primary shadow-navy' 
                : 'text-gray-600 hover:text-corp-navy hover:bg-corp-light-blue/30'
            }`}
          >
            <i className="fa-solid fa-tree mr-2"></i>
            Vista Quiz
          </button>
          <button
            onClick={() => onViewModeChange('json')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center ${
              viewMode === 'json' 
                ? 'btn-primary shadow-navy' 
                : 'text-gray-600 hover:text-corp-navy hover:bg-corp-light-blue/30'
            }`}
          >
            <i className="fa-solid fa-code mr-2"></i>
            Vista JSON
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-elegant border-0">
        {viewMode === 'tree' ? (
          <div className="p-6">
            <div className="space-y-6">
              {nodes.length > 0 ? (
                nodes.map((node, index) => (
                  <div key={node.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {renderTreeNode(node)}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-16 animate-scale-in">
                  <div className="w-32 h-32 bg-gradient-to-br from-corp-light-blue to-corp-medium-blue rounded-3xl mx-auto mb-6 flex items-center justify-center float-animation">
                    <i className="fa-solid fa-clipboard-question text-corp-navy text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-corp-navy mb-3">Tu quiz está vacío</h3>
                  <p className="text-gray-600 mb-6">Comienza agregando una sección para organizar tus preguntas</p>
                  <div className="glass-card rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-sm font-medium text-corp-navy mb-4">Tipos de preguntas disponibles:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-corp-navy/10 to-corp-navy/5">
                        <i className="fa-solid fa-list-check text-green-600 mr-2"></i>
                        <span className="text-sm font-medium">Múltiple</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-corp-gold/10 to-corp-gold/5">
                        <i className="fa-solid fa-circle-dot text-orange-600 mr-2"></i>
                        <span className="text-sm font-medium">Única</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5">
                        <i className="fa-solid fa-pen-to-square text-purple-600 mr-2"></i>
                        <span className="text-sm font-medium">Abierta</span>
                      </div>
                      <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-corp-medium-blue/10 to-corp-medium-blue/5">
                        <i className="fa-solid fa-folder text-corp-navy mr-2"></i>
                        <span className="text-sm font-medium">Sección</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 h-full relative">
            <div className="absolute top-4 right-4">
              <button className="p-2 text-gray-500 hover:text-corp-navy transition-colors rounded-lg hover:bg-corp-light-blue/30">
                <i className="fa-solid fa-copy"></i>
              </button>
            </div>
            {renderJsonView()}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodePreview;