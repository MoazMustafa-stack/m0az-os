import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { MachinePhase } from "./MachineScene";
import type { ThemeId } from "@/types/domain";

export interface PCView {
  update: (phase: MachinePhase, theme: ThemeId) => void;
  dispose: () => void;
}

/** Locally authored geometry and textures: no external model or asset requests. */
export function createPC(host: HTMLElement, onPower: () => void, onLost: () => void): PCView {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  const pc = new THREE.Group();
  scene.add(pc);
  const textures: THREE.Texture[] = [];
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  let frame = 0;
  let disposed = false;
  let phase: MachinePhase = "idle";
  let phaseStart = performance.now();
  let tint = "#75ff70";
  let targetX = 0;
  let targetY = 0;
  let environment: THREE.WebGLRenderTarget | undefined;
  const invalidate = () => {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(render);
  };
  const material = (color: string, roughness = .65) => {
    const mat = new THREE.MeshStandardMaterial({ color, roughness });
    materials.add(mat);
    return mat;
  };
  const plastic = material("#c8bea6");
  const trim = material("#e1d8c2", .45);
  const dark = material("#252623");
  const brown = material("#594a38");
  const keys = material("#ddd5be", .55);
  const accent = material("#748779", .5);
  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = pc) => {
    geometries.add(geo);
    materials.add(mat);
    const object = new THREE.Mesh(geo, mat);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, mat = plastic, radius = .05) =>
    mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 3, h / 3, d / 3)), mat, x, y, z);
  const canvasTexture = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas texture unavailable");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return { ctx, texture };
  };
  const resize = () => {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const observer = new ResizeObserver(resize);
  const pointer = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const fine = window.matchMedia("(pointer: fine)");
  const move = (event: PointerEvent) => {
    const bounds = host.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    if (phase === "idle" && fine.matches) { targetX = pointer.x; targetY = pointer.y; invalidate(); }
  };
  const leave = () => { targetX = 0; targetY = 0; invalidate(); };
  let power: THREE.Mesh;
  const click = (event: MouseEvent) => {
    if (phase !== "idle") return;
    const bounds = host.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    if (ray.intersectObject(power).length) onPower();
  };
  const lost = (event: Event) => { event.preventDefault(); onLost(); };
  const visibility = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (phase !== "entering") invalidate();
  };
  let drawScreen: (elapsed: number) => void;
  let busy: THREE.Mesh;
  const render = (now: number) => {
    frame = 0;
    if (disposed) return;
    const elapsed = now - phaseStart;
    const progress = phase === "idle" ? 0 : THREE.MathUtils.smoothstep(elapsed, 0, 2350);
    pc.rotation.y += ((phase === "idle" ? targetX * .12 : 0) - pc.rotation.y) * .08;
    pc.rotation.x += ((phase === "idle" ? -targetY * .025 : 0) - pc.rotation.x) * .08;
    camera.position.set(4.8 * (1 - progress), 3.5 - progress * 1.35, 9.3 - progress * 6.9);
    camera.lookAt(0, 1.5 + progress * .55, 0);
    drawScreen(elapsed);
    busy.visible = phase === "building";
    renderer.render(scene, camera);
    const moving = Math.abs((phase === "idle" ? targetX * .12 : 0) - pc.rotation.y) > .0002 || Math.abs((phase === "idle" ? -targetY * .025 : 0) - pc.rotation.x) > .0002;
    if (phase === "building" || (phase === "idle" && moving)) invalidate();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerleave", leave);
    host.removeEventListener("click", click);
    document.removeEventListener("visibilitychange", visibility);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    geometries.forEach((geo) => geo.dispose());
    materials.forEach((mat) => mat.dispose());
    textures.forEach((texture) => texture.dispose());
    scene.traverse((object) => {
      if (object instanceof THREE.DirectionalLight) object.shadow.dispose();
    });
    environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .5;
    room.dispose();
    pmrem.dispose();
    const grain = canvasTexture(128, 128);
    const pixels = grain.ctx.createImageData(128, 128);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const value = 170 + Math.random() * 60;
      pixels.data.set([value, value, value, 255], i);
    }
    grain.ctx.putImageData(pixels, 0, 0);
    grain.texture.wrapS = grain.texture.wrapT = THREE.RepeatWrapping;
    grain.texture.repeat.set(6, 6);
    plastic.bumpMap = grain.texture;
    plastic.bumpScale = .009;
    box(3.65, 2.75, 2.25, 0, 1.95, -.22, plastic, .18);
    box(3.73, 2.8, .24, 0, 1.95, .94, trim, .13);
    box(3.18, 2.27, .09, 0, 2.13, 1.095, dark, .04);
    box(1.1, .38, 1.15, 0, .48, -.12);
    box(2.12, .17, 1.7, 0, .22, -.1, brown);
    const display = canvasTexture(1024, 768);
    const screenGeometry = new THREE.PlaneGeometry(2.93, 2.02, 32, 24);
    const positions = screenGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i) / 1.465, y = positions.getY(i) / 1.01;
      positions.setZ(i, .1 * (1 - x * x) * (1 - y * y));
    }
    screenGeometry.computeVertexNormals();
    const glass = new THREE.MeshPhysicalMaterial({ map: display.texture, emissiveMap: display.texture, emissive: "#ffffff", emissiveIntensity: .8, roughness: .3, metalness: 0, clearcoat: .55, clearcoatRoughness: .25 });
    mesh(screenGeometry, glass, 0, 2.13, 1.15);
    power = box(.34, .18, .1, 1.34, .8, 1.12, brown, .025);
    const ledMat = new THREE.MeshBasicMaterial({ color: tint });
    mesh(new THREE.SphereGeometry(.035, 12, 8), ledMat, 1.02, .8, 1.14);
    busy = mesh(new THREE.SphereGeometry(.027, 12, 8), new THREE.MeshBasicMaterial({ color: "#ff453a" }), .85, .8, 1.14);
    const badge = canvasTexture(512, 64);
    badge.ctx.fillStyle = "#ded4bd";
    badge.ctx.fillRect(0, 0, 512, 64);
    badge.ctx.fillStyle = "#443f35";
    badge.ctx.font = "bold 28px monospace";
    badge.ctx.fillText("M0AZ-TRON 2000", 12, 42);
    mesh(new THREE.PlaneGeometry(1.05, .13), new THREE.MeshBasicMaterial({ map: badge.texture }), -.9, .79, 1.073);
    for (let i = 0; i < 14; i++) {
      box(.016, .62, .045, 1.831, 2.52, -.93 + i * .115, dark, .005);
      box(.045, .018, .65, -1.4 + i * .21, 3.33, -.45, brown, .005);
    }
    box(3.95, .18, 1.3, 0, .18, 2.28, plastic, .06);
    box(3.7, .025, 1.1, 0, .284, 2.25, brown, .008);
    const keyGeo = new RoundedBoxGeometry(.22, .11, .19, 2, .018);
    const legends = canvasTexture(1024, 256);
    legends.ctx.fillStyle = "#34372f";
    legends.ctx.font = "24px monospace";
    const characters = ["ESC1234567890-+", "TABQWERTYUIOP[]", "CAPASDFGHJKL;'", "SHFZXCVBNM,./?"];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) legends.ctx.fillText(characters[row][col] ?? "", col * (1024 / 14) + 20, row * 64 + 40);
    }
    const legendMat = new THREE.MeshBasicMaterial({ map: legends.texture, transparent: true, depthWrite: false });
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        if (row === 3 && col > 3 && col < 10) continue;
        mesh(keyGeo, col === 0 || col === 13 ? accent : keys, -1.68 + col * .258, .35, 1.86 + row * .25);
        const face = new THREE.PlaneGeometry(.18, .15);
        const uv = face.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (col + uv.getX(i)) / 14, 1 - (row + 1 - uv.getY(i)) / 4);
        const label = mesh(face, legendMat, -1.68 + col * .258, .407, 1.86 + row * .25);
        label.rotation.x = -Math.PI / 2;
        label.castShadow = false;
      }
    }
    box(1.52, .11, .19, 0, .35, 2.61, accent, .025);
    const mouse = mesh(new THREE.SphereGeometry(1, 24, 16), trim, 2.65, .22, 2.1);
    mouse.scale.set(.33, .2, .52);
    box(.012, .016, .33, 2.65, .415, 1.97, brown, .003);
    const cable = new THREE.CatmullRomCurve3([new THREE.Vector3(2.65, .1, 1.7), new THREE.Vector3(2.9, .08, .5), new THREE.Vector3(2.1, .09, -.7), new THREE.Vector3(1.1, .3, -1.1)]);
    mesh(new THREE.TubeGeometry(cable, 32, .022, 6, false), dark, 0, 0, 0);
    const desk = mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .3 }), 0, .04, 0, scene);
    desk.rotation.x = -Math.PI / 2;
    desk.castShadow = false;
    scene.add(new THREE.HemisphereLight("#e8efff", "#363025", .7));
    const key = new THREE.DirectionalLight("#fff0d5", 2.2);
    key.position.set(-3, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -6;
    key.shadow.camera.right = key.shadow.camera.top = 6;
    key.shadow.normalBias = .035;
    scene.add(key);
    const rim = new THREE.DirectionalLight("#b9d5ed", 1.2);
    rim.position.set(4, 4, -4);
    scene.add(rim);
    const glow = new THREE.PointLight(tint, .6, 3);
    glow.position.set(0, 1, 1.8);
    scene.add(glow);
    const labels = ["identity.profile", "experience.timeline", "work.case-studies", "recruiter.path", "freelance.services", "accessibility.guard", "portfolio.interface"];
    const delays = [100, 280, 460, 640, 900, 1080, 1260];
    let lastScreen = -1;
    drawScreen = (elapsed) => {
      const step = phase === "idle" ? -2 : Math.floor(elapsed / 45);
      if (step === lastScreen) return;
      lastScreen = step;
      const ctx = display.ctx;
      ctx.fillStyle = "#020a06";
      ctx.fillRect(0, 0, 1024, 768);
      ctx.fillStyle = tint;
      ctx.shadowColor = tint;
      ctx.shadowBlur = 8;
      ctx.font = "bold 46px monospace";
      ctx.fillText("M0AZ_OS", 72, 106);
      ctx.font = "24px monospace";
      ctx.fillText("PERSONAL WORKSTATION / 2026", 72, 150);
      if (phase === "idle") {
        ctx.font = "32px monospace";
        ctx.fillText("READY TO INITIALIZE_", 72, 340);
        ctx.font = "24px monospace";
        ctx.fillText("Press POWER or type START", 72, 410);
      } else {
        ctx.font = "25px monospace";
        labels.forEach((label, i) => { if (elapsed >= delays[i]) ctx.fillText(`${label.padEnd(26)}[ OK ]`, 72, 230 + i * 48); });
        ctx.fillRect(72, 594, 880 * Math.min(1, Math.max(0, elapsed - 120) / 1750), 8);
        if (elapsed >= 1800) ctx.fillText("Session compiled. Welcome, visitor.", 72, 670);
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,.18)";
      for (let y = 0; y < 768; y += 4) ctx.fillRect(0, y, 1024, 1);
      display.texture.needsUpdate = true;
    };
    host.append(renderer.domElement);
    observer.observe(host);
    resize();
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("click", click);
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    invalidate();
    return {
      update(nextPhase, theme) {
        if (phase !== nextPhase && nextPhase !== "entering") phaseStart = performance.now();
        phase = nextPhase;
        tint = { phosphor: "#75ff70", amber: "#ffd17b", ice: "#a3eaff", light: "#75ff70" }[theme];
        ledMat.color.set(tint);
        glow.color.set(tint);
        lastScreen = -1;
        invalidate();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
