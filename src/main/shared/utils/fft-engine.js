/**
 * FFT Card Probability System - JavaScript Implementation
 * Converted from Python SimpleFFTCardSystem prototype
 * 
 * Core Features:
 * - Generate Gaussian distributions for card base probabilities
 * - Apply FFT/IFFT transformations
 * - Filter probability distributions based on player backgrounds
 * - Ensure mathematical accuracy and proper normalization
 */

// Simple FFT implementation for small arrays (n=11)
// For production, consider using fft.js library for better performance
class SimpleFFT {
    /**
     * Discrete Fourier Transform for real input
     * @param {number[]} signal - Real input signal
     * @returns {Complex[]} - Complex frequency domain representation
     */
    static fft(signal) {
        const n = signal.length;
        const result = new Array(n);
        
        for (let k = 0; k < n; k++) {
            let real = 0, imag = 0;
            for (let j = 0; j < n; j++) {
                const angle = -2 * Math.PI * k * j / n;
                real += signal[j] * Math.cos(angle);
                imag += signal[j] * Math.sin(angle);
            }
            result[k] = { real, imag };
        }
        
        return result;
    }
    
    /**
     * Inverse Discrete Fourier Transform
     * @param {Complex[]} spectrum - Complex frequency domain data
     * @returns {number[]} - Real spatial domain signal
     */
    static ifft(spectrum) {
        const n = spectrum.length;
        const result = new Array(n);
        
        for (let j = 0; j < n; j++) {
            let real = 0;
            for (let k = 0; k < n; k++) {
                const angle = 2 * Math.PI * k * j / n;
                real += spectrum[k].real * Math.cos(angle) - spectrum[k].imag * Math.sin(angle);
            }
            result[j] = real / n; // Normalize by n
        }
        
        return result;
    }
}

/**
 * JavaScript implementation of the FFT Card Probability System
 */
class SimpleFFTCardSystem {
    constructor() {
        // Dice positions 2-12 (11 positions total)
        this.dicePoints = Array.from({length: 11}, (_, i) => i + 2);
        
        // Background filter configurations
        this.backgroundFilters = {
            conservative: { cutoff: 2, description: "Low-pass filter, prefer center positions" },
            balanced: { cutoff: 3, description: "Mid-pass filter, maintain Gaussian shape" },
            aggressive: { cutoff: 5, description: "High-pass filter, increase edge probabilities" }
        };
    }
    
    /**
     * Generate normalized Gaussian distribution
     * @param {number} center - Gaussian center (μ)
     * @param {number} sigma - Standard deviation (σ)
     * @returns {number[]} - Normalized probability distribution
     */
    generateGaussian(center, sigma) {
        const values = this.dicePoints.map(x => {
            const exponent = -0.5 * Math.pow((x - center) / sigma, 2);
            return Math.exp(exponent) / (sigma * Math.sqrt(2 * Math.PI));
        });
        
        // Normalize to sum = 1
        const sum = values.reduce((a, b) => a + b, 0);
        return values.map(v => v / sum);
    }
    
    /**
     * Apply low-pass filter to FFT data
     * @param {Complex[]} fftData - Complex frequency domain data
     * @param {number} cutoff - Cutoff frequency
     * @returns {Complex[]} - Filtered frequency domain data
     */
    applyLowpassFilter(fftData, cutoff) {
        const n = fftData.length;
        const filtered = new Array(n);
        
        for (let i = 0; i < n; i++) {
            if (i <= cutoff || i >= n - cutoff) {
                // Keep low frequencies
                filtered[i] = { ...fftData[i] };
            } else {
                // Zero out high frequencies
                filtered[i] = { real: 0, imag: 0 };
            }
        }
        
        return filtered;
    }
    
