/**
 * MPTT (Modified Preorder Tree Traversal) Utilities
 * 
 * Sistema eficiente para manejar estructuras jerárquicas tipo árbol
 * que permite consultas rápidas de ancestros, descendientes y árboles completos.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Calcula los valores MPTT (left, right, level) para todos los nodos del árbol
 * @param {Array} nodes - Array de nodos con estructura children
 * @param {number} startLeft - Valor inicial para left (default: 1)
 * @param {number} level - Nivel inicial (default: 0)
 * @returns {Array} Array de nodos aplanado con valores MPTT
 */
export const calculateMPTT = (nodes, startLeft = 1, level = 0, parentId = null) => {
  let flatNodes = [];
  let currentLeft = startLeft;

  nodes.forEach(node => {
    const nodeLeft = currentLeft;
    currentLeft++;

    // Procesar hijos recursivamente
    let childNodes = [];
    if (node.children && node.children.length > 0) {
      const childResult = calculateMPTT(node.children, currentLeft, level + 1, node.id);
      childNodes = childResult.nodes;
      currentLeft = childResult.nextLeft;
    }

    const nodeRight = currentLeft;
    currentLeft++;

    // Crear nodo con valores MPTT
    const mpttNode = {
      ...node,
      left: nodeLeft,
      right: nodeRight,
      level: level,
      parent_id: parentId,
      has_children: (node.children && node.children.length > 0),
      children_count: node.children ? node.children.length : 0
    };

    // Eliminar el array children ya que ahora usamos MPTT
    delete mpttNode.children;

    flatNodes.push(mpttNode);
    flatNodes.push(...childNodes);
  });

  return {
    nodes: flatNodes,
    nextLeft: currentLeft
  };
};

/**
 * Convierte una lista plana de nodos MPTT a estructura jerárquica
 * @param {Array} flatNodes - Array de nodos con valores MPTT
 * @returns {Array} Array de nodos con estructura children
 */
export const mpttToHierarchy = (flatNodes) => {
  if (!flatNodes || flatNodes.length === 0) return [];

  // Crear un mapa para acceso rápido por ID
  const nodeMap = new Map();
  const result = [];

  // Primer pase: crear todos los nodos
  flatNodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Segundo pase: construir la jerarquía
  flatNodes.forEach(node => {
    const currentNode = nodeMap.get(node.id);
    
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      // Es un nodo hijo
      const parentNode = nodeMap.get(node.parent_id);
      parentNode.children.push(currentNode);
    } else {
      // Es un nodo raíz
      result.push(currentNode);
    }
  });

  // Ordenar hijos por left value para mantener el orden correcto
  const sortChildren = (nodes) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => a.left - b.left);
        sortChildren(node.children);
      }
    });
  };

  sortChildren(result);
  return result.sort((a, b) => a.left - b.left);
};

/**
 * Encuentra todos los descendientes de un nodo
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID del nodo padre
 * @returns {Array} Array de nodos descendientes
 */
export const getDescendants = (flatNodes, nodeId) => {
  const node = flatNodes.find(n => n.id === nodeId);
  if (!node) return [];

  return flatNodes.filter(n => 
    n.left > node.left && n.right < node.right
  ).sort((a, b) => a.left - b.left);
};

/**
 * Encuentra todos los ancestros de un nodo
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID del nodo hijo
 * @returns {Array} Array de nodos ancestros (desde raíz hasta padre directo)
 */
export const getAncestors = (flatNodes, nodeId) => {
  const node = flatNodes.find(n => n.id === nodeId);
  if (!node) return [];

  return flatNodes.filter(n => 
    n.left < node.left && n.right > node.right
  ).sort((a, b) => a.left - b.left);
};

/**
 * Encuentra todos los hermanos de un nodo (nodos con el mismo padre)
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID del nodo
 * @returns {Array} Array de nodos hermanos
 */
export const getSiblings = (flatNodes, nodeId) => {
  const node = flatNodes.find(n => n.id === nodeId);
  if (!node) return [];

  return flatNodes.filter(n => 
    n.parent_id === node.parent_id && n.id !== nodeId
  ).sort((a, b) => a.left - b.left);
};

/**
 * Encuentra los hijos directos de un nodo
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID del nodo padre
 * @returns {Array} Array de nodos hijos directos
 */
export const getChildren = (flatNodes, nodeId) => {
  return flatNodes.filter(n => 
    n.parent_id === nodeId
  ).sort((a, b) => a.left - b.left);
};

/**
 * Encuentra la raíz de un árbol dado un nodo
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID de cualquier nodo del árbol
 * @returns {Object|null} Nodo raíz
 */
