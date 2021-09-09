![th](https://github.com/EmilioOcelotl/THREE.studies/blob/main/threecln/img/bannerPrincipal.png)

# THREE.studies - threecln

para cellista, live coder y navegador

[threecln](http://threecln.piranhalab.cc) en modo fijo. Cello eléctrico: Iracema de Andrade.

## Partitura (gráfica)

La partitura resulta de la retroalimentación entre el espacio digital y la interpretación. Es posible tener una aproximación fijada con la siguiente partitura gráfica. 

[Versión en PDF](https://github.com/EmilioOcelotl/THREE.studies/blob/main/threecln/pdf/final.pdf)

![th](https://github.com/EmilioOcelotl/THREE.studies/blob/main/threecln/img/08.png)

## Archivos de audio

[threecln](http://threecln.piranhalab.cc) reproduce tres pares de audios posicionados en un espacio virtual. 

[Audios](https://github.com/EmilioOcelotl/THREE.studies/tree/main/threecln/sounds) estéreo separados. Señal del cello eléctrico y dos procesamientos. 

[Mezcla estéreo](https://github.com/EmilioOcelotl/THREE.studies/tree/main/threecln/sounds/threeclnStereo.ogg) de todos los canales.

## Electrónica en vivo

El siguiente código es compatible con la modalidad de electrónica en vivo y se divide en 4 partes: 

1. Inicialización - define el entorno de trabajo (proxyspace)  y parametros iniciales

2. Procesamiento - define el procesamiento de la señal final que se envía a la computadora remota y la transformación de la electrónica en vivo que se realiza por medio de programación al vuelo. 

3. Control y grabación - Interactúa con un controlador MIDI, establece momentos de grabación, y cambios de amplitudes. Adicionalmente se relaciona con el inicio o final del registro final. El registro se graba en varias pistas para procesarlas de manera individual. 

4. Post -Permite procesar pistas individuales y exportarlas en formatos que puedan ser reproducidos por un navegador 

[Código de SuperCollider](https://github.com/EmilioOcelotl/THREE.studies/blob/main/threecln/sc/musicaUNAM.scd)

## Para correr el espacio

`cd threecln`

`http-server .`

## Recursos

- [Sonobus](https://sonobus.net/)

- [Capture Audio and Video in HTML5](https://www.html5rocks.com/en/tutorials/getusermedia/intro/)

## Pendientes específicos del montaje en ocelotl

- [ ] Encadenar sonidos para usar solo un analisis
- [ ] Circulos
- [ ] Sin audio posicionado y con pocos objetos para móviles 