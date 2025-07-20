import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import NodeEditor from './components/NodeEditor';
import NodePreview from './components/NodePreview';
import { 
  calculateMPTT, 
  mpttToHierarchy, 
  createNode,
  getChildren,
  getTreeStats,
  validateMPTT
} from './utils/mpttUtils';

// Datos iniciales con estructura MPTT
const initialNodesFlat = [
  {
    id: 'node-1',
    titulo: 'Fundamentos de MPTT',
    tipo: 'seccion',
    descripcion: 'Introducción a Modified Preorder Tree Traversal para estructuras jerárquicas eficientes.',
    imagen: '',
    codigo: 'MPTT-FUND',
    orden: 1,
    random: 'N',
    left: 1,
    right: 6,
    level: 0,
    parent_id: null,
    has_children: true,
    children_count: 1
  },
  {
    id: 'node-1-1',
    titulo: '¿Qué es MPTT?',
    tipo: 'pregunta_unica',
    descripcion: 'Selecciona la definición más precisa de Modified Preorder Tree Traversal:',
    imagen: '',
    codigo: 'P001',
    orden: 1,
    random: 'N',
    opciones: [
      {
        id: 'opt-1-1-a',
        texto: 'Un algoritmo para almacenar árboles en bases de datos relacionales usando valores left/right',
        correcta: true
      },
      {
        id: 'opt-1-1-b',
        texto: 'Una metodología para ordenar nodos alfabéticamente',
        correcta: false
      },
      {
        id: 'opt-1-1-c',
        texto: 'Un protocolo de comunicación en red',
        correcta: false
      },
      {
        id: 'opt-1-1-d',
        texto: 'Un sistema de encriptación de datos',
        correcta: false
      }
    ],
    left: 2,
    right: 3,
    level: 1,
    parent_id: 'node-1',
    has_children: false,
    children_count: 0
  }
];

