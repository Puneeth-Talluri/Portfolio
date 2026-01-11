"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

const ThreeCanvasBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let animationFrameId: number;
        let loadedModel: THREE.Group | null = null;

        // 1. Scene
        const scene = new THREE.Scene();

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1); // Black background

        // 4. Lighting for PBR materials
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-5, -5, -5);
        scene.add(directionalLight2);

        // 5. Load GLB Model
        const loader = new GLTFLoader();
        loader.load(
            "/my3d.glb",
            (gltf) => {
                loadedModel = gltf.scene;
                
                // Center the model
                const box = new THREE.Box3().setFromObject(loadedModel);
                const center = box.getCenter(new THREE.Vector3());
                loadedModel.position.sub(center);
                
                // Optional: Scale the model to fit the view
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                loadedModel.scale.setScalar(scale);
                
                scene.add(loadedModel);
            },
            (progress) => {
                // Optional: Loading progress
                console.log((progress.loaded / progress.total) * 100 + "% loaded");
            },
            (error) => {
                console.error("Error loading GLB model:", error);
            }
        );

        // 6. Animation Loop
        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            // Subtle rotation animation for loaded model
            if (loadedModel) {
                loadedModel.rotation.y = elapsedTime * 0.15;
                loadedModel.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
            }
            
            renderer.render(scene, camera);
        };
        animate();

        // 7. Responsive Resizing
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener("resize", handleResize);

        // 8. Cleanup on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            
            // Dispose of loaded model
            if (loadedModel) {
                loadedModel.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach((material) => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
            
            renderer.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="canvas-container"
            data-engine="three.js r136"
        />
    );
};

export default ThreeCanvasBackground;