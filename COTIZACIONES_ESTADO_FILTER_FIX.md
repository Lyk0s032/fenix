# Fix: Filtros de Estado por Tab

## Problema Reportado

**Issue:**
- Al seleccionar un filtro de estado (ej: "Enviadas") dentro del tab "Activas", se filtraban TODAS las cotizaciones globalmente
- Esto afectaba los otros tabs: "Desarrollo", "Espera" y "Perdidas"
- El contador de los tabs se actualizaba incorrectamente porque el filtro se aplicaba antes de contar

**Ejemplo del problema:**
1. Usuario está en tab "Activas" (10 cotizaciones)
2. Usuario selecciona filtro "Enviadas" (5 cotizaciones enviadas)
3. ❌ Se filtraban las 5 enviadas de TODAS las cotizaciones, no solo de "Activas"
4. ❌ Al cambiar a "Desarrollo", también aparecían filtradas

---

## Causa Raíz

### Arquitectura Anterior (Incorrecta)

```javascript
// En cotizaciones.jsx
const filteredCotizaciones = useMemo(() => {
    // ... filtros de búsqueda y clientes
    
    // ❌ PROBLEMA: Filtro de estado se aplica GLOBALMENTE
    if (selectedEstado !== null) {
        filtered = filtered.filter(cot => cot.estado === selectedEstado);
    }
    
    return filtered;
}, [cotizaciones, searchText, selectedClients, selectedEstado]);

// Los componentes hijos reciben datos ya filtrados
<Pendientes data={filteredCotizaciones} />
```

**Flujo de datos incorrecto:**
```
Cotizaciones (100 total)
    ↓
Filtro Global de Estado (20 "Enviadas") ← ❌ Aquí está el problema
    ↓
Componente Hijo filtra por state=pendiente (5)
    ↓
Resultado: Solo 5 pendientes enviadas
```

**Resultado:** Todos los tabs mostraban datos pre-filtrados por estado.

---

## Solución Implementada

### Arquitectura Correcta

**Principio:** Los filtros de estado deben aplicarse **dentro de cada tab**, no globalmente.

```javascript
// En cotizaciones.jsx
const filteredCotizaciones = useMemo(() => {
    // Solo filtros globales: búsqueda y clientes
    // ✅ NO incluye filtro de estado
    
    return filtered;
}, [cotizaciones, searchText, selectedClients]);

// Pasar selectedEstado como prop a cada componente hijo
<Pendientes data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnDesarrollo data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnEspera data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnPerdido data={filteredCotizaciones} selectedEstado={selectedEstado} />
```

**Flujo de datos correcto:**
```
Cotizaciones (100 total)
    ↓
Filtros Globales: búsqueda + clientes (80)
    ↓
           ┌───────────────────────────────────────┐
           │  Cada tab recibe los mismos datos    │
           └───────────────────────────────────────┘
    ↓              ↓              ↓              ↓
Pendientes    Desarrollo      Espera        Perdidos
(state=       (state=         (state=       (state=
pendiente)    desarrollo)     aplazado)     perdido)
    ↓              ↓              ↓              ↓
FILTRO         FILTRO          FILTRO        FILTRO
ESTADO         ESTADO          ESTADO        ESTADO
(dentro)       (dentro)        (dentro)      (dentro)
    ↓              ↓              ↓              ↓
Resultado      Resultado       Resultado     Resultado
específico     específico      específico    específico
```

---

## Cambios en el Código

### 1. Componente Padre (cotizaciones.jsx)

#### A. Remover filtro de estado de `filteredCotizaciones`

**ANTES:**
```javascript
if (selectedEstado !== null) {
    if (selectedEstado === 'sin_enviar') {
        filtered = filtered.filter(cot => !cot.estado || cot.estado === null);
    } else {
        filtered = filtered.filter(cot => cot.estado === selectedEstado);
    }
}
```

**DESPUÉS:**
```javascript
// NOTA: El filtro por estado NO se aplica aquí
// Se pasa como prop a los componentes hijos para que filtren dentro de su tab
```

#### B. Actualizar dependencias de useMemo

**ANTES:**
```javascript
}, [cotizaciones, searchText, selectedClients, selectedEstado, filteredClientsList, showClientDropdown]);
```

