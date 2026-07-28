"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

/**
 * World-space normalize size + camera framing — same auto-fit pattern as
 * desk-model-3d.tsx (bounding-box normalize, camera distance proportional
 * to size), independent constants since this is a different model with
 * different proportions. glTF ships PBR-ready materials already, unlike
 * the desk's raw OBJ, so no manual material reconstruction is needed here.
 * First-pass values — not visually confirmed (no browser/screenshot tool
 * available this session); expect to need tuning once seen.
 */
const TARGET_SIZE = 2.6;
const CAMERA_X = 4.3;
const CAMERA_Y = 1.3;
const CAMERA_LOOKAT_Y = 0.7;

function BookcaseMesh() {
  const gltf = useLoader(GLTFLoader, "/Studio/bookcase.glb");

  const { model, scale, offset } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return {
      model: clone,
      scale: TARGET_SIZE / maxDim,
      // Centers X/Z, drops the model so its floor sits at y=0.
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [gltf]);

  return (
    <group scale={scale}>
      <primitive object={model} position={offset} />
    </group>
  );
}

/** Points the camera at the model's vertical middle once, on mount — same fixed-framing choice as the desk. */
function CameraAim() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.lookAt(0, CAMERA_LOOKAT_Y, 0);
  }, [camera]);
  return null;
}

/**
 * The bookshelf — a real 3D model (glTF), composited into the room the
 * same way the desk is (see desk-model-3d.tsx and room-stage.tsx). Sits in
 * the left corner, between the window and the desk.
 */
export function BookshelfModel3D() {
  return (
    <Canvas
      camera={{ position: [CAMERA_X, CAMERA_Y, 0], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.3} />
      <CameraAim />
      <Suspense fallback={null}>
        <BookcaseMesh />
      </Suspense>
    </Canvas>
  );
}
