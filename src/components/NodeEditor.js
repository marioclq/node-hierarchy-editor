import React from 'react';
import NodeItem from './NodeItem';

const NodeEditor = ({
  nodes,
  flatNodes,
  treeStats,
  onAddRootNode,
  onUpdateNode,
  onDeleteNode,
  onAddChildNode,
  onMoveNodeUp,
  onMoveNodeDown
}) => {
  return (
    <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-corp-light-blue/30 overflow-y-auto p-4 sm:p-6 bg-pattern">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="animate-slide-up flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-corp-navy flex items-center">
            <i className="fa-solid fa-sitemap mr-2 sm:mr-3 text-corp-gold"></i>
            Estructura MPTT
          </h2>
          <div className="text-xs sm:text-sm text-gray-600 mt-2 ml-6 sm:ml-9 space-y-1">
            <p className="hidden sm:block">Modified Preorder Tree Traversal - Estructura jerárquica eficiente</p>
            {treeStats.totalNodes > 0 && (
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="badge-type bg-corp-light-blue text-corp-navy">
                  <i className="fa-solid fa-nodes mr-1"></i>
                  {treeStats.totalNodes} nodos
                </span>
                <span className="badge-type bg-corp-light-blue text-corp-navy">
                  <i className="fa-solid fa-layer-group mr-1"></i>
                  {treeStats.maxDepth} niveles
                </span>
                <span className="badge-type bg-corp-light-blue text-corp-navy">
                  <i className="fa-solid fa-seedling mr-1"></i>
                  {treeStats.rootNodes} raíces
                </span>
                <span className="badge-type bg-corp-light-blue text-corp-navy">
                  <i className="fa-solid fa-leaf mr-1"></i>
                  {treeStats.leafNodes} hojas
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onAddRootNode}
          className="btn-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center text-xs sm:text-sm font-semibold shadow-navy transition-all duration-300 hover:scale-105 animate-bounce-soft w-full sm:w-auto justify-center"
        >
          <i className="fa-solid fa-plus mr-1 sm:mr-2"></i>
          Nueva Raíz
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {nodes.map((node, index) => (
          <div key={node.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative group">
              {/* Botones de orden para nodos raíz */}
              <div className="absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => onMoveNodeUp(node.id)}
                  disabled={index === 0}
                  className={`p-1 sm:p-2 rounded-lg transition-all text-xs ${
                    index === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-corp-navy hover:text-corp-gold hover:bg-white shadow-sm interactive-icon'
                  }`}
                  title="Mover arriba"
                >
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button
                  onClick={() => onMoveNodeDown(node.id)}
                  disabled={index === nodes.length - 1}
                  className={`p-1 sm:p-2 rounded-lg transition-all text-xs ${
                    index === nodes.length - 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-corp-navy hover:text-corp-gold hover:bg-white shadow-sm interactive-icon'
                  }`}
                  title="Mover abajo"
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
              <NodeItem
                node={node}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onAddChildNode={onAddChildNode}
                level={0}
              />
            </div>
          </div>
        ))}
        
        {nodes.length === 0 && (
          <div className="glass-card rounded-2xl p-6 sm:p-12 text-center animate-scale-in">
            <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-corp-light-blue to-corp-medium-blue rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center float-animation">
              <i className="fa-solid fa-folder-plus text-corp-navy text-xl sm:text-2xl"></i>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-corp-navy mb-2">Comienza tu quiz</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Añade tu primera sección para organizar las preguntas</p>
            <button
              onClick={onAddRootNode}
              className="btn-gold px-6 py-3 rounded-xl font-semibold shadow-gold hover:scale-105 transition-transform"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Crear Primera Sección
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeEditor;