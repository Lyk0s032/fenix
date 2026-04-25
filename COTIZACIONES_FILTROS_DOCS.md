# Documentación: Sistema de Búsqueda y Filtros - Cotizaciones

## Resumen de Implementación

Se ha implementado un sistema completo de búsqueda y filtros para el módulo de cotizaciones, con un diseño minimalista y profesional que mantiene la coherencia con el estilo existente del proyecto.

---

## Funcionalidades Implementadas

### 1. Buscador Inteligente

**Ubicación:** Parte superior derecha, junto al título "Cotizaciones"

**Características:**
- Campo de búsqueda con icono de lupa
- Búsqueda en tiempo real por nombre de cotización
- Icono "X" para limpiar la búsqueda rápidamente
- Placeholder: "Buscar por nombre o cliente..."

**Comportamiento:**
- Si escribes texto sin coincidencias de clientes: busca por nombre de cotización
- Si hay coincidencias de clientes: muestra el dropdown de selección

---

### 2. Selector de Clientes con Tags

**Ubicación:** Mismo componente del buscador

**Características:**
- Dropdown autocomplete que aparece al escribir
- Búsqueda por:
  - Nombre de la empresa
  - NIT del cliente
- Muestra hasta 5 resultados simultáneos
- Los clientes seleccionados aparecen como tags azules
- Cada tag tiene un botón "X" para removerlo

**Comportamiento:**
1. Usuario escribe en el buscador
2. Si coincide con nombre o NIT de clientes, aparece el dropdown
3. Usuario selecciona un cliente del dropdown
4. El cliente aparece como tag azul debajo del buscador
5. Las cotizaciones se filtran para mostrar solo las de los clientes seleccionados
6. Puedes seleccionar múltiples clientes (filtrado combinado)

**UX Avanzada:**
- Dropdown se cierra al hacer clic fuera
- Dropdown se cierra al seleccionar un cliente
- No permite seleccionar el mismo cliente dos veces
- Extrae automáticamente lista única de clientes de las cotizaciones

---

### 3. Filtros de Estado

**Ubicación:** Debajo de los tabs principales (Activas, Desarrollo, Espera, Perdidas)

**Filtros Disponibles:**
1. **Sin enviar** - Filtra cotizaciones donde `estado === null`
2. **Enviadas** - Filtra cotizaciones donde `estado === 'Enviada'`
3. **En seguimiento** - Filtra cotizaciones donde `estado === 'en seguimiento'`
4. **Cierre** - Filtra cotizaciones donde `estado === 'cierre'`
5. **Sin respuesta** - Filtra cotizaciones donde `estado === 'sin respuesta'`

