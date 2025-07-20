import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import NodeEditor from './components/NodeEditor';
import NodePreview from './components/NodePreview';

const initialNodes = [
  {
    id: 'node-1',
    titulo: 'Sección Principal',
    tipo: 'seccion',
    descripcion: '',
    imagen: '',
    codigo: '',
    orden: 1,
    random: 'N',
    children: [
      {
        id: 'node-1-1',
        titulo: 'Pregunta de Ejemplo',
        tipo: 'pregunta_multiple',
        descripcion: '¿Cuál es la respuesta correcta?',
        imagen: '',
        codigo: '',
        orden: 1,
        random: 'N',
        opciones: [],
        children: []
      }
    ]
  }
];

function App() {
  const [nodes, setNodes] = useLocalStorage('node-hierarchy', initialNodes);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'json'

  const addRootNode = () => {
    const newNode = {
      id: uuidv4(),
      titulo: 'Nueva Sección',
      tipo: 'seccion',
      descripcion: '',
      imagen: '',
      codigo: '',
      orden: nodes.length + 1,
      random: 'N',
      children: []
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (nodeId, updates) => {
    const updateNodeRecursive = (nodesList) => {
      return nodesList.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateNodeRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(updateNodeRecursive(nodes));
  };

  const deleteNode = (nodeId) => {
    const deleteNodeRecursive = (nodesList) => {
      return nodesList.filter(node => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children && node.children.length > 0) {
          node.children = deleteNodeRecursive(node.children);
        }
        return true;
      });
    };
    setNodes(deleteNodeRecursive(nodes));
  };

  const addChildNode = (parentId) => {
    const newNode = {
      id: uuidv4(),
      titulo: 'Nueva Pregunta',
      tipo: 'pregunta_multiple',
      descripcion: '',
      imagen: '',
      codigo: '',
      orden: 1,
      random: 'N',
      opciones: [],
      children: []
    };

    const addChildRecursive = (nodesList) => {
      return nodesList.map(node => {
        if (node.id === parentId) {
          const newOrder = node.children.length + 1;
          return { ...node, children: [...node.children, { ...newNode, orden: newOrder }] };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: addChildRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(addChildRecursive(nodes));
  };

  const saveNodes = () => {
    // Data is automatically saved to localStorage via useLocalStorage hook
    alert('¡Quiz guardado exitosamente! 🎉\n\nTodos los cambios se han guardado automáticamente en tu navegador.');
  };

  const exportNodes = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-${new Date().toISOString().split('T')[0]}.json`;
    
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
          if (importedData.nodes && Array.isArray(importedData.nodes)) {
            setNodes(importedData.nodes);
            alert('¡Quiz importado exitosamente! 🎉\n\nSe han cargado ' + importedData.nodes.length + ' elementos.');
          } else {
            alert('⚠️ Error: El archivo JSON no tiene el formato correcto.\n\nDebe contener una propiedad "nodes" con un array.');
          }
        } catch (error) {
          alert('⚠️ Error: No se pudo leer el archivo JSON.\n\nVerifica que el archivo esté correctamente formateado.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('⚠️ Por favor selecciona un archivo JSON válido.');
    }
    // Limpiar el input para permitir seleccionar el mismo archivo otra vez
    event.target.value = '';
  };

  const moveNodeUp = (nodeId) => {
    const newNodes = [...nodes];
    const currentIndex = newNodes.findIndex(node => node.id === nodeId);
    if (currentIndex > 0) {
      [newNodes[currentIndex], newNodes[currentIndex - 1]] = [newNodes[currentIndex - 1], newNodes[currentIndex]];
      // Actualizar los órdenes
      newNodes.forEach((node, index) => {
        node.orden = index + 1;
      });
      setNodes(newNodes);
    }
  };

  const moveNodeDown = (nodeId) => {
    const newNodes = [...nodes];
    const currentIndex = newNodes.findIndex(node => node.id === nodeId);
    if (currentIndex < newNodes.length - 1) {
      [newNodes[currentIndex], newNodes[currentIndex + 1]] = [newNodes[currentIndex + 1], newNodes[currentIndex]];
      // Actualizar los órdenes
      newNodes.forEach((node, index) => {
        node.orden = index + 1;
      });
      setNodes(newNodes);
    }
  };

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <div className="glass-card border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-elegant">
        <div className="flex items-center">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-corp-navy to-corp-navy-700 rounded-xl mr-4 shadow-navy float-animation">
              <i className="fa-solid fa-clipboard-question text-corp-gold text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-corp-gold rounded-full pulse-glow"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-corp-navy">Editor de Quiz Profesional</h1>
            <p className="text-sm text-gray-600 mt-1">Crea y organiza exámenes de manera intuitiva y moderna</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={saveNodes}
            className="btn-primary px-6 py-3 rounded-xl flex items-center font-semibold shadow-navy transition-all duration-300 hover:scale-105 text-white"
          >
            <i className="fa-solid fa-save mr-2 text-white"></i>
            Guardar Quiz
          </button>
          <button
            onClick={exportNodes}
            className="btn-gold px-6 py-3 rounded-xl flex items-center font-semibold shadow-gold transition-all duration-300 hover:scale-105 text-white"
          >
            <i className="fa-solid fa-download mr-2 text-white"></i>
            Exportar JSON
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Node Editor */}
        <NodeEditor
          nodes={nodes}
          onAddRootNode={addRootNode}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          onAddChildNode={addChildNode}
        />

        {/* Right Panel - Preview */}
        <NodePreview
          nodes={nodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  );
}

export default App;