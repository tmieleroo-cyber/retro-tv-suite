# Frontend retro para Smart TV

## Objetivo
Crear una experiencia de biblioteca retro pensada para televisión, legible a distancia y navegable con mando, teclado o control remoto.

## Pantalla principal
- Diseñar una interfaz oscura de estilo consola, con navegación lateral de gran formato.
- Incluir Inicio, Biblioteca, Favoritos y Mandos, además de accesos visibles a búsqueda y ajustes.
- Mostrar una selección destacada con arte visual, metadatos y acciones para jugar o ver detalles.
- Añadir carruseles de juegos con carátulas, progreso, favoritos y estados de guardado.
- Ofrecer filtros por NES, SNES, Game Boy y Game Boy Advance.

## Navegación de 10 pies
- Implementar foco claramente visible para control remoto y teclado.
- Permitir recorrer menú, categorías, juegos y acciones con flechas, Enter y Escape.
- Mantener textos grandes, contraste alto y objetivos de interacción amplios.

## Emparejamiento Wi‑Fi
- Crear una vista superpuesta accesible desde “Mandos”.
- Mostrar código de emparejamiento, dirección local, pasos breves y estado del jugador conectado.
- Incluir acciones funcionales para regenerar el código, cerrar y simular la conexión del mando.

## Acabado visual
- Crear carátulas originales coherentes para la biblioteca, sin depender de imágenes externas.
- Usar una paleta carbón con acentos lima, cian, coral y amarillo inspirados en hardware retro.
- Añadir transiciones de foco discretas, profundidad y microanimaciones respetando reducción de movimiento.
- Adaptar el diseño a televisores 16:9 y pantallas más estrechas.

## Contenido y calidad
- Mantener toda la interfaz, textos y metadatos en español.
- Añadir metadatos sociales y de buscadores específicos del producto.
- Verificar la vista en escritorio y móvil, la navegación por teclado y el estado de compilación.

## Detalles técnicos
- Implementación en la pantalla principal existente con React, TanStack Router y Tailwind CSS.
- Datos de muestra locales y estado interactivo en memoria; no requiere cuentas ni almacenamiento permanente.
- Iconografía con la biblioteca ya instalada y colores centralizados en el sistema de diseño.