**Comportamiento:**
- Click en un filtro: se activa y filtra las cotizaciones
- Click nuevamente en el mismo filtro: se desactiva
- Solo se puede tener un filtro de estado activo a la vez
- Estilo activo: fondo azul (#046290) con texto blanco
- Estilo inactivo: fondo gris claro con borde

---

### 4. Botón "Limpiar Filtros"

**Ubicación:** Aparece automáticamente cuando hay filtros activos

**Funcionalidad:**
- Limpia el texto de búsqueda
- Remueve todos los clientes seleccionados
- Desactiva el filtro de estado
- Solo se muestra cuando hay al menos un filtro activo

---

## Arquitectura Técnica

### Estados del Componente

```javascript
const [searchText, setSearchText] = useState('');          // Texto del buscador
const [selectedClients, setSelectedClients] = useState([]); // Clientes seleccionados
const [selectedEstado, setSelectedEstado] = useState(null); // Estado seleccionado
const [showClientDropdown, setShowClientDropdown] = useState(false); // Visibilidad del dropdown
```

### Hooks Optimizados

**useMemo para `clientsList`:**
- Extrae lista única de clientes de las cotizaciones
- Se recalcula solo cuando cambian las cotizaciones

**useMemo para `filteredClientsList`:**
- Filtra clientes por búsqueda de texto
- Optimizado para búsqueda en tiempo real

**useMemo para `filteredCotizaciones`:**
- Aplica todos los filtros a las cotizaciones
- Cascada de filtros: búsqueda → clientes → estado
- Solo se recalcula cuando cambian las dependencias relevantes

**useEffect para cerrar dropdown:**
- Detecta clicks fuera del dropdown
- Limpia event listeners al desmontar

### Lógica de Filtrado

```javascript
// Prioridad de filtros:
1. Si hay texto Y coincidencias de clientes Y dropdown abierto:
   - No filtra por texto, espera selección de cliente

2. Si hay texto Y (no hay coincidencias de clientes O dropdown cerrado):
   - Filtra por nombre de cotización

3. Si hay clientes seleccionados:
   - Filtra cotizaciones de esos clientes (OR lógico)

4. Si hay estado seleccionado:
   - Filtra por campo 'estado' de la cotización
```

### Componentes NO Modificados

**Respetando la arquitectura existente:**
- `pendiente.jsx`
- `enDesarrollo.jsx`
- `enEspera.jsx`
- `EnPerdidas.jsx`

Estos componentes siguen recibiendo `data` (ahora filtrada) y aplican su propio filtro por `state` como antes.

---

## Estilos CSS

**Ubicación:** `src/css/index.css` (después de la línea 1352)

**Clases Principales:**
- `.searchDiv` - Contenedor principal del buscador
- `.searchInputWrapper` - Wrapper del input con iconos
- `.clientDropdown` - Dropdown de clientes
- `.clientTag` - Tags de clientes seleccionados
- `.estadoFilters` - Contenedor de filtros de estado
- `.estadoFilterBtn` - Botones de filtro individuales

**Características del Diseño:**
- Minimalista y limpio
- Colores consistentes con el proyecto:
  - Azul principal: `#046290`
  - Gris texto: `#525456`
  - Gris claro: `#919eab`
  - Bordes: `#e0e0e0`
- Transiciones suaves (0.2s)
- Border radius consistente (8px inputs, 16px-20px botones)
- Sombras sutiles para dropdown

---

## Compatibilidad

- **React Hooks:** useState, useMemo, useEffect, useRef
- **React Icons:** BsSearch, BsX (ya estaban instaladas)
- **Redux:** useSelector (sin cambios)
- **React Router:** useSearchParams (sin cambios)

**No se agregaron dependencias nuevas** ✅

---

## Flujo de Usuario

### Caso 1: Buscar por nombre de cotización
1. Usuario escribe "Proyecto Web" en el buscador
2. No hay clientes con ese texto
3. Sistema filtra cotizaciones cuyo nombre contenga "Proyecto Web"
4. Contador de tabs se actualiza automáticamente

### Caso 2: Filtrar por clientes
1. Usuario escribe "Acme" en el buscador
2. Aparece dropdown con cliente "Acme Corporation"
3. Usuario hace click en el cliente
4. Cliente aparece como tag azul
5. Solo se muestran cotizaciones de Acme Corporation
6. Usuario puede agregar más clientes

### Caso 3: Filtrar por estado
1. Usuario está en tab "Activas"
2. Usuario hace click en "Enviadas"
3. Solo se muestran cotizaciones activas que fueron enviadas
4. Botón "Enviadas" se pone azul

### Caso 4: Combinación de filtros
1. Usuario selecciona cliente "Acme Corporation"
2. Usuario selecciona estado "En seguimiento"
3. Se muestran solo cotizaciones de Acme que están en seguimiento
4. Usuario hace click en "Limpiar filtros"
5. Se restaura la vista completa

---

## Consideraciones de Rendimiento

✅ **Optimizado con useMemo:**
- Las listas grandes se filtran eficientemente
- Solo se recalculan cuando cambian las dependencias
- No hay renders innecesarios

✅ **Dropdown limitado:**
- Muestra máximo 5 resultados
- Evita lag con muchos clientes

✅ **Event listeners limpios:**
- Se remueven al desmontar el componente
- No hay memory leaks

---

## Mantenimiento Futuro

### Para agregar más filtros de estado:
Editar el array `estadosFilter` en `cotizaciones.jsx`:

```javascript
const estadosFilter = [
    { id: 'sin_enviar', label: 'Sin enviar', value: 'sin_enviar' },
    { id: 'Enviada', label: 'Enviadas', value: 'Enviada' },
    // ... agregar nuevo filtro aquí
    { id: 'nuevo_estado', label: 'Nuevo Estado', value: 'nuevo_estado' }
];
```

### Para modificar estilos:
Buscar en `src/css/index.css` las clases que comienzan con:
- `.searchDiv`
- `.estadoFilters`

---

## Testing Recomendado

**Casos de prueba:**
1. ✅ Búsqueda de cotización por nombre
2. ✅ Búsqueda de cliente por nombre
3. ✅ Búsqueda de cliente por NIT
4. ✅ Selección múltiple de clientes
5. ✅ Remoción de cliente desde tag
6. ✅ Activar/desactivar filtros de estado
7. ✅ Cambio de tab con filtros activos
8. ✅ Limpiar todos los filtros
9. ✅ Click fuera del dropdown
10. ✅ Navegación con datos filtrados

---

## Archivos Modificados

1. **`src/components/crm/embudo/routeEmbudo/cotizaciones.jsx`**
   - Agregado: Sistema completo de filtros
   - Líneas: ~313 (antes ~124)

2. **`src/css/index.css`**
   - Agregado: ~200 líneas de CSS después de línea 1352
   - Estilos para buscador, dropdown, tags y filtros

---

## No se Rompió Nada ✅

- ✅ Los tabs originales funcionan igual
- ✅ Los contadores se actualizan correctamente
- ✅ Los componentes hijos no fueron modificados
- ✅ La navegación existente se mantiene
- ✅ No hay errores de linter
- ✅ Código limpio y profesional

---

**Implementado por:** Senior Fullstack Developer
**Fecha:** 22 de Abril, 2026
**Enfoque:** Código limpio, performance optimizado, UX fluida
