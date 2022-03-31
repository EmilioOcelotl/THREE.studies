// three.studies 2.0 //

/////////// 1. Inicialización ////////////////

// s.options.memSize;
s.options.memSize_(2**14);
s.options.numOutputBusChannels = 10;

MIDIIn.connectAll;
// Esperar poquito
s.scope;
s.meter;
p = ProxySpace.push(s.boot);
// p.makeTempoClock((110/120));
// p.quant = 4;
PirE.loadSamples();
// Esperar poquito

i = Buffer.read(s, "/home/em/.local/share/SuperCollider/Recordings/SC_200428_161124.aiff");

g = Buffer.read(s, "/home/emi/Música/three2.0/separados/cello.wav");
g = Buffer.read(s, "/home/emi/Música/three2.0/separados/wpa1.wav");
g = Buffer.read(s, "/home/emi/Música/three2.0/separados/wpa2.wav");

/////////// 2. Procesamiento  //////////////

~outS = {DelayC.ar(~out.ar*0.5, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*0.5, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.2}
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

~wpA1 = {arg amp = 0.125; (Pan2.ar(Warp1.ar(1, e, ~dema1, 1, 0.15, -1, 0.3, 0.7, 4))) * amp};
~wpA2 = {arg amp = 0.125; (Pan2.ar(Warp1.ar(1, f, ~dema2, 1, 0.15, -1, 0.5, 0.4, 4))) * amp};

)

(

~out1 = {Out.ar(4, ~wpA1)};
~out2 = {Out.ar(6, ~wpA2)};
// ~out2 = {Out.ar(6, ~wpA3)};
~out3 = {arg amp; Out.ar(8, Pan2.ar(SoundIn.ar(0) * amp))};

)

s.meter

~post  = {PlayBuf.ar(2, g, BufRateScale.kr(g), doneAction: Done.freeSelf)*1};

/////////// 3. COntrol y grabación  //////////////

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
		// ~rec1 = {arg run = 1; RecordBuf.ar(~post, e, doneAction:0, loop:0)};

	});
	if(num == 65 && val == 127, {
		f.free;
		f =  Buffer.alloc(s, 44100*5, 1);
		~rec2 = {arg run = 1; RecordBuf.ar(SoundIn.ar(0), f, doneAction:0, loop:0)};
		// ~rec2 = {arg run = 1; RecordBuf.ar(~post, f, doneAction:0, loop:0)};
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
		// reproducir
		// ~post  = {PlayBuf.ar(2, g, BufRateScale.kr(g), doneAction: Done.freeSelf)*1};

	});
	if(num == 42 && val == 127, {
		s.stopRecording;
	});

};

MIDIIn.addFuncTo(\control, c);

///////////// 4. Post //////////////////
s.prepareForRecord("/home/emi/Música/three2.0/procesados/celloProc.wav");
s.prepareForRecord("/home/emi/Música/three2.0/procesados/wpa1Proc.wav");
s.prepareForRecord("/home/emi/Música/three2.0/procesados/wpa2Proc¨.wav");

s.stop

(
~post  = {PlayBuf.ar(2, g, BufRateScale.kr(g), doneAction: Done.freeSelf)*0.15};
~out = ~post;
s.record;
)

(
s.stopRecording;
~post.free;
)

s.meter;
