prompts.md
--- prompt inicial
Ayudame creando un prompt inicial detallado para generar la interfaz position, una página para visualziar la gestión de diferentes candidatos de una posicion específica. 

En el prompt incluye el rol a tomar por la inteligencia, detalle especifico de que queremos conseguir, contexto del estado actual del proyecto y de, detalle paso a paso de lo que debemos conseguir y obtener. 

Tu misión en este ejercicio es crear la interfaz "position", una página en la que poder visualizar y gestionar los diferentes candidatos de una posición específica.

Se ha decidido que la interfaz sea tipo kanban, mostrando los candidatos como tarjetas en diferentes columnas que representan las fases del proceso de contratación, y pudiendo actualizar la fase en la que se encuentra un candidato solo arrastrando su tarjeta.Aquí tienes un ejemplo de interfaz posible:





Algunos de los requerimientos del equipo de diseño que se pueden ver en el ejemplo son:

Se debe mostrar el título de la posición en la parte superior, para dar contexto
Añadir una flecha a la izquierda del título que permita volver al listado de posiciones
Deben mostrarse tantas columnas como fases haya en el proceso
La tarjeta de cada candidato/a debe situarse en la fase correspondiente, y debe mostrar su nombre completo y su puntuación media
Si es posible, debe mostrarse adecuadamente en móvil (las fases en vertical ocupando todo el ancho)
Algunas observaciones:

Asume que la página de posiciones la encuentras 
Asume que existe la estructura global de la página, la cual incluye los elementos comunes como menú superior y footer. Lo que estás creando es el contenido interno de la página.
Para implementar la funcionalidad de la página cuentas con diversos endpoints API que ha preparado el equipo de backend:

GET /positions/:id/interviewFlow
Este endpoint devuelve información sobre el proceso de contratación para una determinada posición:

