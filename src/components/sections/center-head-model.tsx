"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export default function CenterHeadModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let animationFrameId: number;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 600 / 800, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(600, 800);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load horse GLB model from public folder
    const loader = new GLTFLoader();
    let horseModel: THREE.Group | null = null;
    let headBone: THREE.Object3D | null = null;
    // Arm bones (kept neutral during kick unless desired later)
    let leftArmBone: THREE.Object3D | null = null;
    let rightArmBone: THREE.Object3D | null = null;
    const initialLeftArmRot = new THREE.Euler();
    const initialRightArmRot = new THREE.Euler();
    // Leg bones for kick
    let rightUpperLegBone: THREE.Object3D | null = null; // thigh
    let rightLowerLegBone: THREE.Object3D | null = null; // shin
    let rightFootBone: THREE.Object3D | null = null;
    const initialRightUpperLegRot = new THREE.Euler();
    const initialRightLowerLegRot = new THREE.Euler();
    const initialRightFootRot = new THREE.Euler();
    // Optional torso bone for subtle lean during side-kick
    let spineBone: THREE.Object3D | null = null;
    const initialSpineRot = new THREE.Euler();
    let initialModelRotationX = 0;
    let initialModelRotationY = 0;
    let baseModelY = 0; // base Y position to add jump offset
    const maxYaw = 0.4;   // left-right (Y axis)
    const maxPitch = 0.25; // up-down (X axis)
    let targetX = 0; // normalized cursor X in [-1, 1]
    let targetY = 0; // normalized cursor Y in [-1, 1]
    let currentYaw = 0;
    let currentPitch = 0;
    // Kick state
    let isKicking = false;
    let kickTimer = 0;
    const raiseDuration = 0.35; // seconds to lift leg
    const holdDuration = 0.15;   // brief hold at full extension
    const retractDuration = 0.4; // seconds to retract
    let hasDispatchedReady = false;
    loader.load(
      "/my3d.glb",
      (gltf) => {
        horseModel = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(horseModel);
        const center = box.getCenter(new THREE.Vector3());
        horseModel.position.sub(center);

        // Scale to fit the canvas nicely
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim; // slightly larger for center focus
        horseModel.scale.setScalar(scale);

        // Try to find a head bone/object in the rig
        const possibleHeadNames = [
          "Head",
          "head",
          "HeadBone",
          "mixamorigHead",
          "mixamorig:Head",
          "Bone_Head",
          "Head_jnt",
        ];
        const possibleLeftArmNames = [
          "LeftArm",
          "LeftUpperArm",
          "LeftShoulder",
          "LeftForeArm",
          "mixamorigLeftArm",
          "mixamorigLeftForeArm",
          "mixamorigLeftShoulder",
          "l_arm",
          "l_shoulder",
        ];
        const possibleRightArmNames = [
          "RightArm",
          "RightUpperArm",
          "RightShoulder",
          "RightForeArm",
          "mixamorigRightArm",
          "mixamorigRightForeArm",
          "mixamorigRightShoulder",
          "r_arm",
          "r_shoulder",
        ];
        const possibleRightUpperLegNames = [
          "RightUpLeg",
          "RightUpperLeg",
          "mixamorigRightUpLeg",
          "r_thigh",
          "r_upperleg",
        ];
        const possibleRightLowerLegNames = [
          "RightLeg",
          "RightLowerLeg",
          "mixamorigRightLeg",
          "r_shin",
          "r_lowerleg",
        ];
        const possibleRightFootNames = [
          "RightFoot",
          "mixamorigRightFoot",
          "r_foot",
        ];
        const possibleSpineNames = [
          "Spine",
          "Spine1",
          "Spine2",
          "mixamorigSpine",
          "mixamorigSpine1",
          "mixamorigSpine2",
          "Chest",
          "Torso",
        ];

        horseModel.traverse((obj) => {
          const name = (obj.name || "").toLowerCase();
          if (!headBone && (obj as any).isBone) {
            if (possibleHeadNames.some((n) => name.includes(n.toLowerCase()))) {
              headBone = obj;
            }
          }
          if (!leftArmBone && (obj as any).isBone) {
            if (possibleLeftArmNames.some((n) => name.includes(n.toLowerCase()))) {
              leftArmBone = obj;
              initialLeftArmRot.copy((leftArmBone as any).rotation);
            }
          }
          if (!rightArmBone && (obj as any).isBone) {
            if (possibleRightArmNames.some((n) => name.includes(n.toLowerCase()))) {
              rightArmBone = obj;
              initialRightArmRot.copy((rightArmBone as any).rotation);
            }
          }
          if (!rightUpperLegBone && (obj as any).isBone) {
            if (possibleRightUpperLegNames.some((n) => name.includes(n.toLowerCase()))) {
              rightUpperLegBone = obj;
              initialRightUpperLegRot.copy((rightUpperLegBone as any).rotation);
            }
          }
          if (!rightLowerLegBone && (obj as any).isBone) {
            if (possibleRightLowerLegNames.some((n) => name.includes(n.toLowerCase()))) {
              rightLowerLegBone = obj;
              initialRightLowerLegRot.copy((rightLowerLegBone as any).rotation);
            }
          }
          if (!rightFootBone && (obj as any).isBone) {
            if (possibleRightFootNames.some((n) => name.includes(n.toLowerCase()))) {
              rightFootBone = obj;
              initialRightFootRot.copy((rightFootBone as any).rotation);
            }
          }
          if (!spineBone && (obj as any).isBone) {
            if (possibleSpineNames.some((n) => name.includes(n.toLowerCase()))) {
              spineBone = obj;
              initialSpineRot.copy((spineBone as any).rotation);
            }
          }
        });

        // Store initial rotations for fallback rotation
        initialModelRotationX = horseModel.rotation.x;
        initialModelRotationY = horseModel.rotation.y;
        baseModelY = horseModel.position.y;

        scene.add(horseModel);

        // Signal that the avatar is ready (model loaded and added to scene)
        if (!hasDispatchedReady) {
          hasDispatchedReady = true;
          try {
            window.dispatchEvent(new CustomEvent("avatar:ready"));
          } catch {}
        }
      },
      undefined,
      (error) => {
        console.error("Error loading my3d.glb:", error);
      }
    );

    // Animation
    // Cursor tracking
    const onMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx;
      targetY = ny;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Listen for kick trigger
    const onKickTrigger = () => {
      isKicking = true;
      kickTimer = 0;
    };
    window.addEventListener("avatar:kick", onKickTrigger as EventListener);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Smoothly interpolate toward desired yaw/pitch
      const desiredYaw = THREE.MathUtils.clamp(targetX * maxYaw, -maxYaw, maxYaw);
      const desiredPitch = THREE.MathUtils.clamp(-targetY * maxPitch, -maxPitch, maxPitch);
      const smooth = 0.12; // smoothing factor
      currentYaw += (desiredYaw - currentYaw) * smooth;
      currentPitch += (desiredPitch - currentPitch) * smooth;

      // Apply to head bone if available, else rotate the whole model a bit
      if (headBone) {
        // Yaw around Y, Pitch around X
        headBone.rotation.y = currentYaw;
        headBone.rotation.x = currentPitch;
      } else if (horseModel) {
        horseModel.rotation.y = initialModelRotationY + currentYaw;
        horseModel.rotation.x = initialModelRotationX + currentPitch;
      }

      // Kick animation (right leg forward)
      if (isKicking) {
        kickTimer += dt;
        const totalDuration = raiseDuration + holdDuration + retractDuration;
        const t = Math.min(kickTimer, totalDuration);
        let amount = 0; // 0..1
        if (t <= raiseDuration) {
          const u = t / raiseDuration;
          // easeOutCubic
          amount = 1 - Math.pow(1 - u, 3);
        } else if (t <= raiseDuration + holdDuration) {
          amount = 1;
        } else {
          const v = (t - raiseDuration - holdDuration) / retractDuration;
          // easeInCubic
          amount = Math.max(0, 1 - Math.pow(v, 3));
        }

        // Apply rotations for a side-kick
        const thighAbduct = THREE.MathUtils.lerp(0, 1.0, amount); // lift leg to the side ~57° (Z axis)
        const hipYaw = THREE.MathUtils.lerp(0, 0.35, amount);      // rotate hip to point outward (Y axis)
        const kneeExtend = THREE.MathUtils.lerp(0, 0.8, Math.max(0, amount - 0.25) / 0.75); // extend after partial lift
        const footPoint = THREE.MathUtils.lerp(0, 0.2, amount);    // slight toe point
        const torsoLean = THREE.MathUtils.lerp(0, -0.18, amount);  // counter-lean torso slightly

        if (rightUpperLegBone) {
          (rightUpperLegBone as any).rotation.z = initialRightUpperLegRot.z + thighAbduct;
          (rightUpperLegBone as any).rotation.y = initialRightUpperLegRot.y + hipYaw;
        }
        if (rightLowerLegBone) {
          (rightLowerLegBone as any).rotation.x = initialRightLowerLegRot.x + kneeExtend;
        }
        if (rightFootBone) {
          (rightFootBone as any).rotation.x = initialRightFootRot.x + footPoint;
        }
        if (spineBone) {
          (spineBone as any).rotation.z = initialSpineRot.z + torsoLean;
        }

        if (t >= totalDuration) {
          isKicking = false;
          // restore to initial to ensure perfect reset
          if (rightUpperLegBone) (rightUpperLegBone as any).rotation.copy(initialRightUpperLegRot);
          if (rightLowerLegBone) (rightLowerLegBone as any).rotation.copy(initialRightLowerLegRot);
          if (rightFootBone) (rightFootBone as any).rotation.copy(initialRightFootRot);
          if (spineBone) (spineBone as any).rotation.copy(initialSpineRot);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("avatar:kick", onKickTrigger as EventListener);

      // Dispose of loaded model resources
      if (horseModel) {
        horseModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
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
    <div className="fixed left-1/2 top-[calc(50%+200px)] -translate-x-1/2 -translate-y-1/2 z-10">
      <canvas ref={canvasRef} width={600} height={800} />
      
      {/* Overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        {/* Unique Identifier */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] mb-1">
            UNIQUE IDENTIFIER
          </p>
          <p className="text-white/60 font-mono text-sm tracking-widest">
            7739690061PT
          </p>
        </div>
        
        {/* Scanning lines effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute w-full h-px bg-cyan-400 animate-scan" />
        </div>
      </div>
    </div>
  );
}
