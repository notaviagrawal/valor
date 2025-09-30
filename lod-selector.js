// Smart LOD Selection based on device capabilities
// Considers DPR, deviceMemory, GPU capabilities

export class LODSelector {
    constructor(renderer) {
        this.renderer = renderer;
        this.deviceTier = this.detectDeviceTier();
        console.log(`🎯 Device Tier: ${this.deviceTier.name}`);
        console.log(`   GPU: ${this.deviceTier.maxTextureSize}px`);
        console.log(`   Memory: ${this.deviceTier.memory}GB`);
        console.log(`   DPR: ${this.deviceTier.dpr}`);
    }

    detectDeviceTier() {
        const gl = this.renderer.getContext();
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const dpr = window.devicePixelRatio || 1;
        const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const effectiveType = connection ? connection.effectiveType : '4g';

        // Tier calculation
        let tier = 'medium';
        let quality = 'medium';
        let targetFPS = 60;
        let targetDPR = 1.5;

        // High-end: Large GPU, lots of RAM, high DPR
        if (maxTextureSize >= 16384 && memory >= 8 && dpr >= 2) {
            tier = 'ultra';
            quality = 'very-high'; // Better quality for high-end
            targetFPS = 60;
            targetDPR = 2;
        }
        // High: Good GPU, decent RAM
        else if (maxTextureSize >= 8192 && memory >= 4) {
            tier = 'high';
            quality = 'high-mid'; // Good balance
            targetFPS = 60;
            targetDPR = 1.5;
        }
        // Medium: Standard devices
        else if (maxTextureSize >= 4096 && memory >= 2) {
            tier = 'medium';
            quality = 'medium';
            targetFPS = 60;
            targetDPR = 1;
        }
        // Low: Older/mobile devices
        else {
            tier = 'low';
            quality = 'medium'; // Keep medium for decent quality
            targetFPS = 60; // Still try for 60fps
            targetDPR = 1;
        }

        // Network consideration
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
            quality = 'medium'; // Force medium quality on slow networks (low no longer exists)
        }

        return {
            name: tier,
            quality: quality,
            maxTextureSize: maxTextureSize,
            dpr: dpr,
            memory: memory,
            network: effectiveType,
            targetFPS: targetFPS,
            targetDPR: targetDPR
        };
    }

    getQualityLevel() {
        return this.deviceTier.quality;
    }

    getTextureUrl(basename) {
        const quality = this.deviceTier.quality;
        const ext = quality === 'high' ? 'jpg' : 'webp';
        return `textures/processed/${quality}/${basename}.${ext}`;
    }

    shouldUseKTX2() {
        // Use KTX2 for medium and above
        return this.deviceTier.quality !== 'low';
    }

    getMaxConcurrentLoads() {
        // Limit concurrent loads based on tier
        const limits = {
            'ultra': 6,
            'high': 4,
            'medium': 2,
            'low': 1
        };
        return limits[this.deviceTier.name] || 2;
    }
}