positionName: Título de la posición
interviewSteps: id y nombre de las diferentes fases de las que consta el proceso de contratación
{
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
GET /positions/:id/candidates
Este endpoint devuelve todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Proporciona la siguiente información:

name: Nombre completo del candidato
current_interview_step: en qué fase del proceso está el candidato.
score: La puntuación media del candidato
[
      {
           "fullName": "Jane Smith",
           "currentInterviewStep": "Technical Interview",
           "averageScore": 4
       },
       {
           "fullName": "Carlos García",
           "currentInterviewStep": "Initial Screening",
           "averageScore": 0            
       },        
       {
           "fullName": "John Doe",
           "currentInterviewStep": "Manager Interview",
           "averageScore": 5            
      }    
 ]

 
PUT /candidates/:id/stage
Este endpoint actualiza la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico, a través del parámetro "new_interview_step" y proporionando el interview_step_id correspondiente a la columna en la cual se encuentra ahora el candidato.

{
     "applicationId": "1",
     "currentInterviewStep": "3"
 }
{    
    "message": "Candidate stage updated successfully",
     "data": {
         "id": 1,
         "positionId": 1,
         "candidateId": 1,
         "applicationDate": "2024-06-04T13:34:58.304Z",
         "currentInterviewStep": 3,
         "notes": null,
         "interviews": []    
     }
 }

--- prompt mejorado: 

Ultimpa modificación: añade la sinstrucciones para crar tambien un nuevo enpoint en el backend GET /positions este es el detalle de la tabla positions. 

Cada position tiene que tener al menos, los mismos datos del mock, más sus ids. 

-- public."Position" definition

-- Drop table

-- DROP TABLE public."Position";

CREATE TABLE public."Position" (
	id serial4 NOT NULL,
	"companyId" int4 NOT NULL,
	"interviewFlowId" int4 NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	status text DEFAULT 'Draft'::text NOT NULL,
	"isVisible" bool DEFAULT false NOT NULL,
	"location" text NOT NULL,
	"jobDescription" text NOT NULL,
	requirements text NULL,
	responsibilities text NULL,
	"salaryMin" float8 NULL,
	"salaryMax" float8 NULL,
	"employmentType" text NULL,
	benefits text NULL,
	"companyDescription" text NULL,
	"applicationDeadline" timestamp(3) NULL,
	"contactInfo" text NULL,
	CONSTRAINT "Position_pkey" PRIMARY KEY (id)
);


-- public."Position" foreign keys

ALTER TABLE public."Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."Position" ADD CONSTRAINT "Position_interviewFlowId_fkey" FOREIGN KEY ("interviewFlowId") REFERENCES public."InterviewFlow"(id) ON DELETE RESTRICT ON UPDATE CASCADE;


# 🧠 Prompt Completo para Crear la Interfaz `Position` (Vista Kanban de Gestión de Candidatos)

---

## 🎯 Rol a Asumir

Actúa como un **diseñador e ingeniero front-end senior** especializado en React y experiencia de usuario. Tu objetivo es implementar una página interna llamada `Position` en un sistema de seguimiento de talento que permita visualizar y gestionar candidatos a través de una interfaz Kanban.

---

## ✅ Objetivo General

Crear la vista de una posición específica con un **tablero tipo Kanban** donde se puedan:
- Visualizar todas las fases del proceso de entrevistas.
- Mostrar candidatos como tarjetas en la fase correspondiente.
- Permitir cambiar de fase arrastrando la tarjeta (drag & drop).
- Reflejar el cambio mediante una llamada API.
- Ser responsiva y usable desde móvil.

---

## 🌐 Estado y Estructura del Proyecto

Este es un proyecto full-stack compuesto por:

### Frontend

- **Framework:** React (Create React App)
- **Ubicación del código:** `/frontend/src/`
- **Funcionalidades relevantes:**
  - Páginas en `/pages/`
  - Componentes en `/components/`
  - Llamadas API en `/api/`
  - Custom hooks en `/hooks/`
- **Puerto local:** `http://localhost:3000`

### Backend

- **Framework:** Express con TypeScript
- **ORM:** Prisma
- **Estructura en `/backend/src/`:**
  - `application/`: Lógica de aplicación
  - `domain/`: Modelos de negocio
  - `infrastructure/`: Acceso a base de datos
  - `presentation/`: Controladores
  - `routes/`: Definiciones de endpoints
- **Puerto local:** `http://localhost:3010`

### Base de Datos

- PostgreSQL corriendo en Docker
- Variables de entorno definidas en `.env`
- Prisma para migraciones y acceso ORM

---

## 🔌 Endpoints API a Utilizar

### 1. Obtener Fases del Proceso

**GET** `/positions/:id/interviewFlow`

```json
{
  "positionName": "Senior backend engineer",
  "interviewFlow": {
    "id": 1,
    "description": "Standard development interview process",
    "interviewSteps": [
      { "id": 1, "name": "Initial Screening" },
      { "id": 2, "name": "Technical Interview" },
      { "id": 3, "name": "Manager Interview" }
    ]
  }
}
```

---

### 2. Obtener Candidatos por Posición

**GET** `/positions/:id/candidates`

```json
[
  { "fullName": "Jane Smith", "currentInterviewStep": "Technical Interview", "averageScore": 4 },
  { "fullName": "Carlos García", "currentInterviewStep": "Initial Screening", "averageScore": 0 },
  { "fullName": "John Doe", "currentInterviewStep": "Manager Interview", "averageScore": 5 }
]
```

---

### 3. Actualizar Etapa del Candidato

**PUT** `/candidates/:id/stage`

Request:
```json
{
  "applicationId": "1",
  "currentInterviewStep": "3"
}
```

Response:
```json
{
  "message": "Candidate stage updated successfully",
  "data": {
    "id": 1,
    "positionId": 1,
    "candidateId": 1,
    "currentInterviewStep": 3
  }
}
```

---

## 🧭 Instrucciones Paso a Paso

1. **En la página `frontend/src/components/Positions.tsx`**:
   - Añadir un botón "Ver proceso" que al hacer clic navegue a la nueva página `Position.tsx`. Que contenga el nuevo componente y un link a la págian de posiciones

2. **Eliminar datos de mock existente en la pagina Positions.tsx** y sustituirlo por llamadas reales a un nuevo enpoint get /positions que devuelva un listado de todas las posiciones abiertas. 

3. **Crear un nuevo servicio en `frontend/src/services/positionService.ts`**:
   - Debe contener métodos para:
     - `getInterviewFlow(positionId)`
     - `getCandidates(positionId)`
     - `updateCandidateStage(applicationId, interviewStepId)`

4. **Crear una interfaz Kanban** en la nueva página:
   - Una columna por fase.
   - Tarjetas de candidatos con:
     - Nombre completo
     - Puntuación media (o "Sin evaluar")
   - Implementar drag & drop con `@dnd-kit` o `react-beautiful-dnd`.

5. **Cuando se suelta una tarjeta en otra columna**, hacer PUT al endpoint de cambio de fase del candidato.

6. **Hacer el diseño responsivo**, mostrando columnas en vertical en móviles y ajustando el contenido al ancho del contenedor.

---

## 📁 Estructura Recomendada para el Frontend

```
frontend/src/
├── components/
│   ├── Positions.tsx
│   └── PositionDetails/
│       ├── PositionDetails.tsx
│       ├── PositionHeader.tsx
│       ├── KanbanBoard.tsx
│       └── CandidateCard.tsx
├── services/
│   ├── positionService.ts
│   └── candidateService.ts
├── hooks/
│   └── usePositionData.ts
```

---

## ✅ Resultado Esperado

Una nueva página `PositionDetails` que:
- Se accede desde `Positions.tsx`
- Carga datos reales desde la API
- Muestra el proceso de entrevistas en formato Kanban
- Permite cambiar candidatos de fase arrastrando tarjetas
- Funciona correctamente en escritorio y móvil

---

Este es actualmente los datos que se recuperarn de mockPositions: 
"type Position = {
    title: string;
    manager: string;
    deadline: string;
    status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};

