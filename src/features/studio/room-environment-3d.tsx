"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

/**
 * World-space size the room's largest raw dimension gets normalized to.
 * Chosen so the desk (normalized separately to `TARGET_SIZE` in
 * desk-model-3d.tsx, 10.43) reads at a believable scale sitting inside it —
 * a room needs to be several desk-widths across, not equal to one.
 */
const TARGET_SIZE = 40;

/**
 * `realistic+interior.glb` — a real glTF/GLB export (26MB), unlike the
 * earlier raw FBX download it replaces. glTF materials are already PBR
 * (`MeshStandardMaterial`-compatible) and shadow-ready out of the box, so
 * unlike the desk model's OBJ path, no material reconstruction or texture
 * pipeline is needed here — just shadow flags plus `DoubleSide` (see below).
 */
function RoomMesh({ lit, onSize }: { lit: boolean; onSize: (size: THREE.Vector3) => void }) {
  const gltf = useLoader(GLTFLoader, "/Studio/realistic+interior.glb");

  const { model, scale, offset, worldSize } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      // Interior-room exports typically model walls as single-sided shells
      // whose visible face points inward (toward wherever the camera sits
      // once it's actually inside) — the first camera placement sat outside
      // the shell entirely and only ever saw backfaces/the shell's exterior.
      // DoubleSide keeps walls visible from both sides so an inside camera
      // doesn't depend on getting the source mesh's winding order right.
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        mat.side = THREE.DoubleSide;
        // This scene's ~130 texture references 404 (see room-environment-3d
        // notes) — including metallic/roughness maps. glTF's spec default
        // for an unspecified metallicFactor/roughnessFactor is 1.0/1.0 (full
        // metal), which without an environment map to reflect renders
        // near-black under plain directional/ambient light — this was the
        // actual cause of the second screenshot's all-black room, not a
        // camera-placement bug. Forced to a plain matte fallback since we
        // don't have real material maps to render correctly anyway.
        if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
          mat.metalness = 0;
          mat.roughness = 0.85;
        }
      });
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scaleFactor = TARGET_SIZE / maxDim;

    return {
      model: clone,
      scale: scaleFactor,
      // Centers X/Z, drops the model so its floor sits at y=0.
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
      worldSize: size.clone().multiplyScalar(scaleFactor),
    };
  }, [gltf]);

  useEffect(() => {
    onSize(worldSize);
  }, [worldSize, onSize]);

  return (
    <group scale={scale}>
      <primitive object={model} position={offset} />
      {/* Day/night mood — mirrors the lamp toggle that used to just crossfade two flat images. Hemisphere light is the fill: with metalness forced to 0 above, matte surfaces still need a soft ambient-ish base or they read flat/underlit indoors. */}
      <hemisphereLight args={["#ffffff", "#3a2f28", lit ? 0.9 : 0.35]} />
      <ambientLight intensity={lit ? 0.6 : 0.18} />
      <directionalLight position={[10, 20, 10]} intensity={lit ? 1.2 : 0.25} castShadow />
      <pointLight position={[0, worldSize.y * 0.4, 0]} intensity={lit ? 0 : 0.9} color="#ffb87a" distance={18} decay={2} />
    </group>
  );
}

/**
 * Moves the camera inside the room once its real (post-normalize) footprint
 * is known — a fixed eye-height fraction back from center, looking at the
 * room's vertical middle. Can't be hardcoded up front the way the desk
 * model's camera is: the room's real proportions (how tall vs. how deep)
 * aren't known until the GLB has actually loaded and its bounding box is
 * measured, unlike the desk which is a single roughly-cube-ish object.
 */
function CameraInside({ size }: { size: THREE.Vector3 | null }) {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (!size) return;
    const eyeHeight = size.y * 0.45;
    camera.position.set(0, eyeHeight, size.z * 0.32);
    camera.lookAt(0, eyeHeight, -size.z * 0.3);
  }, [camera, size]);
  return null;
}

/**
 * The room environment as a real 3D model — replaces the flat photographed
 * day/night background image pair. Sits behind the (also-3D) desk model in
 * the same stage; both now share one real 3D room instead of the desk being
 * composited onto a flat backdrop. The camera sits inside the room (see
 * `CameraInside`), not outside looking at it.
 */
export function RoomEnvironment3D({ lit }: { lit: boolean }) {
  const [size, setSize] = useState<THREE.Vector3 | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 5, 0.1], fov: 60, near: 0.05 }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <RoomMesh lit={lit} onSize={setSize} />
      </Suspense>
      <CameraInside size={size} />
    </Canvas>
  );
}
