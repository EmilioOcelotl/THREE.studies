/*

THREE.studies - threecln

Pieza para espacio inmersivo.

El contexto de la pandemia dificultó el registro de la pieza. A continuación se presentan algunas soluciones.

Para resolver la electrónica de la pieza en modo remoto es necesario realizar un ruteo de audio vía Jack y Sonobus (para el caso del sistema operativo Linux).

El siguiente código es compatible con la modalidad de electrónica en vivo y se divide en 4 partes:

1. Inicialización - define el entorno de trabajo (proxyspace)  y parametros iniciales

2. Procesamiento - define el procesamiento de la señal final que se envía a la computadora remota y la transformación de la electrónica en vivo que se realiza por medio de programación al vuelo.

3. Control y grabación - Interactúa con un controlador MIDI, establece momentos de grabación, y cambios de amplitudes. Adicionalmente se relaciona con el inicio o final del registro final. El registro se graba en varias pistas para procesarlas de manera individual.

4. Post -Permite procesar pistas individuales y exportarlas en formatos que puedan ser reproducidos por un navegador

*/

/////////// 1. Inicialización ////////////////

// s.options.memSize;
s.options.memSize_(2**14);
s.options.numOutputBusChannels = 10;

MIDIIn.connectAll;
p = ProxySpace.push(s.boot);
// Esperar poquito
s.scope;
s.meter;
// p.makeTempoClock((110/120));
// p.quant = 4;
PirE.loadSamples();
// Esperar poquito

i = Buffer.read(s, "/home/em/.local/share/SuperCollider/Recordings/SC_200428_161124.aiff");

g = Buffer.read(s, "/home/em/Documentos/musicaUNAM/entrega/audio/separado/soundIn.wav");
g = Buffer.read(s, "/home/em/Documentos/musicaUNAM/entrega/audio/separado/wpa1.wav");
g = Buffer.read(s,"/home/emi/Música/threeBEASTs/canales/celloLimpio.wav" );

/////////// 2. Procesamiento  //////////////

~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.4}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;

e =  Buffer.alloc(s, 44100*20, 1);
f =  Buffer.alloc(s, 44100*20, 1);

// El g tendría que ser una grabación del audio a través de zoom
//g =  Buffer.alloc(s, 44100*20, 1);

/*
~input = {SoundIn.ar(0)*0.5};
~ampin = {Amplitude.ar(SoundIn.ar(0))};
~lag = {Lag.ar(~ampin*8, 0.5)};
*/

(

~ons1 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};
~ons2 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};
// ~ons3 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};

)

~out = ~wpA1 + ~wpA2 ;
// ~out = ~wpA1 + ~wpA2 + ~post;

// ~out.free

(

~dema1 = {Lag.kr(Demand.kr(~ons1, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};
~dema2 = {Lag.kr(Demand.kr(~ons2, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};

~wpA1 = {arg amp = 0.25; (Pan2.ar(Warp1.ar(1, e, ~dema1, 1, 0.15, -1, 2, 0.2, 4))) * amp};
~wpA2 = {arg amp = 0.25; (Pan2.ar(Warp1.ar(1, f, ~dema2, 1, 0.15, -1, 2, 0.4, 4))) * amp};

)

(

~out1 = {Out.ar(4, ~wpA1)};
~out2 = {Out.ar(6, ~wpA2)};
// ~out2 = {Out.ar(6, ~wpA3)};
~out3 = {arg amp; Out.ar(8, Pan2.ar(SoundIn.ar(0) * amp))};

)

~post  = {PlayBuf.ar(2, g, BufRateScale.kr(g), doneAction: Done.freeSelf)*1};



///////////// 4. Post //////////////////

s.options.numOutputBusChannels = 10;

p = ProxySpace.push(s.boot);

a = Buffer.read(s, "/home/emi/Música/threeoc/canalesSep/wp1.wav");
b = Buffer.read(s, "/home/emi/Música/threeoc/canalesSep/wp2.wav");
c = Buffer.read(s,"/home/emi/Música/threeoc/canalesSep/cello.wav" );

s.meter;

(

~wp1  = {PlayBuf.ar(2, a, BufRateScale.kr(a), doneAction: Done.freeSelf)*1};
~out1 = {Out.ar(2, ~wp1)};

~wp2  = {PlayBuf.ar(2, b, BufRateScale.kr(b), doneAction: Done.freeSelf)*1};
~out2 = {Out.ar(4, ~wp2)};

~cello  = {PlayBuf.ar(2, c, BufRateScale.kr(c), doneAction: Done.freeSelf)*1};
~out3 = {Out.ar(6, ~cello)};

)

(
s.stopRecording;
~post.free;
)

s.meter;
