/////////////////////////////////////////////
/////////////////// three ///////////////////
/////////////////////////////////////////////

/////////////////// init ///////////////////

(
s.options.memSize_(2**14);
s.options.numOutputBusChannels = 10;
m = NetAddr("localhost", 41234);// local machine
MIDIIn.connectAll;

)


p = ProxySpace.push(s.boot);
p.makeTempoClock((140/120));
p.quant = 4;
s.meter;

~outS = {DelayC.ar(~out.ar*0.5, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*0.5, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.2}s
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;

// 50 segundos máximo

e =  Buffer.alloc(s, 44100*5, 1);
f =  Buffer.alloc(s, 44100*10, 1)

/////////////////// onsets ///////////////////

// Podrían funcionar para controlar algunos aspectos de la cámara

(

~ons1 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};
~ons2 = { arg th = 0.5; Onsets.kr(FFT(LocalBuf(512), SoundIn.ar(0)), th)};

)

/////////////////// salida final ///////////////////

~out = ~wpA1 + ~wpA2 ;

/////////////////// procesamiento ///////////////////

(

~dema1 = {Lag.kr(Demand.kr(~ons1, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};
~dema2 = {Lag.kr(Demand.kr(~ons2, 0, Dseq(Array.rand(12, 0.2, 0.99999), inf)), 1)};

// Aislar otros parametros para no tener que livecodearlos

~wpA1 = {arg amp = 0.125; (Pan2.ar(Warp1.ar(1, e, ~dema1, 1, 0.15, -1, 0.3, 0.7, 4))) * amp};
~wpA2 = {arg amp = 0.125; (Pan2.ar(Warp1.ar(1, f, ~dema2, 1, 0.15, -1, 0.5, 0.4, 4))) * amp};

)

/////////////////// ruteo de los canales ///////////////////

(

~out1 = {Out.ar(4, ~wpA1)};
~out2 = {Out.ar(6, ~wpA2)};
// ~out2 = {Out.ar(6, ~wpA3)};
~out3 = {arg amp; Out.ar(8, Pan2.ar(SoundIn.ar(0) * amp))};

)

/////////////////// control y gabación ///////////////////

(

s.recChannels = 10;
s.prepareForRecord;

z = 0;

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
		e =  Buffer.alloc(s, 44100*10, 1);
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
		100.do({"inicio".post});
		// reproducir
		// ~post  = {PlayBuf.ar(2, g, BufRateScale.kr(g), doneAction: Done.freeSelf)*1};

	});
	if(num == 42 && val == 127, {
		s.stopRecording;
	});

	if(num == 44 && val == 127, {
		z = z + 1;
		100.do({z.post});

		/// PRIMER momento

		if(z == 1){
			m.sendMsg("/scl", 0.95);
			m.sendMsg("/sclX", 1.05);
			m.sendMsg("/sclY", 0.95);
			m.sendMsg("/sat", 1);
			m.sendMsg("/iniciar", 1);
			m.sendMsg("/colorHydra", 0.15);
			// m.sendMsg("/switchHydra",0);
			m.sendMsg("/osci", rrand(4.0, 10.0));
			m.sendMsg("/kal", rrand(3, 10));
			m.sendMsg("/voro", rrand(1, 5));
			m.sendMsg("/vorvel", rand(2.0));
			m.sendMsg("/ang", rand(10.0));
			m.sendMsg("/rotvel", rand(2.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(20, 0, 1700)*2,inf)), 4)};
			m.sendMsg("/switchHydra",0);

		};

		/// SEGUNDO ESTUDIO

		if(z == 2){
			m.sendMsg("/scl", 0.99);
			m.sendMsg("/sclX", 1.01);
			m.sendMsg("/sclY", 0.99);
			m.sendMsg("/sat", 1);
			m.sendMsg("/iniciar", 1);
			m.sendMsg("/colorHydra", 0.15);
			// m.sendMsg("/switchHydra",0);
			m.sendMsg("/osci", rrand(14.0, 20.0));
			m.sendMsg("/kal", rrand(13, 30));
			m.sendMsg("/voro", rrand(10, 25));
			m.sendMsg("/vorvel", rand(22.0));
			m.sendMsg("/ang", rand(20.0));
			m.sendMsg("/rotvel", rand(12.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(20, 0, 1700)*3,inf)), 4)};
			m.sendMsg("/switchHydra",0);
		};

		// TERCER ESTUDIO

		if(z == 3){
			m.sendMsg("/scl", 0.29);
			m.sendMsg("/sclX", 1.2);
			m.sendMsg("/sclY", 0.8);
			m.sendMsg("/sat", 1);
			m.sendMsg("/iniciar", 1);
			m.sendMsg("/colorHydra", 0.25);
			// m.sendMsg("/switchHydra",0);
			m.sendMsg("/osci", rrand(1.0, 4.0));
			m.sendMsg("/kal", rrand(1, 3));
			m.sendMsg("/voro", rrand(1, 2));
			m.sendMsg("/vorvel", rand(1.0));
			m.sendMsg("/ang", rand(20.0));
			m.sendMsg("/rotvel", rand(12.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(-2000, 0, 2000)*3,inf)), 4)};
			m.sendMsg("/switchHydra",0);
		};

	});

	if(num == 43 && val == 127, {
		z = z - 1;
		100.do({z.post});
	});

	if(num == 58 && val == 127, {
		m.sendMsg("/rtSph", 1);
	});

	if(num == 59 && val == 127, {
		m.sendMsg("/rtCub", 1);
	});

	if(num ==46 && val == 127, {

		/// PRIMER ESTUDIO

		if(z == 1){
			m.sendMsg("/osci", rrand(4.0, 10.0));
			m.sendMsg("/kal", rrand(3, 10));
			m.sendMsg("/voro", rrand(1, 5));
			m.sendMsg("/vorvel", rand(2.0));
			m.sendMsg("/ang", rand(10.0));
			m.sendMsg("/rotvel", rand(2.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(20, 0, 1700)*2,inf)), 4)};
			m.sendMsg("/switchHydra",0);

		};

		/// SEGUNDO ESTUDIO

		if(z == 2){
			m.sendMsg("/osci", rrand(4.0, 10.0));
			m.sendMsg("/kal", rrand(3, 10));
			m.sendMsg("/voro", rrand(1, 5));
			m.sendMsg("/vorvel", rand(2.0));
			m.sendMsg("/ang", rand(10.0));
			m.sendMsg("/rotvel", rand(2.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(20, 0, 1700)*3,inf)), 4)};
			m.sendMsg("/switchHydra",1);
		};

		// TERCER ESTUDIO

		if(z == 3){
			m.sendMsg("/osci", rrand(0.5, 1.5));
			m.sendMsg("/kal", rrand(3, 10));
			m.sendMsg("/voro", rrand(1, 5));
			m.sendMsg("/vorvel", rand(2.0));
			m.sendMsg("/ang", rand(3.0));
			m.sendMsg("/rotvel", rand(12.0));
			// m.sendMsg("/mod", rand2(500.0));
			OSCdef( \mod, {|msg|
				var data = msg[3];
				m.sendMsg("/mod", data);
			}, '/modDef');
			~modSend = {SendReply.kr(Impulse.kr(~tempo*60), '/modDef', ~mod.kr)};
			~mod = {Lag.kr(Demand.kr(~ons1, 0, Drand(Array.rand(-2000, 0, 1700)*3,inf)), 4)};
			m.sendMsg("/switchHydra",2);

		};

	if(num == 61 && val == 127, {
		// m.sendMsg("/solid");
		m.sendMsg("/retroB", 0);

	});
	if(num == 62 && val == 127, {
		// m.sendMsg("/solid");
		m.sendMsg("/retroB", 1);

	});


	});


};

MIDIIn.addFuncTo(\control, c);

)
z