function App() {
  // Estado principal: array de nodos planos con valores MPTT
  const [flatNodes, setFlatNodes] = useLocalStorage('mptt-nodes', initialNodesFlat);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'json', 'mptt'
  const [treeStats, setTreeStats] = useState({});

  // Convertir nodos planos a estructura jerárquica para renderizado
  const hierarchicalNodes = mpttToHierarchy(flatNodes);

  // Actualizar estadísticas cuando cambien los nodos
  useEffect(() => {
    const stats = getTreeStats(flatNodes);
    setTreeStats(stats);
    
    // Validar integridad MPTT
    const validation = validateMPTT(flatNodes);
    if (!validation.isValid) {
      console.warn('Errores en estructura MPTT:', validation.errors);
    }
  }, [flatNodes]);

  // Función para recalcular y actualizar valores MPTT
  const updateMPTTValues = (hierarchicalNodes) => {
    const result = calculateMPTT(hierarchicalNodes);
    setFlatNodes(result.nodes);
  };

  const addRootNode = () => {
    const newNode = createNode({
      titulo: 'Nueva Sección',
      tipo: 'seccion',
      codigo: `SEC-${Date.now()}`,
      orden: hierarchicalNodes.length + 1
    }, null);
    
    // Añadir el nuevo nodo y recalcular MPTT
    const updatedHierarchy = [...hierarchicalNodes, newNode];
    updateMPTTValues(updatedHierarchy);
  };

  const updateNode = (nodeId, updates) => {
    const updatedFlat = flatNodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    setFlatNodes(updatedFlat);
  };

  const deleteNode = (nodeId) => {
    // Encontrar el nodo y todos sus descendientes
    const nodeToDelete = flatNodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;

    // Filtrar el nodo y todos sus descendientes usando valores MPTT
    const filteredFlat = flatNodes.filter(node => 
      !(node.left >= nodeToDelete.left && node.right <= nodeToDelete.right)
    );
    
    // Convertir a jerárquico y recalcular MPTT
    const hierarchical = mpttToHierarchy(filteredFlat);
    updateMPTTValues(hierarchical);
  };

  const addChildNode = (parentId) => {
    const newNode = createNode({
      titulo: 'Nueva Pregunta',
      tipo: 'pregunta_multiple',
      codigo: `P${Date.now()}`,
      orden: 1,
      opciones: []
    }, parentId);
    
    // Añadir como hijo en la estructura jerárquica
    const addChildRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentId) {
          const children = node.children || [];
          return { 
            ...node, 
            children: [...children, newNode]
          };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: addChildRecursive(node.children) };
        }
        return node;
      });
    };
    
    const updatedHierarchy = addChildRecursive(hierarchicalNodes);
    updateMPTTValues(updatedHierarchy);
  };

  const saveNodes = () => {
    const validation = validateMPTT(flatNodes);
    if (validation.isValid) {
      alert(`¡Sistema MPTT guardado exitosamente! 🎉\n\nEstadísticas:\n- Total nodos: ${treeStats.totalNodes}\n- Profundidad máxima: ${treeStats.maxDepth}\n- Nodos raíz: ${treeStats.rootNodes}\n- Nodos hoja: ${treeStats.leafNodes}`);
    } else {
      alert(`⚠️ Advertencia: Se encontraron errores en la estructura MPTT:\n${validation.errors.join('\n')}`);
    }
  };

  const exportNodes = () => {
    const exportData = {
      format: 'MPTT',
      version: '1.0',
      timestamp: new Date().toISOString(),
      stats: treeStats,
      nodes: flatNodes,
      hierarchical: hierarchicalNodes // Para compatibilidad
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mptt-quiz-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importNodes = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          let nodesToImport = [];
          
          // Detectar formato MPTT nativo
          if (importedData.format === 'MPTT' && importedData.nodes) {
            nodesToImport = importedData.nodes;
            setFlatNodes(nodesToImport);
            alert(`¡Archivo MPTT importado exitosamente! 🎉\n\nEstadísticas:\n- ${nodesToImport.length} nodos cargados\n- Formato: ${importedData.format} v${importedData.version}`);
            return;
          }
          
          // Soportar formatos jerárquicos tradicionales
          if (Array.isArray(importedData)) {
            nodesToImport = importedData;
          } else if (importedData.nodes && Array.isArray(importedData.nodes)) {
            nodesToImport = importedData.nodes;
          } else if (importedData.quiz && Array.isArray(importedData.quiz)) {
            nodesToImport = importedData.quiz;
          } else {
            throw new Error('Formato no reconocido');
          }
          
          // Validar estructura básica
          const validNodes = nodesToImport.every(node => 
            node.id && (node.titulo || node.nombre) && node.tipo
          );
          
          if (validNodes) {
            // Convertir formato jerárquico a MPTT
            const result = calculateMPTT(nodesToImport);
            setFlatNodes(result.nodes);
            alert(`¡Quiz convertido a MPTT exitosamente! 🎉\n\nSe han cargado ${result.nodes.length} nodos.`);
          } else {
            alert('⚠️ Error: Los datos no tienen la estructura correcta.\n\nCada elemento debe tener al menos: id, titulo/nombre y tipo.');
          }
        } catch (error) {
          alert(`⚠️ Error: No se pudo leer el archivo JSON.\n\nDetalle: ${error.message}`);
        }
      };
      reader.readAsText(file);
    } else {
      alert('⚠️ Por favor selecciona un archivo JSON válido.');
    }
    event.target.value = '';
  };

  const moveNodeUp = (nodeId) => {
    const rootNodes = flatNodes.filter(n => n.parent_id === null).sort((a, b) => a.left - b.left);
    const currentIndex = rootNodes.findIndex(node => node.id === nodeId);
    
    if (currentIndex > 0) {
      // Intercambiar posiciones en la estructura jerárquica
      const newHierarchy = [...hierarchicalNodes];
      [newHierarchy[currentIndex], newHierarchy[currentIndex - 1]] = 
        [newHierarchy[currentIndex - 1], newHierarchy[currentIndex]];
      
      // Recalcular MPTT
      updateMPTTValues(newHierarchy);
    }
  };

  const moveNodeDown = (nodeId) => {
    const rootNodes = flatNodes.filter(n => n.parent_id === null).sort((a, b) => a.left - b.left);
    const currentIndex = rootNodes.findIndex(node => node.id === nodeId);
    
    if (currentIndex < rootNodes.length - 1) {
      // Intercambiar posiciones en la estructura jerárquica
      const newHierarchy = [...hierarchicalNodes];
      [newHierarchy[currentIndex], newHierarchy[currentIndex + 1]] = 
        [newHierarchy[currentIndex + 1], newHierarchy[currentIndex]];
      
      // Recalcular MPTT
      updateMPTTValues(newHierarchy);
    }
  };

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <div className="glass-card border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-elegant space-y-3 sm:space-y-0">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative">
            <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-corp-navy to-corp-navy-700 rounded-xl mr-3 sm:mr-4 shadow-navy float-animation">
              <i className="fa-solid fa-sitemap text-corp-gold text-lg sm:text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-corp-gold rounded-full pulse-glow"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-corp-navy">Editor MPTT Profesional</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
              Sistema jerárquico con Modified Preorder Tree Traversal
              {treeStats.totalNodes > 0 && (
                <span className="ml-2 text-corp-gold font-semibold">
                  • {treeStats.totalNodes} nodos • {treeStats.maxDepth} niveles
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
          <button
            onClick={saveNodes}
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center font-semibold shadow-navy transition-all duration-300 hover:scale-105 text-white text-sm sm:text-base"
          >
            <i className="fa-solid fa-save mr-1 sm:mr-2 text-white"></i>
            <span className="hidden sm:inline">Guardar MPTT</span>
            <span className="sm:hidden">Guardar</span>
          </button>
          <button
            onClick={exportNodes}
            className="btn-gold px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center font-semibold shadow-gold transition-all duration-300 hover:scale-105 text-white text-sm sm:text-base"
          >
            <i className="fa-solid fa-download mr-1 sm:mr-2 text-white"></i>
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Export</span>
          </button>
          <label className="btn-secondary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center font-semibold shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer text-sm sm:text-base">
            <i className="fa-solid fa-upload mr-1 sm:mr-2"></i>
            <span className="hidden sm:inline">Importar</span>
            <span className="sm:hidden">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importNodes}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Panel - Node Editor */}
        <NodeEditor
          nodes={hierarchicalNodes}
          flatNodes={flatNodes}
          treeStats={treeStats}
          onAddRootNode={addRootNode}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          onAddChildNode={addChildNode}
          onMoveNodeUp={moveNodeUp}
          onMoveNodeDown={moveNodeDown}
        />

        {/* Right Panel - Preview */}
        <NodePreview
          nodes={hierarchicalNodes}
          flatNodes={flatNodes}
          treeStats={treeStats}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  );
}

export default App;