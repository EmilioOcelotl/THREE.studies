# Bitácora threecln

Documentación de la realización / presentación de la obra

## Fechas límite

- [ ] 12 de febrero. Entrega final Música UNAM. Audio / video y versión impresa.

- [ ] 1 de marzo. Fecha límite para BEAST.

## Pruebas

### 4 de febrero 2021

Primer ensayo formal con Iracema. Idealmente aqui estarán conformadas las secciones para hacer pruebas de audio. 
Lo más importante: secciones y que quede definido el audio. Todavía no es necesario que quede delimitado lo visual. 

### Siguiente semana.

Tener lista la partitura. 
Pruebas con video. En caso de que sea muy complicado tener un sistema corriendo: usar el modo fijo de la rola. 

## Por hacer

Pendientes 

### Delimitación de secciones

Había pensado que el sonido manipulara a la imagen no solamente en términos audio reactivos sino también en términos del diseño del espacio.
Me imagino que la parte visual fuera ordenada por la interacción y las decisiones.
Siempre constante: particulas distribuidas que cambian en el tiempo 
Primer ordenamiento: forma y diseño de objetos que partan de esferas y que se distribuyan en el espacio. Adicionalmente otras formas. La idea es que se puedan construir 5 esferas u otros objetos (10 si es posible separar el audio del cello)  y que cada una fuera la representación de un audio posicionado.
Segundo ordenamiento: barras ?
Tercer ordenamiento: Interacción con el sistema conformado. 
Delimitación con ifs y setIntervals

## Versión impresa

Posibles objetos finales. Sugerencias de interacción con estos objetos a partir de densidades y materiales de objetos. 
Representación visual de fft por ejemplo
Contornos

### Resolución de problemas para pruebas. Grabación y audio. 

No hay equipo ni tiempo para hacer una grabación que splitee las cuerdas
Electrónica multicanal: 5 canales distintos. Para el retorno: mezclados en estéreo.
Ver la manera de que en la grabación cada canal quede grabado de manera independiente. 
Volumenes e instrucciones de clean y grabación asociados a un controlador midi. 

## Diseño visual

Colores, objetos distintos, detalles. Objetos sencillos.
Cámara automática 
Objetos que parten de un punto específico.
Retomar la idea de la cebolla. 
Integración audiovisual



Primer estudio de granulación audiovisual. Traspolación de objetos que producen sonido a imagen. 

- Dos posibles escenarios: presencial o a distancia.
- Primero resolver el modo presencial que permite hacer pruebas y ensayos. Es necesario para ambos casos
- Primera prueba deberá contemplar la captura de un flujo estéreo para enviarlo a la escena de three.js
- La computadora que procesa debe compartir señal de audio vía sonobus y al mismo tiempo transmitir al servidor icecast vía butt. 

## Para correr el sitio

`cd threecln`
`http-server .`

## Estructura

- Tres momentos duros cada uno con transiciones suaves distintas.

## Recursos necesarios para ejecutar la pieza

- Tarjeta de sonido
- Sonobus
- Butt
- Servidor Icecast
- Liga al sitio "presencial" 

## Pendientes

- Probar sonobus en modo multicanal
- Grabación y ruteo de audio en estéreo y multicanal por medio de html
- Relación audiovisual
- Control remoto de escenas 
- Objetos sonoros y visuales

## Propuestas para el futuro lejano

- Resolver la transmisión de audio con p2p de manera personalizada. 
- La pantalla como textura

## Enlaces

- [Sonobus](https://sonobus.net/)
- [Butt](http://danielnoethen.de/butt/)
- [Capture Audio and Video in HTML5](https://www.html5rocks.com/en/tutorials/getusermedia/intro/)

Este proyecto es posible gracias al desarrollo tecnológico de [PiranhaLab](https://github.com/piranhalab)
