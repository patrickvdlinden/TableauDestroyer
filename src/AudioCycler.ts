namespace TableauDestroyer {
    export class AudioCycler {
        private _songNames: string[];
        private _shuffle: boolean;
        private _volume = .5;

        private currentIndex = -1;
        private currentAudio: HTMLAudioElement = null;
        private shuffledSongs: string[] = [];

        public constructor(songNames: string[] = null) {
            this._songNames = songNames || [];

            console.log("AudioCycler: Constructor invoked, songNames: ", this._songNames);
        }

        public get songNames(): string[] {
            return this._songNames || [];
        }

        public set songNames(songNames: string[]) {
            this._songNames = songNames || [];

            if (this.shuffle) {
                this.shuffleSongs();
            }

            console.log("AudioCycler: Song list updated, new value:", this._songNames);
        }

        public get shuffle(): boolean {
            return this._shuffle || false;
        }

        public set shuffle(shuffle: boolean) {
            this._shuffle = shuffle || false;

            if (this._shuffle) {
                this.shuffleSongs();
            }

            console.log("AudioCycler: Shuffle updated, new value:", this._shuffle);
        }

        public get volume(): number {
            return this._volume || 0;
        }

        public set volume(volume: number) {
            if (isNaN(volume)) {
                volume = 0;
            }

            this._volume = Math.max(0, Math.min(1, volume));

            if (this.currentAudio) {
                this.currentAudio.volume = this._volume;
            }
        }

        public get paused(): boolean {
            return this.currentAudio !== null ? this.currentAudio.paused : true;
        }

        public pause() {
            console.log("AudioCycler: Pause requested");

            if (this.currentAudio !== null) {
                this.currentAudio.pause();
            }
        }

        public play(): void {
            console.log("AudioCycler: Play requested");

            if (this.currentAudio !== null && this.currentAudio.paused) {
                console.log("AudioCycler: Audio was already loaded, playing existing audio.");

                this.currentAudio.play();
            } else {
                this.reset();
                this.playNextSong();
            }
        }

        public stop(): void {
            console.log("AudioCycler: Stopping current song");

            if (this.currentAudio !== null) {
                this.currentAudio.pause();
                this.currentAudio.remove();
                this.currentAudio = null;
            }
        }

        public reset(): void {
            console.log("AudioCycler: Reset requested");

            this.stop();
            this.currentIndex = -1;
        }
        
        public playNextSong() {
            this.currentIndex++;

            if (this.currentIndex === this.songNames.length) {
                this.currentIndex = 0;
            }

        
            let songNames = this.shuffle ? this.shuffledSongs : this.songNames;
            let songName = songNames[this.currentIndex];

            console.log("AudioCycler: Next song requested:", songName);

            this.stop();
            this.loadAudio(
                () => this.currentAudio.play(),
                () => this.playNextSong(),
                () => this.playNextSong());
        }

        public preload(onLoaded: Function = null, onError: (e: ErrorEvent) => void = null) {
            console.log("AudioCycler: Preload requested");
            
            this.currentIndex = 0;
            this.loadAudio(onLoaded, onError, () => this.playNextSong());
        }

        private loadAudio(onLoaded: Function = null, onError: (e: ErrorEvent) => void = null, onEnded: Function = null) {
            let songNames = this.shuffle ? this.shuffledSongs : this.songNames;
            let songName = songNames[this.currentIndex];

            console.log("AudioCycler: Loading audio:", songName);

            this.currentAudio = new Audio(songName);
            this.currentAudio.volume = this.volume;
            this.currentAudio.loop = false;
            this.currentAudio.addEventListener("loadeddata", () => {
                console.log("AudioCycler: Completed loading audio:", songName);

    	        if (onLoaded) {
                    onLoaded();
                }
            });
            this.currentAudio.addEventListener("error", (e: ErrorEvent) => {
                console.error("AudioCycler: Could not load sound:", songName, "with error:", e);

                if (onError) {
                    onError(e);
                }
            });
            this.currentAudio.addEventListener("ended", () => {
                console.log("AudioCycler: Audio ended:", songName);

                if (onEnded) {
                    onEnded();
                }
            });
            this.currentAudio.load();
        }

        private shuffleSongs(): void {
            console.log("AudioCycler: Shuffling song list:", this.songNames);

            this.currentIndex = -1;
            this.shuffledSongs = [];
            let array = this._songNames.slice();

            while (array.length !== 0) {
                let index = Math.floor(array.length * Math.random());
                this.shuffledSongs.push(array[index]);
                array.splice(index, 1);
            }
            
            console.log("AudioCycler: Shuffled song list:", this.shuffledSongs);
        }
    }
}