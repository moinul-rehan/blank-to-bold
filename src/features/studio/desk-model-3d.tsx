"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

/**
 * Diffuse-only textures — the source Maya/V-Ray export's normal/glossiness/
 * reflection/height/ior maps don't map cleanly onto Three.js's standard PBR
 * model, and the raw diffuse maps alone were 84MB (2048² lossless PNGs).
 * Downscaled to 1024px WebP via ffmpeg (no image-editing tool was available,
 * ffmpeg was) — ~215KB total instead. Detail groups 2/4/5 are solid-color
 * parts (screws/metal) in the source, hence the tiny file sizes.
 */
const TEXTURE_URLS = [1, 2, 3, 4, 5, 6, 7].map(
  (n) => `/Studio/desk-model/detail${n}_diffuse.webp`,
);

/**
 * World-space size the model's largest raw dimension gets normalized to.
 * The last tuned baseline was 2.43 (reduced ~15%, upsized 10% back) — that's
 * also where the desk correctly touched the floor and the camera framing
 * was correct. A prior in-progress edit bumped this to 10.43 (and a
 * follow-up miscalculation of mine compounded it further to ~12.6, ~5.2x
 * the baseline) without scaling anything else that depends on it — at that
 * scale the desk overshot toward the camera and the monitor landed off the
 * desktop. Fixed by going back to the original baseline and applying
 * exactly the requested +10% on top of it, with every dependent constant
 * below (monitor position/size, camera) derived from the same
 * `SCALE_RATIO` so they move together instead of drifting independently.
 */
const BASELINE_TARGET_SIZE = 2.43;
const TARGET_SIZE = BASELINE_TARGET_SIZE * 1.1;
const SCALE_RATIO = TARGET_SIZE / BASELINE_TARGET_SIZE;

/** Kept proportional to `TARGET_SIZE` so desk/monitor scale stays realistic relative to each other. */
const MONITOR_TARGET_SIZE = 0.89 * SCALE_RATIO;
/**
 * Estimated desk-surface height in this shared scene's units, scaled with
 * the desk. The desk's own bounding box includes the chair (its tallest
 * point is the headrest, not the desktop), so "top of the desk model" isn't
 * the right value here — this is a starting guess at roughly where the
 * surface actually sits, expected to need tuning once visible.
 */
const DESK_SURFACE_Y = 0.94 * SCALE_RATIO;
/**
 * X/Z offset for where the monitor sits on the desktop. Nudged from -0.55
 * toward center once already (a live screenshot showed it sitting too far
 * left). A follow-up screenshot still showed it left-of-center, with open
 * desk surface visible to its right — nudged again, by a smaller step this
 * time to avoid overshooting the way `TARGET_SIZE` did earlier in this
 * file. Not visually re-confirmed (no browser/screenshot tool available
 * this round) — check against a fresh screenshot before nudging further.
 * Scaled with the desk.
 */
const MONITOR_X = 0.05 * SCALE_RATIO;
const MONITOR_Z = 0.25 * SCALE_RATIO;
/** Camera framing — scaled with the desk so a bigger desk doesn't change the viewing angle (that mismatch was the actual cause of the "tilted surface" look). */
const CAMERA_X = 4 * SCALE_RATIO;
const CAMERA_Y = 1.3 * SCALE_RATIO;
const CAMERA_LOOKAT_Y = 0.7 * SCALE_RATIO;