const mockPositions: Position[] = [
    { title: 'Senior Backend Engineer', manager: 'John Doe', deadline: '2024-12-31', status: 'Abierto' },
    { title: 'Junior Android Engineer', manager: 'Jane Smith', deadline: '2024-11-15', status: 'Contratado' },
    { title: 'Product Manager', manager: 'Alex Jones', deadline: '2024-07-31', status: 'Borrador' }
];" 

-- 

Prompt final: 
---


# 🧠 Prompt Completo para Crear la Interfaz `Position` (Vista Kanban de Gestión de Candidatos)

---

## 🎯 Rol a Asumir

Actúa como un **diseñador e ingeniero front-end senior** especializado en React y experiencia de usuario. Tu objetivo es implementar una página interna llamada `Position` en un sistema de seguimiento de talento que permita visualizar y gestionar candidatos a través de una interfaz Kanban.

---

## ✅ Objetivo General

Crear la vista de una posición específica con un **tablero tipo Kanban** donde se puedan:
- Visualizar todas las fases del proceso de entrevistas.
- Mostrar candidatos como tarjetas en la fase correspondiente.
- Permitir cambiar de fase arrastrando la tarjeta (drag & drop).
- Reflejar el cambio mediante una llamada API.
- Ser responsiva y usable desde móvil.

---

## 🌐 Estado y Estructura del Proyecto

### Frontend

- **Framework:** React (Create React App)
- **Ubicación del código:** `/frontend/src/`
- **Funcionalidades relevantes:**
  - Páginas en `/pages/`
  - Componentes en `/components/`
  - Llamadas API en `/api/`
  - Custom hooks en `/hooks/`
- **Puerto local:** `http://localhost:3000`

### Backend

- **Framework:** Express con TypeScript
- **ORM:** Prisma
- **Estructura en `/backend/src/`:**
  - `application/`: Lógica de aplicación
  - `domain/`: Modelos de negocio
  - `infrastructure/`: Acceso a base de datos
  - `presentation/`: Controladores
  - `routes/`: Definiciones de endpoints
- **Puerto local:** `http://localhost:3010`

### Base de Datos

- PostgreSQL corriendo en Docker
- Variables de entorno definidas en `.env`
- Prisma para migraciones y acceso ORM

---

## 🔌 Endpoints API a Utilizar

### 1. Obtener Fases del Proceso

**GET** `/positions/:id/interviewFlow`

### 2. Obtener Candidatos por Posición

**GET** `/positions/:id/candidates`

### 3. Actualizar Etapa del Candidato

**PUT** `/candidates/:id/stage`

### 4. Nuevo Endpoint: Obtener todas las posiciones

**GET** `/positions`

**Instrucciones para implementarlo**:
1. Crear un handler en el backend similar a: @positionRoutes.ts @positionController.ts 
- id
- title
- status
- location
- applicationDeadline
- manager (si está disponible en la relación)
- interviewFlowId
- companyId

```ts

Actualizar o añadir los tests correspondientes.
// Ejemplo de respuesta esperada
[
  {
    "id": 1,
    "title": "Senior Backend Engineer",
    "status": "Abierto",
    "location": "Barcelona",
    "applicationDeadline": "2024-12-31",
    "companyId": 1,
    "interviewFlowId": 1
  },
  ...
]
```

---

## 🧭 Instrucciones Paso a Paso

1. **En la página `frontend/src/components/Positions.tsx`**: @Positions.tsx 
   - Añadir al boton botón "Ver proceso" para cada posición que navegue a `/position/:id`.

2. **Eliminar mocks actuales** (como `mockPositions`) y sustituirlos por una llamada a `GET /positions`.

3. **Crear un nuevo servicio en `frontend/src/services/positionService.ts`**:
   - Métodos:
     - `getAllPositions()`
     - `getInterviewFlow(positionId)`
     - `getCandidates(positionId)`
     - `updateCandidateStage(applicationId, interviewStepId)`

4. **Crear la interfaz Kanban en un nuevo fichero `Position.tsx`**: accesible desde /position/:id
   - Una columna por cada fase del proceso.
   - Cada tarjeta muestra `fullName` y `averageScore` o "Sin evaluar".
   - Usar `@dnd-kit` o `react-beautiful-dnd`.

5. **Cuando se suelta una tarjeta en otra columna**, hacer PUT a `/candidates/:id/stage`.

6. **Diseño responsivo**:
   - Columnas apiladas en móvil.
   - Tarjetas adaptables a pantalla.

---