export const getRoot = (flatNodes, nodeId) => {
  const ancestors = getAncestors(flatNodes, nodeId);
  return ancestors.length > 0 ? ancestors[0] : flatNodes.find(n => n.id === nodeId);
};

/**
 * Verifica si un nodo es hijo de otro
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} parentId - ID del posible padre
 * @param {string} childId - ID del posible hijo
 * @returns {boolean} True si childId es descendiente de parentId
 */
export const isDescendant = (flatNodes, parentId, childId) => {
  const parent = flatNodes.find(n => n.id === parentId);
  const child = flatNodes.find(n => n.id === childId);
  
  if (!parent || !child) return false;
  
  return child.left > parent.left && child.right < parent.right;
};

/**
 * Obtiene el camino completo desde la raíz hasta un nodo
 * @param {Array} flatNodes - Array de nodos MPTT
 * @param {string} nodeId - ID del nodo destino
 * @returns {Array} Array de nodos desde raíz hasta el nodo (breadcrumb)
 */
export const getPath = (flatNodes, nodeId) => {
  const node = flatNodes.find(n => n.id === nodeId);
  if (!node) return [];

  const ancestors = getAncestors(flatNodes, nodeId);
  return [...ancestors, node];
};

/**
 * Obtiene estadísticas del árbol
 * @param {Array} flatNodes - Array de nodos MPTT
 * @returns {Object} Estadísticas del árbol
 */
export const getTreeStats = (flatNodes) => {
  if (!flatNodes || flatNodes.length === 0) {
    return {
      totalNodes: 0,
      maxDepth: 0,
      rootNodes: 0,
      leafNodes: 0
    };
  }

  const rootNodes = flatNodes.filter(n => n.parent_id === null || n.parent_id === undefined);
  const leafNodes = flatNodes.filter(n => !n.has_children);
  const maxDepth = Math.max(...flatNodes.map(n => n.level)) + 1; // +1 porque level empieza en 0

  return {
    totalNodes: flatNodes.length,
    maxDepth: maxDepth,
    rootNodes: rootNodes.length,
    leafNodes: leafNodes.length,
    avgDepth: flatNodes.reduce((sum, n) => sum + n.level, 0) / flatNodes.length
  };
};

/**
 * Valida la integridad de la estructura MPTT
 * @param {Array} flatNodes - Array de nodos MPTT
 * @returns {Object} Resultado de validación con errores si los hay
 */
export const validateMPTT = (flatNodes) => {
  const errors = [];
  
  flatNodes.forEach(node => {
    // Validar que left < right
    if (node.left >= node.right) {
      errors.push(`Nodo ${node.id}: left (${node.left}) debe ser menor que right (${node.right})`);
    }
    
    // Validar que no hay overlaps incorrectos
    flatNodes.forEach(otherNode => {
      if (node.id !== otherNode.id) {
        const isParentChild = node.parent_id === otherNode.id || otherNode.parent_id === node.id;
        const isAncestorDescendant = 
          (node.left < otherNode.left && node.right > otherNode.right) ||
          (otherNode.left < node.left && otherNode.right > node.right);
        
        if (!isParentChild && !isAncestorDescendant) {
          // No deberían haber overlaps
          const hasOverlap = 
            (node.left < otherNode.left && node.right > otherNode.left && node.right < otherNode.right) ||
            (node.left > otherNode.left && node.left < otherNode.right && node.right > otherNode.right);
          
          if (hasOverlap) {
            errors.push(`Nodos ${node.id} y ${otherNode.id}: overlap inválido detectado`);
          }
        }
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Crea un nuevo nodo con valores por defecto para MPTT
 * @param {Object} nodeData - Datos del nodo
 * @param {string} parentId - ID del nodo padre (null para nodos raíz)
 * @returns {Object} Nuevo nodo con estructura MPTT
 */
export const createNode = (nodeData, parentId = null) => {
  return {
    id: uuidv4(),
    titulo: '',
    tipo: 'seccion',
    descripcion: '',
    imagen: '',
    codigo: '',
    orden: 1,
    random: 'N',
    opciones: [],
    // Campos MPTT (se calculan automáticamente)
    left: 0,
    right: 0,
    level: 0,
    parent_id: parentId,
    has_children: false,
    children_count: 0,
    // Fusionar con datos proporcionados
    ...nodeData
  };
};

export default {
  calculateMPTT,
  mpttToHierarchy,
  getDescendants,
  getAncestors,
  getSiblings,
  getChildren,
  getRoot,
  isDescendant,
  getPath,
  getTreeStats,
  validateMPTT,
  createNode
};