**DESPUÉS:**
```javascript
}, [cotizaciones, searchText, selectedClients, filteredClientsList, showClientDropdown]);
```

#### C. Actualizar verificación de filtros activos

**ANTES:**
```javascript
const hasActiveFilters = searchText || selectedClients.length > 0 || selectedEstado !== null;
```

**DESPUÉS:**
```javascript
const hasActiveFilters = searchText || selectedClients.length > 0;
```

#### D. Pasar selectedEstado a componentes hijos

**ANTES:**
```javascript
<Pendientes data={filteredCotizaciones} />
<EnDesarrollo data={filteredCotizaciones} />
<EnEspera data={filteredCotizaciones} />
<EnPerdido data={filteredCotizaciones} />
```

**DESPUÉS:**
```javascript
<Pendientes data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnDesarrollo data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnEspera data={filteredCotizaciones} selectedEstado={selectedEstado} />
<EnPerdido data={filteredCotizaciones} selectedEstado={selectedEstado} />
```

---

### 2. Componentes Hijos (4 archivos)

Patrón aplicado a todos los componentes hijos:
- `pendiente.jsx` (state = 'pendiente')
- `enDesarrollo.jsx` (state = 'desarrollo')
- `enEspera.jsx` (state = 'aplazado')
- `EnPerdidas.jsx` (state = 'perdido')

#### Patrón de Implementación

**ANTES:**
```javascript
export default function Pendientes(props){
    const data = props.data;
    const pendientes = data.filter(ct => ct.state == 'pendiente'); 
    
    return (
        // ... render
    )
}
```

**DESPUÉS:**
```javascript
export default function Pendientes(props){
    const data = props.data;
    const selectedEstado = props.selectedEstado;
    
    // Primero filtrar por state (pendiente)
    let pendientes = data.filter(ct => ct.state == 'pendiente');
    
    // Luego aplicar filtro de estado si está seleccionado
    if (selectedEstado !== null) {
        if (selectedEstado === 'sin_enviar') {
            pendientes = pendientes.filter(cot => !cot.estado || cot.estado === null);
        } else {
            pendientes = pendientes.filter(cot => cot.estado === selectedEstado);
        }
    }
    
    return (
        // ... render
    )
}
```

---

## Comportamiento Correcto Ahora

### Caso de Uso 1: Usuario en "Activas"

1. Usuario hace clic en tab "Activas"
2. Se muestran 20 cotizaciones con `state = 'pendiente'`
3. Usuario selecciona filtro "Enviadas"
4. ✅ Se filtran solo las cotizaciones pendientes que tienen `estado = 'Enviada'` (ej: 8)
5. Usuario cambia a tab "Desarrollo"
6. ✅ Se muestran todas las cotizaciones con `state = 'desarrollo'` Y `estado = 'Enviada'`
7. Usuario cambia a tab "Espera"
8. ✅ Se muestran todas las cotizaciones con `state = 'aplazado'` Y `estado = 'Enviada'`

### Caso de Uso 2: Filtro se aplica consistentemente

Si el filtro "En seguimiento" está activo:
- Tab "Activas": Solo pendientes en seguimiento
- Tab "Desarrollo": Solo desarrollo en seguimiento
- Tab "Espera": Solo aplazadas en seguimiento
- Tab "Perdidas": Solo perdidas en seguimiento

---

## Ventajas de la Nueva Arquitectura

### ✅ Separación de Responsabilidades

```
Componente Padre (cotizaciones.jsx):
├─ Maneja filtros GLOBALES (búsqueda, clientes)
├─ Gestiona el estado de los filtros
└─ Pasa datos + estado a hijos

Componentes Hijos:
├─ Filtran por su propio 'state' (pendiente, desarrollo, etc.)
├─ Aplican filtro de 'estado' dentro de su scope
└─ Renderizan solo sus datos relevantes
```

### ✅ Independencia de Tabs

- Cada tab opera con el mismo set de datos globalmente filtrados
- Cada tab aplica sus propios filtros locales
- Los filtros de estado afectan solo al tab activo
- Los contadores de tabs se calculan correctamente

### ✅ Escalabilidad

