/////////////////////////////////
/////////// THREECLN ////////////
/////////////////////////////////

// s.options.memSize;
s.options.memSize_(2**14);
s.options.numOutputBusChannels = 10;


/////////// INIT ////////////////

MIDIIn.connectAll;
// Esperar poquito
p = ProxySpace.push(s.boot);
s.scope;
s.meter;
// p.makeTempoClock((110/120));
// p.quant = 4;
PirE.loadSamples();
// Esperar poquito
i = Buffer.read(s, "/home/em/.local/share/SuperCollider/Recordings/SC_200428_161124.aiff")

/////////// MASTER //////////////

~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.1}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;

/////////// BUFFERS /////////////

e =  Buffer.alloc(s, 44100*20, 1);
f =  Buffer.alloc(s, 44100*20, 1);

// El g tendría que ser una grabación del audio a través de zoom

g =  Buffer.alloc(s, 44100*20, 1);

/*
~input = {SoundIn.ar(0)*0.5};
~ampin = {Amplitude.ar(SoundIn.ar(0))};
~lag = {Lag.ar(~ampin*8, 0.5)};
*/

/////////// ONSET //////////////

(

~ons1 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};
~ons2 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};
// ~ons3 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};

)

p.fadeTime = 10;
s.meter;

/////////// SYNTH //////////////

~out = ~wpA1 + ~wpA2 ;
~out.free

(

~dema1 = {Lag.kr(Demand.kr(~ons1, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};
~dema2 = {Lag.kr(Demand.kr(~ons2, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};

// cambiar por buffers de grabación

~wpA1 = {arg amp = 0.25; (Pan2.ar(Warp1.ar(1, e, ~dema1, 1, 0.15, -1, 2, 0.2, 4))) * amp};
~wpA2 = {arg amp = 0.25; (Pan2.ar(Warp1.ar(1, f, ~dema2, 1, 0.15, -1, 2, 0.4, 4))) * amp};

)

// Salidas y grabación 

(

~out1 = {Out.ar(2, ~wpA1)};
~out2 = {Out.ar(4, ~wpA2)};
// ~out2 = {Out.ar(6, ~wpA3)};
~out3 = {arg amp; Out.ar(8, Pan2.ar(SoundIn.ar(0) * amp))};

)

/////////// MIDI //////////////

(

s.recChannels = 10;
s.prepareForRecord;

c = { arg src, chan, num, val;
	[chan,num,val].postln;

	// Amp
	if(num == 0, {
		~wpA1.set(\amp, val.linlin(0.0, 127.0, 0.0, 2.0));
	});
	if(num == 1, {
		~wpA2.set(\amp, val.linlin(0.0, 127.0, 0.0, 2.0));
	});
	if(num == 2, {
		~out3.set(\amp, val.linlin(0.0, 127.0, 0.0, 2.0)); 
	}); 

	// Local Rec
	if(num == 64 && val == 127, {
		e.free;
		e =  Buffer.alloc(s, 44100*20, 1);
		~rec1 = {arg run = 1; RecordBuf.ar(SoundIn.ar(0), e, doneAction:0, loop:0)};
	});
	if(num == 65 && val == 127, {
		f.free;
		f =  Buffer.alloc(s, 44100*5, 1);
		~rec2 = {arg run = 1; RecordBuf.ar(SoundIn.ar(0), f, doneAction:0, loop:0)};
	});

	// Threshold
	if(num == 16, {
		~ons1.set(\th, val.linlin(0.0, 127.0, 0.0, 1.0));
	});
	if(num == 17, {
		~ons2.set(\th, val.linlin(0.0, 127.0, 0.0, 1.0));
	});

	// Global Rec
	if(num == 45 && val == 127, {
		s.record;
	});
	if(num == 42 && val == 127, {
		s.stopRecording;
	});

};

MIDIIn.addFuncTo(\control, c);

)