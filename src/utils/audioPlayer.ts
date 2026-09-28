// Helper for playing Gemini TTS raw PCM audio (24kHz, 1-channel, 16-bit little-endian)
export class PcmPlayer {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isPaused: boolean = false;
  private startTime: number = 0;
  private pauseOffset: number = 0;
  private audioBuffer: AudioBuffer | null = null;

  public init(base64Data: string, sampleRate = 24000) {
    this.stop();
    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass({ sampleRate });
    this.audioBuffer = this.audioCtx.createBuffer(1, float32Array.length, sampleRate);
    this.audioBuffer.copyToChannel(float32Array, 0);
    this.pauseOffset = 0;
    this.isPaused = false;
  }

  public play(onEnded?: () => void) {
    if (!this.audioBuffer || !this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.currentSource = this.audioCtx.createBufferSource();
    this.currentSource.buffer = this.audioBuffer;
    this.currentSource.connect(this.audioCtx.destination);

    this.currentSource.onended = () => {
      if (!this.isPaused && onEnded) {
        onEnded();
      }
    };

    this.startTime = this.audioCtx.currentTime - this.pauseOffset;
    this.currentSource.start(0, this.pauseOffset);
    this.isPaused = false;
  }

  public pause() {
    if (this.currentSource && this.audioCtx) {
      this.pauseOffset = this.audioCtx.currentTime - this.startTime;
      this.isPaused = true;
      try {
        this.currentSource.stop();
      } catch (e) {
        // ignore
      }
      this.currentSource = null;
    }
  }

  public resume(onEnded?: () => void) {
    if (this.isPaused) {
      this.play(onEnded);
    }
  }

  public stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // ignore
      }
      this.currentSource = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {
        // ignore
      }
      this.audioCtx = null;
    }
    this.audioBuffer = null;
    this.pauseOffset = 0;
    this.isPaused = false;
  }
}
