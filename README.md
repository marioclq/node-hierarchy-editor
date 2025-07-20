# Node Hierarchy Editor

Una aplicación React para crear y gestionar estructuras jerárquicas de nodos con diferentes tipos de datos y persistencia local.

## 🚀 Instalación Rápida

1. **Navega al directorio del proyecto**:
   ```bash
   cd C:\Users\M4R10\Downloads\node-hierarchy-editor
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia la aplicación**:
   ```bash
   npm start
   ```

4. **Abre tu navegador** y ve a `http://localhost:3000`

## ✨ Características

- ✅ **Tipos de preguntas especializadas**: Sección, Selección Múltiple, Selección Única, Pregunta Abierta
- ✅ **Estructura jerárquica**: Añade nodos hijos ilimitados con organización por secciones
- ✅ **Persistencia local**: Los datos se guardan automáticamente en localStorage
- ✅ **Vista previa realista**: Visualiza tu quiz como examen real o estructura JSON
- ✅ **Importación/Exportación**: Importa y exporta quizzes en formato JSON
- ✅ **Ordenamiento de secciones**: Mueve secciones arriba/abajo con controles visuales
- ✅ **Diseño responsive**: Optimizado para móviles, tablets y desktop
- ✅ **Interfaz moderna**: Glassmorphism, animaciones y efectos profesionales
- ✅ **Selección simple corregida**: Radio buttons exclusivos para respuesta única

## 🎯 Uso

### Crear nodos
- Haz clic en "Add Root Node" para crear un nodo raíz
- Usa el botón "+" en cualquier nodo para añadir nodos hijos

### Tipos de nodos
- **Text**: Para texto libre
- **Number**: Para valores numéricos
- **Select**: Para opciones predefinidas con ID y valor

### Editar nodos
- Haz clic en el nombre del nodo para editarlo
- Cambia el tipo usando el dropdown
- Modifica valores en la sección de contenido

### Gestión de datos
- Los datos se guardan automáticamente en localStorage
- Usa "Save" para confirmación manual
- Usa "Export" para descargar como JSON
- Usa "Import" para cargar quizzes existentes

### Ordenamiento de secciones
- Haz hover sobre cualquier sección raíz
- Aparecen flechas ↑↓ a la izquierda
- Haz clic para mover arriba o abajo
- El orden se actualiza automáticamente

### Vista previa
- **Tree View**: Visualización jerárquica amigable tipo examen real
- **JSON View**: Estructura de datos raw para desarrolladores

### Funciones responsive
- **Móvil**: Paneles se apilan verticalmente, botones compactos
- **Tablet**: Layout híbrido con elementos adaptables
- **Desktop**: Vista completa de dos columnas

## 📁 Estructura del proyecto

```
node-hierarchy-editor/
├── src/
│   ├── components/
│   │   ├── NodeEditor.js     # Editor principal de nodos
│   │   ├── NodeItem.js       # Componente individual de nodo
│   │   └── NodePreview.js    # Vista previa de nodos
│   ├── hooks/
│   │   └── useLocalStorage.js # Hook para persistencia local
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   └── index.css            # Estilos principales
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Dependencias principales

- **React 18**: Framework principal
- **Tailwind CSS**: Estilos y diseño responsivo
- **Font Awesome**: Iconografía
- **UUID**: Generación de IDs únicos

## 🔧 Solución de problemas

### Error de dependencias
```bash
npm install --legacy-peer-deps
```

### Estilos no cargan
Verifica que Tailwind CSS esté correctamente configurado:
```bash
npx tailwindcss init -p
```

### Font Awesome no funciona
Asegúrate de que la importación esté correcta en `src/index.css`

## 📝 Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 📚 Ejemplo Incluido

Se incluye un quiz de ejemplo sobre **Model Context Protocol (MCP) de Claude**:

📁 **Archivo**: `quiz-mcp-claude-ejemplo.json`

**Contenido**:
- 🏗️ **3 secciones**: Fundamentos, Implementación, Casos de Uso
- ❓ **5 preguntas**: 2 selección única, 2 múltiple, 1 abierta
- 🎯 **Características**: Códigos, aleatorización, estructura completa

**Para probarlo**:
1. Inicia la aplicación
2. Haz clic en "Importar" en el header
3. Selecciona `quiz-mcp-claude-ejemplo.json`
4. ¡Explora el quiz sobre MCP!

## 🎉 ¡Listo para usar!

Tu aplicación Node Hierarchy Editor está lista. Simplemente navega al directorio y ejecuta `npm install && npm start` para comenzar.

## 📄 Licencia

MIT License - Proyecto de código abierto