function DeskMesh() {
  const obj = useLoader(OBJLoader, "/Studio/desk-model/computer_desk.obj");
  const textures = useLoader(THREE.TextureLoader, TEXTURE_URLS);

  const { model, scale, offset } = useMemo(() => {
    const clone = obj.clone(true);
    let meshIndex = 0;
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      // Group names came through OBJLoader inconsistently (multi-token `g`
      // lines in the source file); matching by digit in the name is more
      // robust than trusting exact group naming, with array position as a
      // last-resort fallback in file order (1,2,3,4,5,6,7).
      const match = /detal(\d)/i.exec(child.name);
      const texture = match
        ? textures[Number(match[1]) - 1]
        : textures[meshIndex % textures.length];
      meshIndex += 1;
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.55,
        metalness: 0.1,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Auto-fit: this Maya export's raw units aren't 1-unit-per-meter (its
    // largest dimension is ~16 units), so a hardcoded scale/position guess
    // put the camera effectively *inside* the model — this computes the
    // real bounding box instead, so it self-corrects for whatever units the
    // source file actually used.
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
      // Centers X/Z, and drops the model so its bottom (not its center) sits at y=0 — the floor.
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [obj, textures]);

  return (
    <group scale={scale}>
      <primitive object={model} position={offset} />
    </group>
  );
}

/**
 * The monitor — an STL, so geometry only, no materials/UVs (STL has no
 * concept of either). Given a plain dark screen/plastic material instead of
 * trying to fake texturing that doesn't exist in the source file.
 */
function MonitorMesh() {
  const geometry = useLoader(STLLoader, "/Studio/Monitor.stl");

  const { positioned, scale } = useMemo(() => {
    const geo = geometry.clone();
    geo.computeBoundingBox();
    const box =
      geo.boundingBox ??
      new THREE.Box3().setFromBufferAttribute(
        geo.attributes.position as THREE.BufferAttribute,
      );
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Center X/Z. The group below flips this 180° around X (see why in its
    // comment), which swaps top/bottom — so what should sit at the group's
    // y=0 is the geometry's *original* top (`box.max.y`), not its bottom;
    // using `min.y` here would leave the flipped model floating/sunk.
    geo.translate(-center.x, -box.max.y, -center.z);
    return { positioned: geo, scale: MONITOR_TARGET_SIZE / maxDim };
  }, [geometry]);

  return (
    // The source STL sits upside-down in its own coordinates (its "up" is
    // -Y, not +Y) — flipped 180° around X (swaps up/down; a monitor's
    // roughly bilaterally symmetric so the left/right mirror this also
    // causes isn't visible). A 90° X yaw was tried at one point and made the
    // screen lie flat on the desktop instead of standing upright — reverted.
    // X/Z offset from center because the desk model's own bounding-box
    // center is skewed by an asymmetric extra part (a low side tray).
    <group
      position={[MONITOR_X, 1.7, 0.5]}
      scale={scale}
      rotation={[Math.PI / 2, Math.PI, 0]}
    >
      <mesh geometry={positioned} castShadow receiveShadow>
        <meshStandardMaterial
          color="#111318"
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Headset stand (with headphones) — another geometry-only STL, same deal as
 * the monitor. Placed beside the monitor at the same desk-surface height
 * (Y=1.7, matching the monitor's now-confirmed value) and the same depth
 * (Z=0.5), offset in X to sit clear of it. No rotation applied — unlike the
 * monitor's STL, which needed a specific flip for its own export's axis
 * quirks, a stand is typically exported already resting upright on its own
 * base, so identity rotation is the more defensible starting guess. Both
 * the X offset and the target size are estimates; not visually confirmed
 * (no browser/screenshot tool available this session) — expect to need
 * tuning once seen, the same way the monitor did.
 */
const HEADSET_TARGET_SIZE = 0.55;
const HEADSET_X = 0.9;
const HEADSET_Y = 1.7;
const HEADSET_Z = 0.5;

function HeadsetStandMesh() {
  const geometry = useLoader(STLLoader, "/Studio/headset-stand.stl");

  const { positioned, scale } = useMemo(() => {
    const geo = geometry.clone();
    geo.computeBoundingBox();
    const box =
      geo.boundingBox ??
      new THREE.Box3().setFromBufferAttribute(
        geo.attributes.position as THREE.BufferAttribute,
      );
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Center X/Z, rest its own base (min.y) at the group's y=0 — no flip,
    // unlike the monitor.
    geo.translate(-center.x, -box.min.y, -center.z);
    return { positioned: geo, scale: HEADSET_TARGET_SIZE / maxDim };
  }, [geometry]);

  return (
    <group position={[HEADSET_X, HEADSET_Y, HEADSET_Z]} scale={scale}>
      <mesh geometry={positioned} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Points the camera at the model's vertical middle once, on mount — no
 * pointer-driven movement. The desk should read as a fixed object in the
 * room, not something that shifts when the cursor moves (unlike the room's
 * other objects, which do react to hover — this one was tried and
 * explicitly asked to stay still).
 */
function CameraAim() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.lookAt(0, CAMERA_LOOKAT_Y, 0);
  }, [camera]);
  return null;
}

/**
 * The desk as a real 3D model (Three.js/React Three Fiber) — a deliberate,
 * discussed exception to the rest of the room's flat-image approach, since
 * this specific asset only exists as a 3D model, not a render.
 */
export function DeskModel3D() {
  return (
    <Canvas
      // fov is Three.js's *vertical* field of view — fixed regardless of the
      // container's pixel size, so a taller container alone doesn't
      // necessarily reveal more vertically (R3F re-fits the aspect ratio to
      // the new box, but the same 30° vertical cone). Widened alongside the
      // taller box in room-stage.tsx as a hedge against genuine top-of-frame
      // clipping, not just a too-short container. Not visually confirmed.
      camera={{ position: [CAMERA_X, CAMERA_Y, 0], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.3} />
      <CameraAim />
      <Suspense fallback={null}>
        <DeskMesh />
        <MonitorMesh />
        <HeadsetStandMesh />
      </Suspense>
    </Canvas>
  );
}