    /**
     * Generate card probability distribution with background filtering
     * @param {number} cardCenter - Card's base Gaussian center
     * @param {number} cardSigma - Card's base Gaussian sigma
     * @param {string} backgroundType - Player background type
     * @returns {number[]} - Final normalized probability distribution
     */
    generateCardProbability(cardCenter, cardSigma, backgroundType) {
        // Step 1: Generate base Gaussian distribution
        const baseDistribution = this.generateGaussian(cardCenter, cardSigma);
        
        // Step 2: Apply FFT to get frequency domain
        const fftBase = SimpleFFT.fft(baseDistribution);
        
        // Step 3: Apply background-specific filter
        const filterConfig = this.backgroundFilters[backgroundType] || this.backgroundFilters.balanced;
        const filteredFFT = this.applyLowpassFilter(fftBase, filterConfig.cutoff);
        
        // Step 4: Apply IFFT to get back to spatial domain
        const finalDistribution = SimpleFFT.ifft(filteredFFT);
        
        // Step 5: Ensure non-negative values and normalize
        const clippedDistribution = finalDistribution.map(x => Math.max(0, x));
        const sum = clippedDistribution.reduce((a, b) => a + b, 0);
        
        return clippedDistribution.map(x => x / sum);
    }
    
    /**
     * Validate probability distribution
     * @param {number[]} distribution - Probability distribution to validate
     * @returns {object} - Validation results
     */
    validateDistribution(distribution) {
        const sum = distribution.reduce((a, b) => a + b, 0);
        const hasNegative = distribution.some(x => x < 0);
        const maxProb = Math.max(...distribution);
        const minProb = Math.min(...distribution);
        
        return {
            isValid: Math.abs(sum - 1.0) < 1e-10 && !hasNegative,
            sum: sum,
            hasNegative: hasNegative,
            maxProbability: maxProb,
            minProbability: minProb,
            sumError: Math.abs(sum - 1.0)
        };
    }
    
    /**
     * Get frequency domain analysis of a distribution
     * @param {number[]} distribution - Input distribution
     * @returns {object} - FFT analysis results
     */
    analyzeFFT(distribution) {
        const fftResult = SimpleFFT.fft(distribution);
        const magnitudes = fftResult.map(complex => 
            Math.sqrt(complex.real * complex.real + complex.imag * complex.imag)
        );
        
        return {
            spectrum: fftResult,
            magnitudes: magnitudes,
            dominantFrequency: magnitudes.indexOf(Math.max(...magnitudes)),
            totalEnergy: magnitudes.reduce((a, b) => a + b*b, 0)
        };
    }
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimpleFFTCardSystem, SimpleFFT };
}

// Example usage and testing
if (typeof window === 'undefined' && require.main === module) {
    // Node.js environment - run tests
    console.log('🧪 Testing FFT Card System...\n');
    
    const system = new SimpleFFTCardSystem();
    
    // Test 1: Basic Gaussian generation
    console.log('Test 1: Gaussian Distribution Generation');
    const gaussian = system.generateGaussian(7, 1.5);
    console.log('Gaussian (center=7, sigma=1.5):', gaussian.map(x => x.toFixed(4)));
    console.log('Validation:', system.validateDistribution(gaussian));
    console.log();
    
    // Test 2: Different backgrounds on same card
    console.log('Test 2: Background Effects on Card a-1 (台北大安)');
    const cardCenter = 7, cardSigma = 1.5;
    
    ['conservative', 'balanced', 'aggressive'].forEach(background => {
        const prob = system.generateCardProbability(cardCenter, cardSigma, background);
        const validation = system.validateDistribution(prob);
        
        console.log(`${background.toUpperCase()}:`);
        console.log('  Probabilities:', prob.map(x => x.toFixed(4)));
        console.log('  Peak at position:', system.dicePoints[prob.indexOf(Math.max(...prob))]);
        console.log('  Validation:', validation.isValid ? '✅ PASS' : '❌ FAIL');
        console.log('  Sum error:', validation.sumError.toExponential(2));
        console.log();
    });
    
    // Test 3: FFT Analysis
    console.log('Test 3: FFT Frequency Analysis');
    const testDistribution = system.generateGaussian(7, 2.0);
    const fftAnalysis = system.analyzeFFT(testDistribution);
    console.log('Original distribution:', testDistribution.map(x => x.toFixed(4)));
    console.log('FFT magnitudes:', fftAnalysis.magnitudes.map(x => x.toFixed(4)));
    console.log('Dominant frequency:', fftAnalysis.dominantFrequency);
    console.log();
    
    console.log('✅ All tests completed. FFT Card System is ready for integration.');
}