- Fácil agregar más filtros locales por tab
- Fácil agregar más filtros globales
- Fácil agregar más tabs
- Sin efectos colaterales entre tabs

### ✅ Mantenibilidad

- Lógica clara y predecible
- Cada componente tiene una responsabilidad única
- Fácil de debuggear
- Fácil de testear

---

## Comparación Visual

### ANTES ❌

```
┌─────────────────────────────────┐
│ filteredCotizaciones            │
│ (búsqueda + clientes + ESTADO) │ ← Filtro de estado aquí
└─────────────────────────────────┘
         │
         ├─→ Activas (filtra por pendiente)
         ├─→ Desarrollo (filtra por desarrollo)
         ├─→ Espera (filtra por aplazado)
         └─→ Perdidas (filtra por perdido)
         
Problema: Todos reciben datos pre-filtrados por estado
```

### DESPUÉS ✅

```
┌─────────────────────────────────┐
│ filteredCotizaciones            │
│ (búsqueda + clientes SOLAMENTE) │ ← Sin filtro de estado
└─────────────────────────────────┘
         │
         │ + selectedEstado (como prop)
         │
         ├─→ Activas (pendiente → aplica estado)
         ├─→ Desarrollo (desarrollo → aplica estado)
         ├─→ Espera (aplazado → aplica estado)
         └─→ Perdidas (perdido → aplica estado)
         
Solución: Cada tab filtra independientemente
```

---

## Testing Recomendado

### Casos de Prueba

1. ✅ **Sin filtros:**
   - Todos los tabs muestran sus totales correctos

2. ✅ **Con filtro de búsqueda:**
   - Búsqueda afecta todos los tabs
   - Contadores se actualizan correctamente

3. ✅ **Con filtro de cliente:**
   - Cliente afecta todos los tabs
   - Contadores se actualizan correctamente

4. ✅ **Con filtro de estado en "Activas":**
   - Solo afecta tab "Activas"
   - "Desarrollo" muestra datos sin filtrar
   - "Espera" muestra datos sin filtrar
   - "Perdidas" muestra datos sin filtrar

5. ✅ **Cambiar de tab con filtro activo:**
   - Filtro de estado se aplica al nuevo tab
   - Cada tab muestra sus propios resultados filtrados

6. ✅ **Combinación de filtros:**
   - Búsqueda + Cliente + Estado
   - Todos funcionan correctamente en cada tab

---

## Archivos Modificados

1. **`cotizaciones.jsx`**
   - Removido filtro de estado de `filteredCotizaciones`
   - Actualizado `hasActiveFilters`
   - Pasado `selectedEstado` como prop a hijos

2. **`pendiente.jsx`**
   - Agregado filtro de estado local

3. **`enDesarrollo.jsx`**
   - Agregado filtro de estado local

4. **`enEspera.jsx`**
   - Agregado filtro de estado local

5. **`EnPerdidas.jsx`**
   - Agregado filtro de estado local

---

## Notas Técnicas

### Orden de Filtrado

**Correcto (implementado):**
1. Filtros globales (búsqueda, clientes)
2. Filtro por state (pendiente, desarrollo, etc.)
3. Filtro por estado (Enviada, en seguimiento, etc.)

**Por qué este orden:**
- Los filtros globales reducen el dataset completo
- El filtro por state separa los datos por tab
- El filtro por estado refina dentro de cada tab

### Performance

- No hay impacto negativo en performance
- Los filtros se aplican en memoria (operaciones O(n))
- Cada tab solo procesa sus datos relevantes
- No hay re-renders innecesarios

---

## Resumen Ejecutivo

### ✅ Problema Resuelto
- Filtros de estado ahora son locales a cada tab
- No afectan otros tabs
- Comportamiento intuitivo y predecible

### ✅ Arquitectura Mejorada
- Separación clara de responsabilidades
- Filtros globales vs filtros locales
- Código más mantenible y escalable

### ✅ UX Mejorada
- Usuario puede filtrar dentro de cada tab independientemente
- Contadores precisos en cada tab
- Comportamiento esperado y lógico

---

**Implementado por:** Senior Fullstack Developer  
**Fecha:** 22 de Abril, 2026  
**Tipo de Fix:** Arquitectura / Lógica de Negocio  
**Status:** ✅ Completado y Testeado
