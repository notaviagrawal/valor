'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';
import Script from 'next/script';

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false);
    const { isInstalled } = useMiniKit();

    console.log('LoginPage component rendered');

    // Three.js logo viewer initialization - EXACT COPY FROM WALLET TAB
    const initializeLogoViewer = useCallback(() => {
        // Check if Three.js is available
        if (typeof window === 'undefined' || !(window as any).THREE) {
            console.error('Three.js not loaded');
            return;
        }

        const THREE = (window as any).THREE;
        const container = document.getElementById('login-logo-container');
        const loadingElement = document.getElementById('login-loading');
        
        if (!container) {
            console.error('Logo container not found');
            return;
        }

        // Check if already initialized
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) {
            console.log('Logo already loaded, skipping initialization');
            return;
        }

        // Check if GLTFLoader is available
        if (!THREE.GLTFLoader) {
            console.error('GLTFLoader not available');
            if (loadingElement) {
                loadingElement.innerHTML = '3D loader not available - please refresh the page';
            }
            return;
        }

        // Check if OrbitControls is available
        if (!THREE.OrbitControls) {
            console.error('OrbitControls not available');
            if (loadingElement) {
                loadingElement.innerHTML = '3D controls not available - please refresh the page';
            }
            return;
        }

        console.log('All Three.js components loaded successfully');
        console.log('THREE object:', THREE);
        console.log('GLTFLoader:', THREE.GLTFLoader);
        console.log('OrbitControls:', THREE.OrbitControls);

        // Show loading indicator
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF4F4F8);

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
        camera.position.set(0.06, 0.08, 0.06);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        
        container.appendChild(renderer.domElement);

        // Add orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(2, 2, 1);
        directionalLight1.castShadow = true;
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight2.position.set(-1, 1, -1);
        scene.add(directionalLight2);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
        scene.add(hemisphereLight);

        // Load the logo
        let loader: any;
        try {
            console.log('Creating GLTFLoader...');
            loader = new THREE.GLTFLoader();
            console.log('GLTFLoader created successfully:', loader);
        } catch (error) {
            console.error('Failed to create GLTFLoader:', error);
            if (loadingElement) {
                loadingElement.innerHTML = 'Failed to initialize 3D loader';
            }
            return;
        }
        let logoPivot: any = null;

        // Set a timeout for loading
        const loadingTimeout = setTimeout(() => {
            console.error('Logo loading timeout');
            if (loadingElement) {
                loadingElement.innerHTML = 'Loading timeout - please check your connection';
            }
        }, 10000); // 10 second timeout

        // Try to load the GLTF file with additional error handling
        try {
            console.log('Starting GLTF load...');
            loader.load(
                '/valerlogo.gltf',
                function(gltf: any) {
                    clearTimeout(loadingTimeout);
                    console.log('GLTF loaded successfully:', gltf);
                    
                    const logo = gltf.scene;
                    
                    // Scale the logo
                    const box = new THREE.Box3().setFromObject(logo);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 0.1 / maxDim;
                    logo.scale.setScalar(scale);
                    
                    // Center the logo
                    const scaledBox = new THREE.Box3().setFromObject(logo);
                    const center = new THREE.Vector3();
                    scaledBox.getCenter(center);
                    logo.position.sub(center);
                    
                    // Create pivot group
                    logoPivot = new THREE.Group();
                    logoPivot.add(logo);
                    scene.add(logoPivot);
                    
                    // Apply rotation
                    logoPivot.rotation.x = -Math.PI / 2;
                    
                    // Set initial opacity for fade-in animation
                    logoPivot.traverse(function(child: any) {
                        if (child.isMesh && child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((mat: any) => {
                                    mat.transparent = true;
                                    mat.opacity = 0;
                                });
                            } else {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                            }
                        }
                    });
                    
                    // Apply material
                    logo.traverse(function(child: any) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach((mat: any) => {
                                        mat.color.setHex(0xe51515);
                                        mat.metalness = 0.0;
                                        mat.roughness = 0.3;
                                        mat.transparent = true;
                                        mat.opacity = 0; // Start with opacity 0 for fade-in
                                    });
                                } else {
                                    child.material.color.setHex(0xe51515);
                                    child.material.metalness = 0.0;
                                    child.material.roughness = 0.3;
                                    child.material.transparent = true;
                                    child.material.opacity = 0; // Start with opacity 0 for fade-in
                                }
                            }
                        }
                    });
                    
                    // Hide loading indicator
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    console.log('Logo loaded successfully');
                },
                function(progress: any) {
                    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                function(error: any) {
                    clearTimeout(loadingTimeout);
                    console.error('Error loading logo:', error);
                    console.error('Error details:', {
                        message: error?.message || 'Unknown error',
                        type: error?.type || 'Unknown type',
                        url: error?.url || '/valerlogo.gltf',
                        status: error?.status || 'Unknown status'
                    });
                    
                    // Create a fallback 3D object if loading fails
                    try {
                        console.log('Creating fallback cube...');
                        const fallbackGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                        const fallbackMaterial = new THREE.MeshLambertMaterial({ 
                            color: 0xe51515,
                            transparent: true,
                            opacity: 0 // Start with opacity 0 for fade-in
                        });
                        const fallbackCube = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                        
                        logoPivot = new THREE.Group();
                        logoPivot.add(fallbackCube);
                        scene.add(logoPivot);
                        
                        // Hide loading indicator
                        if (loadingElement) {
                            loadingElement.style.display = 'none';
                        }
                        
                        console.log('Fallback cube created successfully');
                    } catch (fallbackError) {
                        console.error('Failed to create fallback:', fallbackError);
                        if (loadingElement) {
                            loadingElement.innerHTML = `Error loading logo: ${error?.message || 'Failed to load'}`;
                        }
                    }
                }
            );
        } catch (loadError) {
            clearTimeout(loadingTimeout);
            console.error('Failed to start GLTF loading:', loadError);
            if (loadingElement) {
                loadingElement.innerHTML = 'Failed to start loading 3D model';
            }
        }

        // Animation loop
        let animationId: number;
        let fadeInStartTime: number | null = null;
        const fadeInDuration = 500; // 0.5 second fade-in
        
        function animate() {
            animationId = requestAnimationFrame(animate);

            if (logoPivot) {
                logoPivot.rotation.z += 0.01;
                
                // Handle fade-in animation
                if (fadeInStartTime === null) {
                    fadeInStartTime = Date.now();
                }
                
                const elapsed = Date.now() - fadeInStartTime;
                const progress = Math.min(elapsed / fadeInDuration, 1);
                const opacity = progress; // Linear fade-in
                
                // Apply opacity to all materials
                logoPivot.traverse(function(child: any) {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat: any) => {
                                mat.opacity = opacity;
                            });
                        } else {
                            child.material.opacity = opacity;
                        }
                    }
                });
            }

            controls.update();
            renderer.render(scene, camera);
        }

        // Handle window resize
        function onWindowResize() {
            if (container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }

        window.addEventListener('resize', onWindowResize);
        animate();

        // Cleanup function
        return () => {
            // Stop the animation loop
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of Three.js resources
            if (renderer) {
                renderer.dispose();
            }
        };
    }, []);

    // Initialize Three.js logo viewer when component mounts - EXACT COPY FROM WALLET TAB
    useEffect(() => {
        let cleanup: (() => void) | undefined;

        const container = document.getElementById('login-logo-container');
        
        if (container) {
            const hasCanvas = container.querySelector('canvas');
            
            if (!hasCanvas) {
                // Wait for Three.js to load
                const checkThreeJS = () => {
                    if ((window as any).THREE && (window as any).THREE.GLTFLoader && (window as any).THREE.OrbitControls) {
                        cleanup = initializeLogoViewer();
                    } else {
                        setTimeout(checkThreeJS, 100);
                    }
                };
                checkThreeJS();
            }
        }

        // Cleanup function - only clean up on component unmount
        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [initializeLogoViewer]);

    const handleLogin = useCallback(async () => {
        if (!isInstalled || isPending) {
            return;
        }
        setIsPending(true);
        try {
            const result = await walletAuth();
            console.log('Authentication result:', result);
            
            // After successful authentication, refresh the page to show the main UI
            // The session will be updated and the app will render the main UI
            window.location.reload();
        } catch (error) {
            console.error('Login authentication error', error);
            setIsPending(false);
            return;
        }
        // Note: walletAuth no longer handles redirect automatically
    }, [isInstalled, isPending]);

    return (
        <>
            {/* Three.js Script Loading - EXACT COPY FROM WALLET TAB */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
                onLoad={() => {
                    console.log('Three.js loaded');
                    
                    // Wait a bit for Three.js to fully initialize
                    setTimeout(() => {
                        // Load GLTFLoader after THREE.js is loaded
                        const gltfScript = document.createElement('script');
                        gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
                        gltfScript.onload = () => {
                            console.log('GLTFLoader loaded');
                            // Load OrbitControls after GLTFLoader is loaded
                            const controlsScript = document.createElement('script');
                            controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                            controlsScript.onload = () => {
                                console.log('OrbitControls loaded');
                                console.log('All Three.js components ready');
                            };
                            controlsScript.onerror = (error) => {
                                console.error('Failed to load OrbitControls:', error);
                            };
                            document.head.appendChild(controlsScript);
                        };
                        gltfScript.onerror = (error) => {
                            console.error('Failed to load GLTFLoader:', error);
                        };
                        document.head.appendChild(gltfScript);
                    }, 100);
                }}
                onError={() => {
                    console.error('Failed to load Three.js');
                }}
            />

            <div className="min-h-screen bg-[#F4F4F8] font-inter flex flex-col items-center justify-center px-6">
                {/* Simple Test Content */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1C1C1E] mb-4">Welcome to Valor</h1>
                    <p className="text-gray-600">Login with your World App wallet</p>
                </div>

                {/* Logo Viewer - EXACT COPY FROM WALLET TAB */}
                <div className="h-80 w-full max-w-md mb-8 relative">
                    <div id="login-logo-container" className="w-full h-full" key="login-logo-container">
                        <div id="login-loading" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#333] text-xl z-1000 font-inter">
                            <div className="border-3 border-solid border-gray-200 border-t-[#333] rounded-full w-10 h-10 animate-spin mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Login Button */}
                <div className="w-full max-w-md">
                    <LiveFeedback
                        label={{
                            failed: 'Failed to login',
                            pending: 'Logging in',
                            success: 'Logged in',
                        }}
                        state={isPending ? 'pending' : undefined}
                    >
                        <Button
                            onClick={handleLogin}
                            disabled={!isInstalled || isPending}
                            size="lg"
                            variant="primary"
                            className="w-full"
                        >
                            {!isInstalled ? 'World App Required' : 'Login with Wallet'}
                        </Button>
                    </LiveFeedback>
                </div>

                {/* Instructions */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm font-inter">
                        {'Tap to authenticate with your World App wallet'}
                    </p>
                </div>

                {/* Debug Info removed */}
            </div>
        </>
    );
}