## 📁 Estructura Recomendada para el Frontend

```
frontend/src/
├── components/
│   ├── Positions.tsx
│   └── PositionDetails/
│       ├── PositionDetails.tsx
│       ├── PositionHeader.tsx
│       ├── KanbanBoard.tsx
│       └── CandidateCard.tsx
├── services/
│   ├── positionService.ts
│   └── candidateService.ts
├── hooks/
│   └── usePositionData.ts
```

---

## ✅ Resultado Esperado

Una experiencia de usuario fluida que:
- Permite ver todas las posiciones desde `Positions.tsx`
- Accede a una página de detalle tipo kanban desde cada posición
- Carga candidatos desde el backend
- Permite moverlos entre fases y actualiza su estado
- Funciona perfectamente en dispositivos móviles

---

## 📦 Datos actuales del mock a reemplazar

```ts
type Position = {
    title: string;
    manager: string;
    deadline: string;
    status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};

const mockPositions: Position[] = [
    { title: 'Senior Backend Engineer', manager: 'John Doe', deadline: '2024-12-31', status: 'Abierto' },
    { title: 'Junior Android Engineer', manager: 'Jane Smith', deadline: '2024-11-15', status: 'Contratado' },
    { title: 'Product Manager', manager: 'Alex Jones', deadline: '2024-07-31', status: 'Borrador' }
];
```

👉 Sustituir este mock por una llamada a `GET /positions` y actualizar el modelo según el nuevo contrato.

---

--- prompt para implementación de drag and drop
Implementa la funcionalidad de drag and drop en el tablero Kanban para permitir mover candidatos entre diferentes etapas del proceso de entrevista. La implementación debe:

1. Permitir arrastrar y soltar candidatos entre columnas
2. Mostrar feedback visual durante el arrastre
3. Actualizar el estado del candidato en el backend
4. Manejar errores y revertir cambios si la actualización falla
5. Mantener la consistencia del estado local y remoto

Detalles técnicos:

- Usar @dnd-kit/core y @dnd-kit/sortable para la implementación
- Implementar DragOverlay para mostrar el candidato durante el arrastre
- Manejar el estado de arrastre con useDroppable y useSortable
- Actualizar el estado optimistamente antes de la llamada a la API
- Revertir cambios si la actualización falla

--- prompt para traducción al español
Traduce toda la interfaz de usuario al español, incluyendo:

1. Textos estáticos:
   - Botones y enlaces
   - Mensajes de estado
   - Etiquetas de información
   - Mensajes de error

2. Textos dinámicos:
   - Nombres de etapas
   - Estados de candidatos
   - Mensajes de feedback

3. Mejoras en la presentación:
   - Añadir etiquetas <strong> para mejor legibilidad
   - Mantener consistencia en el formato
   - Asegurar que los textos traducidos no rompan el diseño

--- prompt para corrección de errores
Corrige los siguientes errores en la implementación:

1. Error de exportación en App.js:
   - Cambiar export a export default en Position.tsx
   - Asegurar que la importación en App.js coincida

2. Error de módulo @dnd-kit/modifiers:
   - Instalar el paquete requerido
   - Actualizar las importaciones
   - Verificar la compatibilidad de versiones

3. Error de API 400 Bad Request:
   - Corregir el formato de los datos enviados
   - Asegurar que los tipos de datos coincidan
   - Implementar logging para debugging
   - Manejar errores apropiadamente

--- prompt para mejoras de UI/UX
Implementa las siguientes mejoras en la interfaz:

1. Navegación:
   - Añadir enlace de retorno a /positions
   - Centrar el tablero Kanban en la página
   - Mejorar la jerarquía visual

2. Diseño Responsivo:
   - Ajustar el layout para móviles
   - Optimizar el espacio en pantallas pequeñas
   - Mejorar la experiencia de drag and drop en móvil

3. Feedback Visual:
   - Mejorar los estados de arrastre
   - Añadir animaciones suaves
   - Implementar indicadores de estado

4. Accesibilidad:
   - Añadir roles ARIA apropiados
   - Mejorar el contraste de colores
   - Asegurar navegación por teclado

--- prompt para optimización de rendimiento
Optimiza el rendimiento de la aplicación:

1. Estado y Renderizado:
   - Implementar memoización donde sea necesario
   - Optimizar las actualizaciones de estado
   - Reducir re-renderizados innecesarios

2. Llamadas a API:
   - Implementar caché de datos
   - Optimizar las llamadas concurrentes
   - Manejar estados de carga eficientemente

3. Drag and Drop:
   - Optimizar el rendimiento durante el arrastre
   - Mejorar la detección de colisiones
   - Reducir la sobrecarga de eventos

4. Responsive Design:
   - Optimizar el rendimiento en móviles
   - Implementar lazy loading donde sea necesario
   - Reducir el tamaño del bundle
