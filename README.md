
# Chess Battle - AI Chess Tournament

<img src="https://github.com/user-attachments/assets/b948c908-6cc1-4e79-a119-d3b066e0a5fa" >

**Chess Battle** es un proyecto emocionante que permite a dos poderosos motores de ajedrez basados en inteligencia artificial, **Stockfish** y **Leela Chess Zero (LC0)**, enfrentarse en una serie de partidas dinámicas. Este proyecto fue desarrollado como parte de la exploración de la interacción entre las IAs de ajedrez más avanzadas, y permite ver cómo compiten estas máquinas en un entorno controlado y visual.

## Características

- **Enfrentamientos entre IAs**: Stockfish y LC0 se desafían entre sí en un entorno de ajedrez clásico.
- **Interfaz de usuario intuitiva**: Visualiza las partidas en tiempo real con un tablero de ajedrez interactivo.
- **Descarga de partidas**: Al final de cada partida, puedes descargar la notación PGN completa para análisis posterior.
- **Implementación de IA**: Las IAs se alimentan de datos FEN y generan sus movimientos automáticamente.
- **Estadísticas detalladas**: Accede a información sobre el rendimiento de las IAs, estadísticas de victorias y más.

## Demo

Puedes probar el proyecto en el siguiente [enlace a la demo](#) (si está desplegado en un servidor en vivo). Si no es así, puedes ejecutarlo en tu propia máquina siguiendo las instrucciones a continuación.

## Cómo usarlo

### Requisitos previos

- **Node.js** 12.x o superior
- **NPM** (o **Yarn** si lo prefieres)
- **Stockfish** y **LC0** deben estar correctamente instalados (consulta la documentación de instalación para cada uno)

### Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu_usuario/chess-battle.git
   cd chess-battle
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Asegúrate de que **Stockfish** y **LC0** estén correctamente configurados en tu entorno. Si usas Docker o un entorno específico, consulta la documentación para instalar estos motores.

4. Inicia el servidor:

   ```bash
   npm start
   ```

5. Abre tu navegador y ve a `http://localhost:3000` para ver el tablero de ajedrez y las partidas en acción.

### Funcionalidad

- El tablero de ajedrez muestra el estado de la partida y permite visualizar los movimientos.
- Al final de la partida, puedes descargar el archivo PGN con la notación de la partida para su posterior análisis.

## Tecnologías utilizadas

- **Node.js** - Servidor backend
- **Chessboard.js** - Librería para la interfaz de tablero de ajedrez
- **Chess.js** - Para la gestión de las reglas y el estado del juego
- **Stockfish y LC0** - Motores de ajedrez basados en IA

## Contribuciones

Si deseas contribuir al proyecto, puedes hacerlo mediante **pull requests**. Asegúrate de seguir las pautas de codificación y de incluir una descripción clara de los cambios que realizaste.

1. Haz un fork de este repositorio.
2. Crea una nueva rama para tu característica (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva característica'`).
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
