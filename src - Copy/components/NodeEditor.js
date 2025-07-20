import React from 'react';
import NodeItem from './NodeItem';

const NodeEditor = ({
  nodes,
  onAddRootNode,
  onUpdateNode,
  onDeleteNode,
  onAddChildNode
}) => {
  return (
    <div className="w-1/2 border-r border-corp-light-blue/30 overflow-y-auto p-6 bg-pattern">
      <div className="flex justify-between items-center mb-8">
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-corp-navy flex items-center">
            <i className="fa-solid fa-layer-group mr-3 text-corp-gold"></i>
            Estructura del Quiz
          </h2>
          <p className="text-sm text-gray-600 mt-2 ml-9">Organiza tus secciones y preguntas de manera jerárquica</p>
        </div>
        <button
          onClick={onAddRootNode}
          className="btn-primary px-6 py-3 rounded-xl flex items-center text-sm font-semibold shadow-navy transition-all duration-300 hover:scale-105 animate-bounce-soft"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Nueva Sección
        </button>
      </div>

      <div className="space-y-6">
        {nodes.map((node, index) => (
          <div key={node.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <NodeItem
              node={node}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              onAddChildNode={onAddChildNode}
              level={0}
            />
          </div>
        ))}
        
        {nodes.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-corp-light-blue to-corp-medium-blue rounded-2xl mx-auto mb-6 flex items-center justify-center float-animation">
              <i className="fa-solid fa-folder-plus text-corp-navy text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-corp-navy mb-2">Comienza tu quiz</h3>
            <p className="text-gray-600 mb-4">Añade tu primera sección para organizar las preguntas</p>
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