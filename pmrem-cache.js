// PMREMGenerator with LRU Cache
// Reuses environment map processing and manages memory efficiently

// THREE is imported globally from index.html
export class PMREMCache {
    constructor(renderer, maxSize = 5, THREE) {
        this.renderer = renderer;
        this.THREE = THREE;
        this.pmremGenerator = new THREE.PMREMGenerator(renderer);
        this.pmremGenerator.compileEquirectangularShader();
        this.cache = new Map();
        this.lruKeys = [];
        this.maxSize = maxSize;
    }

    get(texture, key) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const index = this.lruKeys.indexOf(key);
            if (index > -1) {
                this.lruKeys.splice(index, 1);
            }
            this.lruKeys.push(key);

            console.log(`✅ PMREM Cache HIT: ${key}`);
            return this.cache.get(key);
        }

        // Generate new environment map
        console.log(`🔄 PMREM Cache MISS: ${key} - Generating...`);
        const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;

        // Add to cache
        this.cache.set(key, envMap);
        this.lruKeys.push(key);

        // Evict oldest if over limit
        if (this.lruKeys.length > this.maxSize) {
            const oldestKey = this.lruKeys.shift();
            const oldMap = this.cache.get(oldestKey);
            if (oldMap) {
                oldMap.dispose();
                console.log(`🗑️ PMREM Cache EVICT: ${oldestKey}`);
            }
            this.cache.delete(oldestKey);
        }

        return envMap;
    }

    dispose() {
        this.cache.forEach(map => map.dispose());
        this.cache.clear();
        this.lruKeys = [];
        this.pmremGenerator.dispose();
    }
}

